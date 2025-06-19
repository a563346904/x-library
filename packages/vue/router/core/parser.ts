import { resolve } from 'path';

import type { AutoRoutePluginOptions, RouteInfo } from './types';

function filePathToRoutePath(filePath: string, extensions: string[]): string {
  // 移除文件扩展名
  const extPattern = `(${extensions.join('|').replace(/\./g, '\\.')})$`;
  const extRegex = new RegExp(extPattern);
  let routePath = filePath.replace(extRegex, '');

  // 处理 index 文件映射到根路径
  if (routePath === 'index' || routePath.endsWith('/index')) {
    routePath = routePath.replace(/\/index$/, '') || '/';
  }

  // 处理动态路由 [param] -> :param
  routePath = routePath.replace(/\[([^\]]+)\]/g, ':$1');

  // 确保以 / 开头
  if (!routePath.startsWith('/')) {
    routePath = `/${routePath}`;
  }

  return routePath;
}

/**
 * 将文件路径转换为路由名称
 */
export function filePathToRouteName(filePath: string, extensions: string[]): string {
  let name = filePath
    .replace(new RegExp(`(${extensions.join('|').replace(/\./g, '\\.')})$`), '')
    .replace(/\//g, '_')
    .replace(/\[([^\]]+)\]/g, '$1');

  // 处理 index 文件
  if (name === 'index') {
    name = 'Home';
  }

  // 首字母大写，驼峰命名
  // 替换所有非法字符为分隔符，然后按分隔符切分
  return name
    .replace(/[ :.]/g, '_') // 将冒号、空格、点等替换为下划线
    .split(/[-_]/) // 按下划线和横线分割
    .filter(Boolean) // 过滤掉因连续分隔符产生的空字符串
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

export function generateRouteInfo(filePath: string, params: AutoRoutePluginOptions): RouteInfo {
  const routePath = filePathToRoutePath(filePath, params.extensions);
  const routeName = filePathToRouteName(filePath, params.extensions);
  const fullPath = resolve(process.cwd(), params.entry, filePath);

  return {
    path: routePath,
    name: routeName,
    filePath: fullPath,
    relativePath: filePath,
    meta: {
      generated: true,
      filePath: `/src/views/${filePath}`,
      originalPath: filePath,
      componentName: routeName
    }
  };
}
