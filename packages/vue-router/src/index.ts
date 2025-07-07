// 主入口文件
// 导出核心功能
export { scanPages } from './core/scanner';
export { parsePageFilePath } from './core/parser';
export { generateRoutes, generateRoutesCode } from './core/generator';
export { scanLayouts, type LayoutFile, type LayoutScanOptions } from './core/layout-scanner';
export { transformDefinePageMeta } from './core/transform';

// 导出布局系统
export {
  createLayoutComponent,
  initLayouts,
  Layout,
  definePageMeta,
  useLayouts,
  setPageLayout,
  getCurrentLayout,
  type PageMeta,
  type LayoutContext
} from './layouts';

// 导出 RSBuild 插件
export { rsAutoRoutes } from './rsbuild';

// 导出类型和枚举
export * from './types';
export * from './enums';
export * from './options';
