import type { AutoRoutePluginOptions } from './types';

export const BUILD_DIR = '.x-build'; // 构建目录

export const defaultOptions: AutoRoutePluginOptions = {
  entry: 'src/pages',
  exclude: ['**/components/**/*.vue'],
  extensions: ['.vue'],
  mode: 'js'
};
