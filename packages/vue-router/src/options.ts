import type { RouteOptions } from './types';

/**
 * 默认路由配置
 */
export const DEFAULT_ROUTE_OPTIONS: Partial<RouteOptions> = {
  pagesDir: 'src/pages',
  extensions: ['.vue'],
  exclude: [
    '**/node_modules/**',
    '**/dist/**',
    '**/.*/**',
    '**/components/**' // 默认排除组件目录
  ],
  importMode: 'async',
  virtualModule: '~virtual-routes',
  enableLayouts: false,
  layoutsDir: 'src/layouts',
  defaultLayout: 'default'
};

/**
 * 合并用户配置与默认配置
 * @param userOptions 用户提供的配置
 * @returns 合并后的配置
 */
export function mergeOptions(userOptions: Partial<RouteOptions> = {}): RouteOptions {
  return { ...DEFAULT_ROUTE_OPTIONS, ...userOptions } as RouteOptions;
}
