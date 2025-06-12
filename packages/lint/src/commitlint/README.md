# Commitlint 配置模块

Commitlint 配置模块提供了一套完整的、可扩展的 Git 提交信息规范配置解决方案，确保团队提交信息的一致性和可读性。

## 主要功能

- ✅ **开箱即用** - 预配置的 Conventional Commits 规范
- 🔧 **易于扩展** - 支持自定义和覆盖默认配置
- 📝 **标准化提交** - 强制使用结构化的提交信息格式
- 📊 **便于生成变更日志** - 标准化提交便于自动生成 CHANGELOG
- 🚀 **提高协作效率** - 使提交历史更加清晰易读

## 使用方法

### 基本用法

在项目根目录创建 `commitlint.config.js` 文件：

```javascript
import { commitlintConfig } from '@x-library/lint/commitlint';

export default commitlintConfig();
```

### 自定义配置

你可以通过传入配置对象来自定义 Commitlint 配置：

```javascript
import { commitlintConfig, RuleConfigSeverity } from '@x-library/lint/commitlint';

export default commitlintConfig({
  // 添加自定义规则
  rules: {
    'header-max-length': [RuleConfigSeverity.Error, 'always', 120] // 修改标题最大长度为120字符
    // 其他自定义规则...
  }
});
```

## 配置详解

本模块提供的默认 Commitlint 配置基于 Conventional Commits 规范，包含以下核心组件：

### 提交类型

支持的提交类型包括：

| 类型       | 说明                   | 示例                           |
| ---------- | ---------------------- | ------------------------------ |
| `feat`     | 新功能                 | `feat: 添加用户登录功能`       |
| `fix`      | 修复 bug               | `fix: 修复登录验证失败的问题`  |
| `docs`     | 文档改动               | `docs: 更新 API 文档`          |
| `style`    | 代码格式（不影响功能） | `style: 格式化代码风格`        |
| `refactor` | 代码重构               | `refactor: 重构用户认证模块`   |
| `perf`     | 性能优化               | `perf: 优化列表渲染性能`       |
| `test`     | 添加测试               | `test: 为登录功能添加单元测试` |
| `build`    | 构建相关               | `build: 更新打包配置`          |
| `ci`       | CI 配置                | `ci: 配置 GitHub Actions`      |
| `chore`    | 杂项（依赖更新等）     | `chore: 更新依赖版本`          |
| `revert`   | 回滚                   | `revert: 撤销上一次的提交`     |

## 规则详解

本节列举了 `@x-library/lint` 包中的所有 Commitlint 规则。

### 提交格式规范

标准的提交信息格式如下：

```
<类型>[可选的作用域]: <描述>

[可选的正文]

[可选的页脚]
```

示例：

```
feat(auth): 添加用户登录功能

实现了完整的用户认证流程，包括以下功能：
- 用户名和密码验证
- JWT token 生成和验证
- 登录状态持久化
- 自动登出机制

这个功能支持多种登录方式，提高了用户体验。
同时加强了安全性，防止了常见的认证攻击。

Closes #123
Co-authored-by: Developer <dev@example.com>
```

### 标题相关规则

#### `header-max-length`

- **值**: `[RuleConfigSeverity.Error, 'always', 100]`
- **说明**: 标题行（包含类型、作用域和描述）的最大长度不能超过100个字符
- **正例**: `feat: 添加用户登录功能`
- **反例**: `feat: 添加一个非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常长的用户登录功能描述`

### 类型相关规则

#### `type-case`

- **值**: `[RuleConfigSeverity.Error, 'always', 'lower-case']`
- **说明**: 提交类型必须使用小写
- **正例**: `feat: 添加功能`
- **反例**: `FEAT: 添加功能`

#### `type-empty`

- **值**: `[RuleConfigSeverity.Error, 'never']`
- **说明**: 提交类型不能为空
- **正例**: `feat: 添加功能`
- **反例**: `: 添加功能`

#### `type-enum`

- **值**: `[RuleConfigSeverity.Error, 'always', [...]]`
- **说明**: 提交类型必须是预定义的类型之一
- **正例**: `feat: 添加功能`、`fix: 修复问题`
- **反例**: `feature: 添加功能`、`update: 更新代码`

### 主题相关规则

#### `subject-case`

- **值**: `[RuleConfigSeverity.Error, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']]`
- **说明**: 主题不能使用句子格式、每词首字母大写、帕斯卡命名、全大写
- **正例**: `feat: 添加用户登录功能`
- **反例**: `feat: 添加用户登录功能。`、`feat: 添加 User Login 功能`

#### `subject-empty`

- **值**: `[RuleConfigSeverity.Error, 'never']`
- **说明**: 主题不能为空
- **正例**: `feat: 添加用户登录功能`
- **反例**: `feat: `

#### `subject-full-stop`

- **值**: `[RuleConfigSeverity.Error, 'never', '.']`
- **说明**: 主题结尾不能有句号
- **正例**: `feat: 添加用户登录功能`
- **反例**: `feat: 添加用户登录功能。`

#### `subject-max-length`

- **值**: `[RuleConfigSeverity.Error, 'always', 72]`
- **说明**: 主题最大长度不能超过72个字符
- **正例**: 简短明了的主题
- **反例**: 超过72个字符的主题

### 正文相关规则

#### `body-leading-blank`

- **值**: `[RuleConfigSeverity.Warning, 'always']`
- **说明**: 正文前必须有空行
- **正例**:

  ```
  feat: 添加用户登录功能

  实现了完整的用户认证流程
  ```

- **反例**:
  ```
  feat: 添加用户登录功能
  实现了完整的用户认证流程
  ```

#### `body-max-line-length`

- **值**: `[RuleConfigSeverity.Error, 'always', 100]`
- **说明**: 正文每行最大长度不能超过100个字符
- **正例**: 每行不超过100个字符的正文
- **反例**: 包含超过100个字符的行

### 页脚相关规则

#### `footer-leading-blank`

- **值**: `[RuleConfigSeverity.Warning, 'always']`
- **说明**: 页脚前必须有空行
- **正例**:

  ```
  feat: 添加用户登录功能

  实现了完整的用户认证流程

  Closes #123
  ```

- **反例**:

  ```
  feat: 添加用户登录功能

  实现了完整的用户认证流程
  Closes #123
  ```

#### `footer-max-line-length`

- **值**: `[RuleConfigSeverity.Error, 'always', 100]`
- **说明**: 页脚每行最大长度不能超过100个字符
- **正例**: 每行不超过100个字符的页脚
- **反例**: 包含超过100个字符的行

## 结合工具使用

为了获得最佳效果，建议将 Commitlint 与以下工具结合使用：

1. **Husky**: 设置 Git hooks，在提交前自动验证提交信息
2. **Commitizen**: 提供交互式命令行界面，引导开发者创建符合规范的提交信息

## 完整示例

下面是一个符合规范的完整提交信息示例：

```
feat(user): 实现用户认证功能

开发了一套完整的用户认证系统，包括以下功能：
- 用户注册与邮箱验证
- 登录与密码重置
- OAuth2.0 第三方登录（微信、GitHub）
- 双因素认证（2FA）支持
- 会话管理与自动登出

该功能极大提升了系统安全性，同时通过优化登录流程
改善了用户体验。登录速度提升约 30%。

BREAKING CHANGE: 用户认证接口已完全重构，
旧版本客户端需要更新适配新的认证流程。

Closes #142, #157, #218
Related to #95
Co-authored-by: 张三 <zhangsan@example.com>
Reviewed-by: 李四 <lisi@example.com>
```

### 提交信息结构解析

1. **标题行**：

   - 类型: `feat` - 表示这是一个新功能
   - 作用域: `user` - 表示这个变更影响用户模块
   - 描述: 简洁明了地说明了做了什么

2. **正文**：

   - 空一行后开始
   - 详细描述了实现的具体功能点
   - 解释了这个变更的价值和影响

3. **破坏性变更说明**：

   - 使用 `BREAKING CHANGE:` 前缀标记
   - 清晰说明了不兼容变更的详情和迁移建议

4. **页脚**：
   - 引用相关的 Issue: `Closes #142, #157, #218`
   - 关联的 Issue: `Related to #95`
   - 协作者信息: `Co-authored-by: 张三 <zhangsan@example.com>`
   - 审阅者信息: `Reviewed-by: 李四 <lisi@example.com>`

这个示例展示了一个功能完善、信息丰富的提交信息，遵循了所有 Commitlint 规则，同时提供了足够的上下文让其他开发者理解这次变更的目的、影响和价值。

## 注意事项

使用本配置时，请确保项目中已安装 Commitlint 相关依赖。对于新接触 Conventional Commits 规范的团队成员，建议先熟悉规范内容，并使用 Commitizen 等工具辅助创建提交信息。
