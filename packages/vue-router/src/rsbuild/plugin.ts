/**
 * RSBuild Vue Router 自动路由插件
 *
 * 功能特性:
 * - 基于文件系统的自动路由生成
 * - Nuxt 风格的布局系统
 * - 支持 definePageMeta 宏
 * - 热更新支持
 * - TypeScript 支持
 *
 * @packageDocumentation
 */

import { RsbuildPlugin } from '@rsbuild/core';
import type chokidar from 'chokidar';
import type VirtualModulePlugin from 'rspack-plugin-virtual-module';

import { mergeOptions } from '../options';
import type { RouteOptions } from '../types';

import { setupFileWatcher } from './file-watcher';
import { configureRspack } from './rspack-config';
import { unpluginDefinePageMeta } from './unplugin-define-page-meta';

/**
 * 创建 Rsbuild 自动路由插件
 *
 * @param userOptions - 用户配置选项
 * @returns Rsbuild 插件实例
 *
 * @example
 * ```ts
 * import { defineConfig } from '@rsbuild/core';
 * import { rsAutoRoutes } from '@x-library/vue-router/rsbuild';
 *
 * export default defineConfig({
 *   plugins: [
 *     rsAutoRoutes({
 *       pagesDir: 'src/pages',
 *       layoutsDir: 'src/layouts',
 *       enableLayouts: true,
 *       namespace: 'X'
 *     })
 *   ]
 * });
 * ```
 */
export function rsAutoRoutes(userOptions: Partial<RouteOptions> = {}): RsbuildPlugin {
  // 合并用户配置和默认配置
  const options: RouteOptions = mergeOptions(userOptions);

  // 插件内部状态
  let virtualModulePluginInstance: VirtualModulePlugin;
  let virtualModulePluginPromise: Promise<VirtualModulePlugin>;
  const watchers: {
    pageWatcher?: ReturnType<typeof chokidar.watch>;
    layoutWatcher?: ReturnType<typeof chokidar.watch>;
  } = {};

  return {
    name: 'rsbuild-plugin-vue-router',

    setup(api) {
      // 创建一个 Promise 来跟踪虚拟模块插件的初始化
      virtualModulePluginPromise = new Promise<VirtualModulePlugin>(resolve => {
        // 修改 RSpack 配置
        api.modifyRspackConfig(async config => {
          // 配置虚拟模块和监听选项
          const result = await configureRspack(config, options);
          virtualModulePluginInstance = result.virtualModulePlugin;

          // 解析 Promise，表示插件已初始化
          resolve(virtualModulePluginInstance);

          // 只在启用 layouts 功能时添加 definePageMeta 转换插件
          if (options.enableLayouts) {
            const rspackPlugin = unpluginDefinePageMeta.rspack();
            config.plugins = config.plugins || [];
            config.plugins.push(rspackPlugin);
          }
        });
      });

      // 在开发服务器启动前设置文件监听
      api.onBeforeStartDevServer(() => {
        // 使用 Promise.then 而不是 async/await，保持回调函数同步
        virtualModulePluginPromise
          .then(plugin => {
            const result = setupFileWatcher(options, plugin);
            watchers.pageWatcher = result.pageWatcher;
            watchers.layoutWatcher = result.layoutWatcher;
            console.log('[vue-router] 文件监听已设置');
          })
          .catch(error => {
            console.error('[vue-router] 设置文件监听失败:', error);
          });
      });

      // 清理资源
      api.onExit(() => {
        // 清理虚拟模块
        virtualModulePluginInstance?.clear();

        // 关闭文件监听器
        watchers.pageWatcher?.close();
        watchers.layoutWatcher?.close();
      });
    }
  };
}
