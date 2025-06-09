# X Library Monorepo

这是一个使用现代工具链构建的 monorepo 项目，包含 X Library 的核心包和示例应用。

## 🏗️ 项目结构

```
x-library/
├── packages/           # 可复用的包
│   └── core/          # 核心库包
│       ├── src/       # 源代码
│       ├── dist/      # 构建输出 (自动生成)
│       └── package.json
├── apps/              # 应用程序
│   └── example/       # 示例应用
│       ├── src/       # 源代码
│       ├── dist/      # 构建输出 (自动生成)
│       └── package.json
├── package.json       # 根包配置
├── pnpm-workspace.yaml # pnpm workspace 配置
├── turbo.json         # Turbo 构建配置
├── tsconfig.json      # TypeScript 配置
└── README.md
```

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
# 启动所有包的开发模式
pnpm dev

# 或者单独启动示例应用
cd apps/example
pnpm dev
```

### 构建项目

```bash
# 构建所有包
pnpm build

# 构建特定包
pnpm turbo build --filter=@x-library/core
```

### 运行测试

```bash
# 运行所有测试
pnpm test

# 运行特定包的测试
cd packages/core
pnpm test
```

## 📦 包说明

### @x-library/core

核心库包，提供基础功能：

- `XLibrary` 类：主要的库类
- `createXLibrary` 工厂函数：创建库实例
- TypeScript 支持和类型定义

### @x-library/example

示例应用，展示如何使用核心库：

- 导入和使用 `@x-library/core`
- 基本的使用示例

## 🛠️ 技术栈

- **构建工具**: Turbo (monorepo 管理)
- **包管理**: pnpm workspaces
- **语言**: TypeScript
- **测试**: Jest
- **打包**: tsup (用于库包)
- **版本管理**: Changesets

## 📝 开发指南

### 添加新包

1. 在 `packages/` 或 `apps/` 目录下创建新文件夹
2. 添加 `package.json` 文件
3. 按照现有包的结构创建源代码
4. 更新 `pnpm-workspace.yaml` 配置 (如果需要)

### 发布包

```bash
# 创建变更集
pnpm changeset

# 更新版本号
pnpm version-packages

# 发布到 npm
pnpm release
```

### 添加依赖

```bash
# 添加到工作区根目录
pnpm add -w <package-name>

# 添加到特定包
pnpm add --filter @x-library/core <package-name>

# 添加内部包依赖
pnpm add --filter @x-library/example @x-library/core@workspace:*
```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

# @x-library/lint

一个模块化的 ESLint 配置库，支持 JavaScript、TypeScript 和 Vue 3 项目。

## 功能特性

- 🚀 **模块化设计** - 按功能分类的规则模块
- 📦 **开箱即用** - 预配置的最佳实践规则
- 🎯 **Vue 3 支持** - 专门针对 Vue 3 Composition API 优化
- 🔧 **可定制** - 灵活的配置组合方式
- 📝 **TypeScript 友好** - 完整的类型支持
- ⚙️ **函数式配置** - 支持智能合并的配置函数

## 安装

```bash
pnpm add -D @x-library/lint
```

## 快速开始

### 基础使用（推荐）

```js
// eslint.config.mjs
import eslintConfig from '@x-library/lint/eslint';

export default eslintConfig();
```

### 自定义配置

```js
// eslint.config.mjs
import eslintConfig from '@x-library/lint/eslint';

export default eslintConfig({
  // 项目特定的忽略项
  projectSpecificIgnores: [
    '.turbo/**',
    'pnpm-lock.yaml',
    'custom-build/**'
  ],

  // 额外的忽略项
  ignores: [
    '*.config.js',
    'temp/**'
  ],

  // 自定义规则
  rules: {
    'no-console': 'warn',
    'prefer-const': 'error'
  },

  // 禁用某些默认功能
  disable: {
    vue: false,
    typescript: false,
    prettier: false
  },

  // 额外的配置
  additionalConfigs: [
    {
      files: ['**/*.test.{js,ts,vue}'],
      rules: {
        'max-lines-per-function': 'off'
      }
    }
  ]
});
```

### 传统方式（向后兼容）

```js
// eslint.config.mjs
import { config } from '@x-library/lint/eslint';

export default config;
```

## 配置选项

### `EslintConfigOptions`

```typescript
interface EslintConfigOptions {
  /**
   * 项目特定的忽略项
   * @default ['.turbo/**', 'pnpm-lock.yaml']
   */
  projectSpecificIgnores?: string[];

  /**
   * 额外的忽略项
   * @default []
   */
  ignores?: string[];

  /**
   * 自定义规则（会与默认规则智能合并）
   * @default {}
   */
  rules?: Linter.RulesRecord;

  /**
   * 禁用某些默认配置
   */
  disable?: {
    vue?: boolean;
    typescript?: boolean;
    prettier?: boolean;
  };

  /**
   * 额外的配置项（会追加到默认配置后面）
   * @default []
   */
  additionalConfigs?: Partial<Linter.FlatConfig>[];
}
```

## 智能合并机制

配置函数支持智能合并：

### 基础类型覆盖
```js
eslintConfig({
  rules: {
    'no-console': 'warn' // 覆盖默认的 'error'
  }
});
```

### 数组合并
```js
eslintConfig({
  ignores: ['custom/**'], // 会添加到默认忽略项后面
  projectSpecificIgnores: ['temp/**'] // 会替换默认的项目特定忽略项
});
```

### 对象深度合并
```js
eslintConfig({
  additionalConfigs: [
    {
      files: ['**/*.spec.js'],
      rules: {
        'max-lines': 'off'
      }
    }
  ]
});
```

## 高级用法

### 条件配置

```js
// eslint.config.mjs
import eslintConfig from '@x-library/lint/eslint';

const isDev = process.env.NODE_ENV === 'development';

export default eslintConfig({
  rules: {
    'no-console': isDev ? 'warn' : 'error',
    'no-debugger': isDev ? 'warn' : 'error'
  }
});
```

### 多环境配置

```js
// eslint.config.mjs
import eslintConfig from '@x-library/lint/eslint';

export default eslintConfig({
  additionalConfigs: [
    // 测试文件配置
    {
      files: ['**/*.test.{js,ts,vue}', '**/*.spec.{js,ts,vue}'],
      rules: {
        'max-lines-per-function': 'off',
        'no-magic-numbers': 'off'
      }
    },
    // 配置文件配置
    {
      files: ['*.config.{js,ts,mjs}', 'config/**/*.{js,ts}'],
      rules: {
        'no-console': 'off'
      }
    }
  ]
});
```

### 禁用特定功能

```js
// 只使用 JavaScript/TypeScript 规则，不使用 Vue
export default eslintConfig({
  disable: {
    vue: true
  }
});

// 不使用 Prettier 集成
export default eslintConfig({
  disable: {
    prettier: true
  }
});
```

## 模块化使用

如果你需要更细粒度的控制，可以直接使用模块：

```js
// eslint.config.mjs
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import {
  createIgnoresConfig,
  javascriptConfig,
  vueConfig,
  importRules,
  securityRules
} from '@x-library/lint/eslint';

export default [
  createIgnoresConfig(['custom/**']),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  javascriptConfig,
  vueConfig,
  {
    rules: {
      ...importRules,
      ...securityRules,
      'no-console': 'warn'
    }
  }
];
```

## 规则说明

### Import 管理规则
- 自动排序和分组导入语句
- 禁止重复导入
- 强制导入后换行

### 代码质量规则
- 禁用 `var`，推荐 `const` 和 `let`
- 强制使用对象简写语法
- 优先使用模板字符串

### Vue 3 专属规则
- Composition API 最佳实践
- 组件命名规范（PascalCase）
- Props 和 Emits 类型声明
- 性能优化建议

### TypeScript 规则
- 合理的类型检查
- 未使用变量检测
- 类型安全最佳实践

## 开发说明

### 构建

```bash
pnpm build
```

### 文件结构

```
src/eslint/
├── index.ts              # 主配置文件（函数式）
├── ignores.ts            # 忽略配置
├── plugins.ts            # 插件配置
├── utils.ts              # 配置合并工具
├── rules/                # 规则模块
│   ├── index.ts          # 规则统一导出
│   ├── import.ts         # Import 规则
│   ├── quality.ts        # 代码质量规则
│   ├── security.ts       # 安全规则
│   ├── error-handling.ts # 错误处理规则
│   ├── naming.ts         # 命名规则
│   ├── performance.ts    # 性能规则
│   ├── maintainability.ts # 维护性规则
│   ├── typescript.ts     # TypeScript 规则
│   └── vue.ts           # Vue 规则
└── configs/             # 配置组合
    ├── index.ts         # 配置统一导出
    ├── javascript.ts    # JS/TS 配置
    ├── vue.ts          # Vue 配置
    └── prettier.ts     # Prettier 配置
```

## 许可证

MIT
