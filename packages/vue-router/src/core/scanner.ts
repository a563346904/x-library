import { resolve } from 'path';

import fastGlob from 'fast-glob';

import type { RouteOptions } from '../types';

/**
 * 规范化扩展名格式，确保所有扩展名都以点号开头
 * @param extensions 扩展名数组
 * @returns 规范化后的扩展名数组
 */
function normalizeExtensions(extensions: string[]): string[] {
  return extensions.map(ext => (ext.startsWith('.') ? ext : `.${ext}`));
}

/**
 * 构建glob匹配模式
 * @param extensions 规范化后的扩展名数组
 * @returns glob匹配模式字符串
 */
function buildGlobPattern(extensions: string[]): string {
  return `**/*${extensions.length === 1 ? extensions[0] : `{${extensions.join(',')}}`}`;
}

/**
 * 通用的目录扫描函数
 * @param dir 要扫描的目录路径
 * @param options 扫描选项
 * @returns 扫描到的文件路径数组
 */
async function scanDirectory(
  dir: string,
  options: {
    extensions?: string[];
    exclude?: string[];
  } = {}
): Promise<string[]> {
  const { extensions = [], exclude = [] } = options;
  const normalizedExtensions = normalizeExtensions(extensions);
  const pattern = buildGlobPattern(normalizedExtensions);
  const allExcludes = [...exclude];

  try {
    return await fastGlob(pattern, {
      cwd: resolve(process.cwd(), dir),
      ignore: allExcludes,
      onlyFiles: true
    });
  } catch (error) {
    console.error(
      `扫描目录失败 [${dir}]: ${error instanceof Error ? error.message : String(error)}`
    );
    return [];
  }
}

/**
 * 扫描页面目录，查找所有页面文件
 * @param options 路由配置选项
 * @returns 相对于pagesDir的文件路径数组
 */
export async function scanPages(options: RouteOptions): Promise<string[]> {
  const { pagesDir, exclude = [], extensions = [] } = options;
  return scanDirectory(pagesDir, { extensions, exclude });
}

/**
 * 扫描布局目录，查找所有布局文件
 * @param layoutsDir 布局目录
 * @param extensions 文件扩展名数组
 * @param exclude 要排除的文件模式数组
 * @returns 相对于layoutsDir的文件路径数组
 */
export async function scanLayouts(
  layoutsDir: string,
  extensions: string[] = [],
  exclude: string[] = []
): Promise<string[]> {
  return scanDirectory(layoutsDir, { extensions, exclude });
}
