import type { Linter } from 'eslint';

/**
 * Import 管理规则配置
 */
export const importRules: Linter.RulesRecord = {
  // ===== Import 管理规则 =====
  'import/newline-after-import': 'error',
  'import/no-duplicates': 'error',
  'import/order': [
    'error',
    {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'newlines-between': 'always',
      alphabetize: { order: 'asc', caseInsensitive: true }
    }
  ],
  'sort-imports': [
    'error',
    {
      ignoreCase: true,
      ignoreDeclarationSort: true,
      ignoreMemberSort: false,
      memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      allowSeparatedGroups: false
    }
  ]
};
