import { readdirSync, statSync } from 'fs';
import { resolve } from 'path';

import micromatch from 'micromatch';

import type { AutoRoutePluginOptions } from './types';

export function scanViewsDirectory(
  viewsPath: string,

  params: AutoRoutePluginOptions
): string[] {
  const files: string[] = [];
  const { exclude, extensions } = params;

  function isExcluded(p: string): boolean {
    if (typeof exclude === 'function') {
      return exclude(p);
    }
    // micromatch a string or array of strings
    return micromatch.isMatch(p, exclude);
  }

  function scanDir(dir: string, relativePath = ''): void {
    try {
      const entries = readdirSync(dir);

      for (const entry of entries) {
        const fullPath = resolve(dir, entry);
        const currentRelativePath = relativePath ? `${relativePath}/${entry}` : entry;

        if (isExcluded(currentRelativePath)) {
          continue;
        }

        if (statSync(fullPath).isDirectory()) {
          // 递归扫描子目录
          scanDir(fullPath, currentRelativePath);
        } else if (extensions.some(ext => entry.endsWith(ext))) {
          // 添加.vue文件
          files.push(currentRelativePath);
        }
      }
    } catch (error) {
      console.warn(`扫描目录失败: ${dir}`, error);
    }
  }

  scanDir(viewsPath);

  return files.sort(); // 排序保证一致性
}
