import type { Linter } from 'eslint';

/**
 * 代码维护性规则配置
 */
export const maintainabilityRules: Linter.RulesRecord = {
  // ===== 代码维护性规则 =====
  complexity: ['warn', 10],
  'max-depth': ['warn', 4],
  'max-lines-per-function': ['warn', 50],
  'max-params': ['warn', 4]
};
