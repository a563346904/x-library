import type { Linter } from 'eslint';
import configPrettier from 'eslint-config-prettier';

/**
 * Prettier 配置（必须放在最后）
 */
export const prettierConfig: Linter.FlatConfig = {
  files: ['**/*.{js,mjs,jsx,ts,tsx,vue}'],
  ...configPrettier
};
