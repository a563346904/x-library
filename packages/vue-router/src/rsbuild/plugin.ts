import { RsbuildPlugin } from '@rsbuild/core';
import chokidar from 'chokidar';
import VirtualModulePlugin from 'rspack-plugin-virtual-module';

import { generateRoutes, generateRoutesCode } from '../core/generator';
import { scanPages } from '../core/scanner';
import { ImportMode } from '../enums';
import { mergeOptions } from '../options';
import type { RouteOptions } from '../types';

import { createRoutesVirtualModule, updateRoutesVirtualModule } from './virtual-module';

/**
 * 生成虚拟模块内容
 * @param options 插件选项
 * @returns 虚拟模块的代码内容
 */
async function generateVirtualModuleContent(options: RouteOptions): Promise<string> {
  try {
    // 扫描页面文件
    const pageFiles = await scanPages(options);

    // 生成路由定义
    const routes = await generateRoutes(pageFiles, options);

    // 生成路由代码
    const routesCode = generateRoutesCode(routes, options.importMode as ImportMode);

    return routesCode;
  } catch (error) {
    console.error('[vue-router] 生成虚拟模块内容失败:', error);
    return 'export default [];';
  }
}

/**
 * 设置文件监听
 */
function setupFileWatcher(
  options: RouteOptions,
  virtualModulePlugin: VirtualModulePlugin
): ReturnType<typeof chokidar.watch> {
  const watcher = chokidar.watch(options.pagesDir, {
    ignored: options.exclude,
    ignoreInitial: true
  });

  // 防抖定时器
  let debounceTimer: NodeJS.Timeout;

  const updateRoutes = async () => {
    // 清除之前的定时器
    clearTimeout(debounceTimer);

    // 设置300ms防抖
    debounceTimer = setTimeout(async () => {
      try {
        console.log('[vue-router] 检测到文件变化，重新生成路由...');
        const routesCode = await generateVirtualModuleContent(options);
        updateRoutesVirtualModule(options.virtualModule, virtualModulePlugin, routesCode);
        console.log('[vue-router] 路由更新完成');
      } catch (error) {
        console.error('[vue-router] 更新路由失败:', error);
      }
    }, 300);
  };

  watcher.on('add', updateRoutes);
  watcher.on('unlink', updateRoutes);
  watcher.on('addDir', updateRoutes);
  watcher.on('unlinkDir', updateRoutes);

  return watcher;
}

/**
 * 配置 Rspack 选项
 */
async function configureRspack(
  config: {
    plugins?: unknown[];
    watchOptions?: { ignored?: string | RegExp | (string | RegExp)[] };
  },
  options: RouteOptions
): Promise<VirtualModulePlugin> {
  const routesCode = await generateVirtualModuleContent(options);

  // 使用虚拟模块工具创建路由模块
  const virtualModulePlugin = createRoutesVirtualModule(options.virtualModule, routesCode);

  // 添加插件到 Rspack 配置
  config.plugins = config.plugins || [];
  config.plugins.push(virtualModulePlugin);

  // 配置监听选项，确保虚拟模块文件夹不被忽略
  const watchOptions = config.watchOptions || {};
  config.watchOptions = {
    ...watchOptions,
    ignored: Array.isArray(watchOptions.ignored)
      ? [...watchOptions.ignored, '!**/node_modules/rspack-virtual-module-*/**']
      : ['!**/node_modules/rspack-virtual-module-*/**']
  };

  return virtualModulePlugin;
}

/**
 * 创建 Rsbuild 自动路由插件
 * @param userOptions 用户配置选项
 * @returns Rsbuild 插件
 */
export function rsAutoRoutes(userOptions: Partial<RouteOptions> = {}): RsbuildPlugin {
  const options: RouteOptions = mergeOptions(userOptions);

  let virtualModulePluginInstance: VirtualModulePlugin;
  let watcher: ReturnType<typeof chokidar.watch>;

  return {
    name: 'rsbuild-plugin-vue-router',

    setup(api) {
      api.modifyRspackConfig(async config => {
        virtualModulePluginInstance = await configureRspack(config, options);
      });

      api.onBeforeStartDevServer(() => {
        watcher = setupFileWatcher(options, virtualModulePluginInstance);
      });

      api.onExit(() => {
        virtualModulePluginInstance?.clear();
        watcher?.close();
      });
    }
  };
}
