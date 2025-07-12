/**
 * RSpack 配置器
 * 负责配置 RSpack 以支持虚拟模块和文件监听
 */

import {
  generateLayoutsExport,
  generateLayoutsModule,
  generateVirtualModuleContent
} from '@x-library/vue-router-shared';
import { type LayoutFile, RouteOptions, scanLayouts } from '@x-library/vue-router-shared';
import VirtualModulePlugin from 'rspack-plugin-virtual-module';

/**
 * RSpack 配置接口
 */
interface RspackConfig {
  plugins?: unknown[];
  watchOptions?: {
    ignored?: string | RegExp | (string | RegExp)[];
  };
}

/**
 * 配置 Rspack 选项
 * 初始化虚拟模块并配置监听选项
 *
 * @param config RSpack 配置对象
 * @param options 路由配置选项
 * @returns 虚拟模块插件实例和布局文件列表
 */
export async function configureRspack(
  config: RspackConfig,
  options: RouteOptions
): Promise<{ virtualModulePlugin: VirtualModulePlugin; layouts: LayoutFile[] }> {
  // 生成路由代码
  const routesCode = await generateVirtualModuleContent(options);

  // 扫描布局文件
  let layouts: LayoutFile[] = [];
  let layoutsModuleContent = 'export default {}';
  let layoutsExportContent = '';

  if (options.enableLayouts && options.layoutsDir) {
    layouts = await scanLayouts({
      layoutsDir: options.layoutsDir,
      exclude: options.exclude,
      extensions: options.extensions
    });

    layoutsModuleContent = generateLayoutsModule(layouts);
    layoutsExportContent = generateLayoutsExport(options);
  }

  // 创建虚拟模块映射
  const virtualModules: Record<string, string> = {
    [options.virtualModule]: routesCode,
    '~virtual-layouts': layoutsModuleContent,
    '~virtual-layouts-export': layoutsExportContent
  };

  // 只在启用 layouts 功能时添加 macros 模块
  if (options.enableLayouts) {
    virtualModules['~virtual-macros'] =
      `export { definePageMeta } from '@x-library/vue-router-shared/macros';`;
  }

  // 使用虚拟模块插件
  const virtualModulePlugin = new VirtualModulePlugin(virtualModules);

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

  return { virtualModulePlugin, layouts };
}
