import type { Linter } from 'eslint';

/**
 * 代码质量规则配置
 */
export const qualityRules: Linter.RulesRecord = {
  // ===== 代码质量规则 =====
  'no-var': 'error',
  'object-shorthand': 'error',
  'prefer-const': 'error',
  'prefer-template': 'error'
};
