import type { Linter } from 'eslint';
import globals from 'globals';

import { basePlugins } from '../plugins';
import { allJavaScriptRules } from '../rules';

/**
 * JavaScript/TypeScript 文件配置
 */
export const javascriptConfig: Linter.FlatConfig = {
  files: ['**/*.{js,mjs,cjs,ts,tsx}'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: {
      ...globals.browser,
      ...globals.node,
      ...globals.es2020
    }
  },
  plugins: basePlugins,
  rules: allJavaScriptRules
};
