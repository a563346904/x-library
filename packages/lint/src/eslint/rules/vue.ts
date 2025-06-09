import type { Linter } from 'eslint';

/**
 * Vue 基础规则配置
 */
export const vueBaseRules: Linter.RulesRecord = {
  // ===== 基础格式化规则 =====
  'prettier/prettier': 'error',
  semi: ['error', 'always'],

  // ===== Vue 基础规则 =====
  'vue/component-name-in-template-casing': ['error', 'PascalCase'],
  'vue/multi-word-component-names': 'off',
  'vue/no-setup-props-destructure': 'off',
  'vue/no-v-html': 'warn',
  'vue/require-default-prop': 'off',
  'vue/require-explicit-emits': 'error'
};

/**
 * Vue 属性和命名规则配置
 */
export const vueNamingRules: Linter.RulesRecord = {
  // ===== Vue 属性和命名规则 =====
  'vue/attribute-hyphenation': ['error', 'always'],
  'vue/custom-event-name-casing': ['error', 'kebab-case'],
  'vue/prop-name-casing': ['error', 'camelCase']
};

/**
 * Vue Composition API 规则配置
 */
export const vueCompositionRules: Linter.RulesRecord = {
  // ===== Vue Composition API 规则 =====
  'vue/define-emits-declaration': ['error', 'type-literal'],
  'vue/define-props-declaration': ['error', 'type-based'],
  'vue/no-boolean-default': ['error', 'default-false'],
  'vue/no-ref-as-operand': 'error',
  'vue/no-watch-after-await': 'error',
  'vue/prefer-define-options': 'error',
  'vue/require-macro-variable-name': 'error'
};

/**
 * Vue 最佳实践规则配置
 */
export const vueBestPracticeRules: Linter.RulesRecord = {
  // ===== Vue 最佳实践规则 =====
  'vue/no-duplicate-attr-inheritance': 'error',
  'vue/no-empty-component-block': 'error',
  'vue/no-multiple-objects-in-class': 'error',
  'vue/no-static-inline-styles': 'warn',
  'vue/no-useless-mustaches': 'error',
  'vue/no-useless-v-bind': 'error',
  'vue/prefer-separate-static-class': 'error'
};

/**
 * 所有 Vue 规则的组合
 */
export const allVueRules: Linter.RulesRecord = {
  ...vueBaseRules,
  ...vueNamingRules,
  ...vueCompositionRules,
  ...vueBestPracticeRules
};
