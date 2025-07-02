// 主入口文件
// 导出核心功能
export * from './core/scanner';
export * from './core/parser';
export * from './core/generator';

// 导出 RSBuild 插件
export { rsAutoRoutes } from './rsbuild';

// 导出类型和枚举
export * from './types';
export * from './enums';
