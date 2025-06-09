import { default as defaultCommitlintConfig } from './config';
import type { CommitlintConfig } from './types';

export type { CommitlintConfig, CommitType } from './types';
export { defaultCommitTypes } from './config';
export { RuleConfigSeverity } from './types';

/**
 * 创建 Commitlint 配置
 * @param options 自定义配置选项
 * @returns 完整的 Commitlint 配置
 */
export const commitlintConfig = (options: Partial<CommitlintConfig> = {}): CommitlintConfig => {
  // 合并自定义规则
  const mergedRules = {
    ...defaultCommitlintConfig.rules,
    ...options.rules
  };

  // 合并扩展配置
  const mergedExtends = options.extends
    ? [...(defaultCommitlintConfig.extends || []), ...options.extends]
    : defaultCommitlintConfig.extends;

  return {
    ...defaultCommitlintConfig,
    ...options,
    extends: mergedExtends,
    rules: mergedRules
  };
};
