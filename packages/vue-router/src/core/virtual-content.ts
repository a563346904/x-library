/**
 * 虚拟模块内容生成工具
 * 包含所有构建工具共享的内容生成逻辑
 */

import { readFile } from 'fs/promises';

import { ImportMode } from '../enums';
import type { RouteOptions } from '../types';

import { generateRoutes, generateRoutesCode } from './generator';
import { scanPages } from './scanner';
import { extractPageMeta } from './transform';

/**
 * 页面元信息缓存
 * 用于检测 definePageMeta 内容是否发生变化
 */
const pageMetaCache = new Map<string, string>();

/**
 * 检查页面元信息是否发生变化
 * @param filePath 文件路径
 * @param options 路由选项
 * @returns 是否需要更新路由
 */
export async function hasPageMetaChanged(
  filePath: string,
  options: RouteOptions
): Promise<boolean> {
  try {
    // 只检查 .vue 文件
    if (!filePath.endsWith('.vue')) {
      return true; // 非 Vue 文件，直接触发更新
    }

    // 构建完整路径
    const fullPath = filePath.startsWith('/') ? filePath : `${options.pagesDir}/${filePath}`;

    // 读取文件内容
    const content = await readFile(fullPath, 'utf-8');

    // 提取 definePageMeta 内容
    const pageMeta = extractPageMeta(content);
    const metaString = JSON.stringify(pageMeta);

    // 获取缓存的内容
    const cachedMeta = pageMetaCache.get(fullPath);

    // 如果内容发生变化或者是新文件
    if (cachedMeta !== metaString) {
      pageMetaCache.set(fullPath, metaString);
      return true;
    }

    return false;
  } catch (error) {
    console.error('[vue-router] 检查文件变化时出错:', error);
    return true; // 出错时触发更新以确保安全
  }
}

/**
 * 生成虚拟模块内容
 * 扫描页面文件并生成路由配置
 *
 * @param options 插件选项
 * @returns 虚拟模块的代码内容
 */
export async function generateVirtualModuleContent(options: RouteOptions): Promise<string> {
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
 * 创建防抖函数
 * @param fn 要防抖的函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout;

  return function (...args: Parameters<T>) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
