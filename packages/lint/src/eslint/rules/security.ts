import type { Linter } from 'eslint';

/**
 * 安全性规则配置
 */
export const securityRules: Linter.RulesRecord = {
  // ===== 安全性规则 =====
  'no-caller': 'error',
  'no-eval': 'error',
  'no-extend-native': 'error',
  'no-implied-eval': 'error',
  'no-new-func': 'error',
  'no-proto': 'error',
  'no-return-assign': 'error',
  'no-script-url': 'error',
  'no-throw-literal': 'error'
};
