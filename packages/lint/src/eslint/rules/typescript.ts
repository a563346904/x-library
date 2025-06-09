import type { Linter } from 'eslint';

/**
 * TypeScript 规则配置
 */
export const typescriptRules: Linter.RulesRecord = {
  // ===== TypeScript 规则 =====
  '@typescript-eslint/no-explicit-any': 'warn',
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }
  ]
};
