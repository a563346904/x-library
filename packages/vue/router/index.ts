/**
 * Vue Router 扩展工具
 * @module @x-library/vue/router
 */

// 导出构建工具插件
import rsAutoRoute from './rsbuild';
import viteAutoRoute from './vite';
import webpackAutoRoute from './webpack';

// 分别导出各个工具的命名空间
export { rsAutoRoute, viteAutoRoute, webpackAutoRoute };

/**
 * 构建工具插件集合
 */
export const plugins = {
  rsbuild: rsAutoRoute,
  webpack: webpackAutoRoute,
  vite: viteAutoRoute
};

// 其他 router 功能可以在此处添加
