/**
 * RSBuild 插件导出模块
 *
 * @module @x-library/vue-router/rsbuild
 */

import { rsAutoRoutes } from './plugin';

// 导出主插件
export { rsAutoRoutes };

// 导出默认插件
export default rsAutoRoutes;

// 导出类型定义（从主包导出，避免重复）
export type { RouteOptions, RouteInfo } from '../../shared/types';
