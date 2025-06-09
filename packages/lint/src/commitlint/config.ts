import { RuleConfigSeverity } from '@commitlint/types';

import type { CommitlintConfig, CommitType } from './types';

/**
 * 标准 Commit 提交示例
 *
 * ✅ 正确示例：
 * ```
 * feat: 添加用户登录功能
 *
 * 实现了完整的用户认证流程，包括以下功能：
 * - 用户名和密码验证
 * - JWT token 生成和验证
 * - 登录状态持久化
 * - 自动登出机制
 *
 * 这个功能支持多种登录方式，提高了用户体验。
 * 同时加强了安全性，防止了常见的认证攻击。
 *
 * Closes #123
 * Co-authored-by: Developer <dev@example.com>
 * ```
 *
 * ❌ 错误示例：
 * ```
 * FEAT: 添加用户登录功能。        # 类型大写 + 主题有句号
 * 实现登录功能                   # 正文前缺少空行
 * 这行文字超过了100个字符的限制，会导致 commitlint 检查失败，因为我们设置了每行最大长度限制 # 超长行
 * Closes #123                    # 页脚前缺少空行
 * ```
 */

/**
 * 默认支持的提交类型
 */
export const defaultCommitTypes: CommitType[] = [
  'feat', // 新功能
  'fix', // 修复 bug
  'docs', // 文档改动
  'style', // 代码格式（不影响功能）
  'refactor', // 代码重构
  'perf', // 性能优化
  'test', // 添加测试
  'build', // 构建相关
  'ci', // CI 配置
  'chore', // 杂项（依赖更新等）
  'revert' // 回滚
];

/**
 * 默认 Commitlint 配置
 * 基于 Conventional Commits 规范，但不依赖外部扩展包
 */
const defaultCommitlintConfig: CommitlintConfig = {
  rules: {
    // === 正文(body)相关规则 ===
    'body-leading-blank': [RuleConfigSeverity.Warning, 'always'], // 正文前必须有空行
    'body-max-line-length': [RuleConfigSeverity.Error, 'always', 100], // 正文每行最大长度100字符

    // === 页脚(footer)相关规则 ===
    'footer-leading-blank': [RuleConfigSeverity.Warning, 'always'], // 页脚前必须有空行
    'footer-max-line-length': [RuleConfigSeverity.Error, 'always', 100], // 页脚每行最大长度100字符

    // === 标题(header)相关规则 ===
    'header-max-length': [RuleConfigSeverity.Error, 'always', 100], // 整个标题行最大长度100字符

    // === 主题(subject)相关规则 ===
    'subject-case': [
      RuleConfigSeverity.Error,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case']
    ], // 主题不能使用句子格式、每词首字母大写、帕斯卡命名、全大写
    'subject-empty': [RuleConfigSeverity.Error, 'never'], // 主题不能为空
    'subject-full-stop': [RuleConfigSeverity.Error, 'never', '.'], // 主题结尾不能有句号
    'subject-max-length': [RuleConfigSeverity.Error, 'always', 72], // 主题最大长度72字符

    // === 类型(type)相关规则 ===
    'type-case': [RuleConfigSeverity.Error, 'always', 'lower-case'], // 提交类型必须小写
    'type-empty': [RuleConfigSeverity.Error, 'never'], // 提交类型不能为空
    'type-enum': [RuleConfigSeverity.Error, 'always', defaultCommitTypes] // 提交类型必须在允许列表中
  }
};

export default defaultCommitlintConfig;
