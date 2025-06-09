import type { Linter } from 'eslint';

/**
 * Prettier 规则配置
 */
export const prettierRules: Linter.RulesRecord = {
  // ===== Prettier 格式化规则 =====
  // 让 eslint-plugin-prettier 自动读取项目中的 prettier 配置文件
  'prettier/prettier': ['error', {}, { usePrettierrc: true }]
};
