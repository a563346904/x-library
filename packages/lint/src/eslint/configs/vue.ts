import type { Linter } from 'eslint';
import * as pluginVue from 'eslint-plugin-vue';
import globals from 'globals';

import { vuePlugins } from '../plugins';
import { allVueRules, importRules, qualityRules } from '../rules';

/**
 * Vue 文件专用配置
 */
export const vueConfig: Linter.FlatConfig = {
  files: ['**/*.vue'],
  languageOptions: {
    globals: globals.browser
  },
  plugins: vuePlugins,
  rules: allVueRules
};

/**
 * Vue 文件中的 JavaScript/TypeScript 配置
 */
export const vueJavaScriptConfig: Linter.FlatConfig = {
  files: ['**/*.vue'],
  plugins: {
    import: vuePlugins.import
  },
  rules: {
    ...qualityRules,
    ...importRules
  }
};

/**
 * Vue 基础配置 (使用 flat/recommended)
 */
export const vueBaseConfig = pluginVue.configs?.['flat/recommended'] || [];
