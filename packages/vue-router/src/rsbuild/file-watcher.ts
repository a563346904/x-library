/**
 * RSBuild 特定的文件监听处理器
 * 使用 chokidar 监听文件变化并更新 RSpack 虚拟模块
 */

import chokidar from 'chokidar';
import VirtualModulePlugin from 'rspack-plugin-virtual-module';

import { generateLayoutsModule } from '../core/layout-generator';
import { scanLayouts } from '../core/layout-scanner';
import { generateVirtualModuleContent, hasPageMetaChanged } from '../core/virtual-content';
import type { RouteOptions } from '../types';

import { updateRoutesVirtualModule } from './virtual-module';

/**
 * 创建页面文件更新处理器
 * 当页面文件发生变化时重新生成路由
 *
 * @param options 路由配置选项
 * @param virtualModulePlugin 虚拟模块插件实例
 * @returns 更新处理函数
 */
function createPageUpdateHandler(
  options: RouteOptions,
  virtualModulePlugin: VirtualModulePlugin
): (path: string) => Promise<void> {
  let debounceTimer: NodeJS.Timeout;

  return async (filePath: string) => {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(async () => {
      try {
        console.log(`[vue-router] 检测到文件变化: ${filePath}`);

        // 检查虚拟模块插件是否已初始化
        if (!virtualModulePlugin || typeof virtualModulePlugin.writeModule !== 'function') {
          console.error('[vue-router] 虚拟模块插件未初始化，跳过更新');
          return;
        }

        // 检查 definePageMeta 是否发生变化
        const needsUpdate = await hasPageMetaChanged(filePath, options);

        if (!needsUpdate) {
          return; // 内容未变化，跳过更新
        }

        const routesCode = await generateVirtualModuleContent(options);
        updateRoutesVirtualModule(options.virtualModule, virtualModulePlugin, routesCode);
      } catch (error) {
        console.error('[vue-router] 更新路由失败:', error);
      }
    }, 300);
  };
}

/**
 * 创建布局文件更新处理器
 * 当布局文件发生变化时重新生成布局模块
 *
 * @param options 路由配置选项
 * @param virtualModulePlugin 虚拟模块插件实例
 * @returns 更新处理函数
 */
function createLayoutUpdateHandler(
  options: RouteOptions,
  virtualModulePlugin: VirtualModulePlugin
): () => Promise<void> {
  let debounceTimer: NodeJS.Timeout;

  return async () => {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(async () => {
      try {
        console.log('[vue-router] 检测到布局文件变化，重新生成布局...');

        const layouts = await scanLayouts({
          layoutsDir: options.layoutsDir!,
          exclude: options.exclude,
          extensions: options.extensions
        });

        const layoutsModuleContent = generateLayoutsModule(layouts);
        virtualModulePlugin.writeModule('~virtual-layouts', layoutsModuleContent);

        console.log('[vue-router] 布局更新完成');
      } catch (error) {
        console.error('[vue-router] 更新布局失败:', error);
      }
    }, 300);
  };
}

/**
 * 设置文件监听
 * 监听页面和布局文件的变化
 *
 * @param options 路由配置选项
 * @param virtualModulePlugin 虚拟模块插件实例
 * @returns 监听器实例
 */
export function setupFileWatcher(
  options: RouteOptions,
  virtualModulePlugin: VirtualModulePlugin
): {
  pageWatcher: ReturnType<typeof chokidar.watch>;
  layoutWatcher?: ReturnType<typeof chokidar.watch>;
} {
  // 设置页面文件监听
  const pageWatcher = chokidar.watch(options.pagesDir, {
    ignored: options.exclude,
    ignoreInitial: true
  });

  const updateRoutes = createPageUpdateHandler(options, virtualModulePlugin);

  // 监听页面文件的增删改
  pageWatcher.on('add', updateRoutes);
  pageWatcher.on('unlink', updateRoutes);
  pageWatcher.on('addDir', updateRoutes);
  pageWatcher.on('unlinkDir', updateRoutes);
  pageWatcher.on('change', updateRoutes); // 添加对文件内容变化的监听

  // 设置布局文件监听
  let layoutWatcher: ReturnType<typeof chokidar.watch> | undefined;

  if (options.enableLayouts && options.layoutsDir) {
    layoutWatcher = chokidar.watch(options.layoutsDir, {
      ignored: options.exclude,
      ignoreInitial: true
    });

    const updateLayouts = createLayoutUpdateHandler(options, virtualModulePlugin);

    // 监听布局文件的增删改
    layoutWatcher.on('add', updateLayouts);
    layoutWatcher.on('unlink', updateLayouts);
    layoutWatcher.on('change', updateLayouts);
  }

  return { pageWatcher, layoutWatcher };
}
