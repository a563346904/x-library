// 导出 ESLint 配置
export { config as eslintConfig, default as eslint } from './eslint/index.js';

// 导出 Prettier 配置
export { prettierConfig } from './prettier/index.js';
export type { PrettierConfig } from './prettier/index.js';

// 主导出
export { config as default } from './eslint/index.js';
