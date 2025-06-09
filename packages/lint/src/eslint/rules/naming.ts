import type { Linter } from 'eslint';

/**
 * 命名约定规则配置
 */
export const namingRules: Linter.RulesRecord = {
  // ===== 命名约定规则 =====
  camelcase: ['error', { properties: 'never', ignoreDestructuring: true }],
  'new-cap': ['error', { newIsCap: true, capIsNew: false }],
  'no-underscore-dangle': [
    'warn',
    { allowAfterThis: true, allow: ['_id', '__dirname', '__filename'] }
  ]
};
