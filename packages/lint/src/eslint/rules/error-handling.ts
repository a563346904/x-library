import type { Linter } from 'eslint';

/**
 * 错误处理规则配置
 */
export const errorHandlingRules: Linter.RulesRecord = {
  // ===== 错误处理规则 =====
  'default-case': 'warn',
  'no-empty': ['error', { allowEmptyCatch: false }],
  'no-empty-function': 'warn',
  'no-fallthrough': 'error',
  'no-unreachable': 'error',
  'no-unused-expressions': 'error'
};
