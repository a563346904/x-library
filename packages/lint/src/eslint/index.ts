import js from '@eslint/js';
import type { Linter } from 'eslint';
import tseslint from 'typescript-eslint';

// 导入模块化配置
import { javascriptConfig } from './configs/javascript';
import { prettierConfig } from './configs/prettier';
import { vueBaseConfig, vueConfig, vueJavaScriptConfig } from './configs/vue';
import { baseIgnores } from './ignores';
import type { EslintConfigOptions } from './utils';
import { mergeConfig, mergeConfigs } from './utils';

/**
 * 合并用户配置的辅助函数
 */
function mergeUserConfig(baseConfig: Linter.Config, options: EslintConfigOptions): Linter.Config {
  const { rules, ...restOptions } = options;

  if (!rules && Object.keys(restOptions).length === 0) {
    return baseConfig;
  }

  const userConfig: Partial<Linter.Config> = { ...restOptions };
  if (rules) {
    userConfig.rules = rules;
  }
  return mergeConfig(baseConfig, userConfig);
}

/**
 * 创建 ESLint 配置
 * @param options 配置选项 - 支持标准 ESLint Config 格式
 * @returns ESLint 配置数组
 */
export function eslintConfig(options: EslintConfigOptions = {}): Linter.Config[] {
  const { additionalConfigs = [], disable = {}, ignores, ...userOptions } = options;

  // 基础配置
  const baseConfigs: Linter.Config[] = [
    js.configs.recommended as Linter.Config,
    ...(tseslint.configs.recommended as Linter.Config[])
  ];

  // 处理忽略配置
  const ignoresConfig = ignores
    ? { ignores: [...(baseIgnores.ignores || []), ...ignores] }
    : baseIgnores;

  // JavaScript/TypeScript 配置
  const jsConfig = mergeUserConfig(javascriptConfig, userOptions);

  // 构建配置数组
  const configs: Linter.Config[] = [ignoresConfig, ...baseConfigs, jsConfig];

  // 添加 Vue 配置（如果未禁用）
  if (!disable.vue) {
    configs.push(...(vueBaseConfig as Linter.Config[]));
    const vueConfigMerged = mergeUserConfig(vueConfig, userOptions);
    configs.push(vueConfigMerged, vueJavaScriptConfig);
  }

  // 添加 Prettier 配置（如果未禁用）
  if (!disable.prettier) {
    configs.push(prettierConfig);
  }

  // 合并额外的配置
  return mergeConfigs(configs, additionalConfigs);
}

/**
 * 默认配置（保持向后兼容）
 */
export const config = eslintConfig();

// 默认导出函数
export default eslintConfig;

// 导出所有模块供单独使用
export * from './configs';
export * from './rules';
export * from './plugins';
export * from './ignores';
export * from './utils';
