/**
 * 重新导出 commitlint 官方类型
 */
export type { UserConfig as CommitlintConfig } from '@commitlint/types';
export { RuleConfigSeverity } from '@commitlint/types';

/**
 * 提交类型枚举
 */
export type CommitType =
  | 'feat' // 新功能
  | 'fix' // 修复 bug
  | 'docs' // 文档改动
  | 'style' // 代码格式（不影响功能）
  | 'refactor' // 代码重构
  | 'perf' // 性能优化
  | 'test' // 添加测试
  | 'build' // 构建相关
  | 'ci' // CI 配置
  | 'chore' // 杂项（依赖更新等）
  | 'revert'; // 回滚
