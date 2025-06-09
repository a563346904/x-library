/**
 * ESLint 插件配置模块
 */

import * as pluginImport from 'eslint-plugin-import';
import * as pluginPrettier from 'eslint-plugin-prettier';
import * as pluginVue from 'eslint-plugin-vue';

/**
 * 基础插件配置
 */
export const basePlugins = {
  import: pluginImport.default || pluginImport,
  prettier: pluginPrettier.default || pluginPrettier
};

/**
 * Vue 相关插件配置
 */
export const vuePlugins = {
  import: pluginImport.default || pluginImport,
  prettier: pluginPrettier.default || pluginPrettier,
  vue: pluginVue.default || pluginVue
};

/**
 * 所有插件配置
 */
export const allPlugins = {
  import: pluginImport.default || pluginImport,
  prettier: pluginPrettier.default || pluginPrettier,
  vue: pluginVue.default || pluginVue
};
