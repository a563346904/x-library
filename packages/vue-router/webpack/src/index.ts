import type { RouteOptions } from '@x-library/vue-router-shared';
import {
  generateLayoutsExport,
  generateLayoutsModule,
  generateVirtualModuleContent,
  mergeOptions,
  scanLayouts,
  unpluginDefinePageMeta
} from '@x-library/vue-router-shared';
import { watch } from 'chokidar';
import { join } from 'pathe';
import type { Compiler } from 'webpack';
import VirtualModulesPlugin from 'webpack-virtual-modules';

export class WebpackAutoRoutesPlugin {
  private options: RouteOptions;
  private virtualModules: VirtualModulesPlugin;
  private watcher: ReturnType<typeof watch> | null = null;

  constructor(userOptions: Partial<RouteOptions> = {}) {
    this.options = mergeOptions(userOptions);
    this.virtualModules = new VirtualModulesPlugin();
  }

  apply(compiler: Compiler) {
    const pluginName = 'WebpackAutoRoutesPlugin';

    // 添加虚拟模块插件
    this.virtualModules.apply(compiler);

    // 只在启用 layouts 时添加 unplugin
    if (this.options.enableLayouts) {
      const webpackPlugin = unpluginDefinePageMeta.webpack();
      webpackPlugin.apply(compiler);
    }

    compiler.hooks.beforeCompile.tapAsync(pluginName, async (params, callback) => {
      try {
        // 生成路由代码
        const routesContent = await generateVirtualModuleContent(this.options);
        this.virtualModules.writeModule(
          `node_modules/${this.options.virtualModule}.js`,
          routesContent
        );

        // 生成布局代码
        if (this.options.enableLayouts && this.options.layoutsDir) {
          const layouts = await scanLayouts({
            layoutsDir: this.options.layoutsDir,
            exclude: this.options.exclude,
            extensions: this.options.extensions
          });

          const layoutsModuleContent = generateLayoutsModule(layouts);
          const layoutsExportContent = generateLayoutsExport(this.options);

          this.virtualModules.writeModule('node_modules/~virtual-layouts.js', layoutsModuleContent);

          this.virtualModules.writeModule(
            'node_modules/~virtual-layouts-export.js',
            layoutsExportContent
          );

          if (this.options.enableLayouts) {
            this.virtualModules.writeModule(
              'node_modules/~virtual-macros.js',
              `export { definePageMeta } from '@x-library/vue-router/macros';`
            );
          }
        }

        callback();
      } catch (error) {
        callback(error as Error);
      }
    });

    // 设置文件监听
    compiler.hooks.watchRun.tapAsync(pluginName, async (compiler, callback) => {
      if (!this.watcher) {
        const watchPaths = [join(this.options.pagesDir, '**/*')];
        if (this.options.enableLayouts && this.options.layoutsDir) {
          watchPaths.push(join(this.options.layoutsDir, '**/*'));
        }

        this.watcher = watch(watchPaths, {
          ignoreInitial: true,
          ignored: this.options.exclude
        });

        this.watcher.on('all', async (event, filePath) => {
          console.log(`[vue-router] 文件变化: ${event} ${filePath}`);

          // 重新生成路由
          const routesContent = await generateVirtualModuleContent(this.options);
          this.virtualModules.writeModule(
            `node_modules/${this.options.virtualModule}.js`,
            routesContent
          );

          // 重新生成布局
          if (
            this.options.enableLayouts &&
            this.options.layoutsDir &&
            filePath.includes(this.options.layoutsDir)
          ) {
            const layouts = await scanLayouts({
              layoutsDir: this.options.layoutsDir,
              exclude: this.options.exclude,
              extensions: this.options.extensions
            });

            const layoutsModuleContent = generateLayoutsModule(layouts);
            const layoutsExportContent = generateLayoutsExport(this.options);

            this.virtualModules.writeModule(
              'node_modules/~virtual-layouts.js',
              layoutsModuleContent
            );

            this.virtualModules.writeModule(
              'node_modules/~virtual-layouts-export.js',
              layoutsExportContent
            );
          }
        });

        console.log('[vue-router] 文件监听已设置');
      }

      callback();
    });

    // 清理资源
    compiler.hooks.watchClose.tap(pluginName, () => {
      if (this.watcher) {
        this.watcher.close();
        this.watcher = null;
      }
    });

    // 设置模块解析
    compiler.options.resolve = compiler.options.resolve || {};
    compiler.options.resolve.alias = compiler.options.resolve.alias || {};

    // 添加虚拟模块别名
    const aliases = compiler.options.resolve.alias as Record<string, string>;
    aliases[this.options.virtualModule] =
      `${compiler.context}/node_modules/${this.options.virtualModule}.js`;
    aliases['~virtual-layouts'] = `${compiler.context}/node_modules/~virtual-layouts.js`;
    aliases['~virtual-layouts-export'] =
      `${compiler.context}/node_modules/~virtual-layouts-export.js`;

    if (this.options.enableLayouts) {
      aliases['~virtual-macros'] = `${compiler.context}/node_modules/~virtual-macros.js`;
    }
  }
}

export function webpackAutoRoutes(options?: Partial<RouteOptions>) {
  return new WebpackAutoRoutesPlugin(options);
}
