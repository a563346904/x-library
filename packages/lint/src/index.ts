// 导出 ESLint 配置
export { config as eslintConfig, default as eslint } from './eslint/index.js';

// 导出 Prettier 配置
export { prettierConfig } from './prettier/index.js';
export type { PrettierConfig } from './prettier/index.js';

// 导出 Commitlint 配置
export { commitlintConfig, defaultCommitTypes, RuleConfigSeverity } from './commitlint/index.js';
export type { CommitlintConfig, CommitType } from './commitlint/index.js';

// 主导出
export { config as default } from './eslint/index.js';
