import type { Linter } from 'eslint';

/**
 * 性能优化规则配置
 */
export const performanceRules: Linter.RulesRecord = {
  // ===== 性能优化规则 =====
  'no-array-constructor': 'error',
  'no-loop-func': 'error',
  'no-new-object': 'error',
  'no-new-wrappers': 'error'
};
