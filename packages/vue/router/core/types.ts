// type.ts
import { type RouteRecordRaw } from 'vue-router';

export interface AutoRoutePluginOptions {
  /**
   * @description 入口文件
   * @default 'src/pages'
   */
  entry: string;

  /**
   * @description 忽略的文件
   * @default ['**\/components\/**\/*.vue']
   */
  exclude: string | string[] | ((p: string) => boolean);

  /**
   * @description 扫描的文件后缀名
   * @default ['.vue']
   */
  extensions: string[];

  /**
   * @description 是否是 ts 模式
   * @default 'js'
   */
  mode: 'js' | 'ts';
}

export interface RouteInfo {
  path: string;
  name: string;
  filePath: string;
  relativePath: string;
  meta: RouteRecordRaw['meta'] & {
    generated: boolean;
    filePath: string;
    originalPath: string;
    componentName: string;
  };
}

export type NestedRouteInfo = RouteInfo & { children: NestedRouteInfo[] };
