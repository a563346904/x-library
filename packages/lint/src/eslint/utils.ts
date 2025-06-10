import type { Linter } from 'eslint';

import { deepMerge, mergeConfigArrays } from '../utils/config-merge';

/**
 * 合并ESLint配置
 */
export function mergeConfig(
  defaultConfig: Linter.Config,
  userConfig: Partial<Linter.Config>
): Linter.Config {
  return deepMerge(
    defaultConfig as Record<string, unknown>,
    userConfig as Record<string, unknown>
  ) as Linter.Config;
}

/**
 * 合并配置数组
 */
export function mergeConfigs(
  defaultConfigs: Linter.Config[],
  userConfigs: Partial<Linter.Config>[]
): Linter.Config[] {
  return mergeConfigArrays(defaultConfigs, userConfigs);
}

/**
 * 配置选项类型 - 基于标准 ESLint Config 扩展
 */
export interface EslintConfigOptions extends Partial<Linter.Config> {
  /**
   * 额外的配置项（会追加到默认配置后面）
   */
  additionalConfigs?: Partial<Linter.Config>[];

  /**
   * 是否禁用某些默认配置
   */
  disable?: {
    vue?: boolean;
    typescript?: boolean;
    prettier?: boolean;
  };
}
