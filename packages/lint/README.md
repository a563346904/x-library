# @x-library/lint

一个统一的代码规范配置包，包含 ESLint、Prettier 和 Commitlint 配置。

## 功能特性

- 🚀 **模块化设计** - 按功能分类的规则模块
- 📦 **开箱即用** - 预配置的最佳实践规则
- 🎯 **Vue 3 支持** - 专门针对 Vue 3 Composition API 优化
- 🔧 **可定制** - 灵活的配置组合方式
- 📝 **TypeScript 友好** - 完整的类型支持
- 💬 **提交规范** - 基于 Conventional Commits 的提交信息规范

## 安装

### 完整安装（推荐）

安装 lint 包及其相关工具：

```bash
# 使用 npm
npm install -D @x-library/lint @commitlint/cli eslint prettier husky lint-staged

# 使用 pnpm
pnpm add -D @x-library/lint @commitlint/cli eslint prettier husky lint-staged

# 使用 yarn
yarn add -D @x-library/lint @commitlint/cli eslint prettier husky lint-staged
```

### 仅安装 lint 包

如果你只需要配置而不需要运行工具：

```bash
npm install @x-library/lint --save-dev
# 或
pnpm add @x-library/lint -D
# 或
yarn add @x-library/lint --dev
```

> **注意**: lint 包已经包含了所有必要的依赖，可以独立使用于任何项目。

## 使用方法

### ESLint 配置

```javascript
// eslint.config.mjs
import { eslintConfig } from '@x-library/lint';

export default eslintConfig;
```

### Prettier 配置

#### 方式一：直接使用配置对象

```javascript
// .prettierrc.mjs
import { prettierConfig } from '@x-library/lint/prettier';

export default prettierConfig;
```

#### 方式二：基于配置进行自定义

```javascript
// .prettierrc.mjs
import { prettierConfig } from '@x-library/lint/prettier';

export default {
  ...prettierConfig,
  // 覆盖特定配置
  printWidth: 120,
  trailingComma: 'es5'
};
```

### Commitlint 配置

#### 基础使用

```javascript
// commitlint.config.mjs
import { commitlintConfig } from '@x-library/lint/commitlint';

export default commitlintConfig();
```

#### 自定义配置

```javascript
// commitlint.config.mjs
import { commitlintConfig, RuleConfigSeverity } from '@x-library/lint/commitlint';

export default commitlintConfig({
  rules: {
    'subject-max-length': [RuleConfigSeverity.Error, 'always', 50], // 自定义主题长度
    'type-enum': [RuleConfigSeverity.Error, 'always', ['feat', 'fix', 'docs']] // 限制提交类型
  }
});
```

#### 使用 TypeScript 配置

```typescript
// commitlint.config.ts
import type { CommitlintConfig } from '@x-library/lint/commitlint';
import { commitlintConfig, RuleConfigSeverity } from '@x-library/lint/commitlint';

const config: CommitlintConfig = commitlintConfig({
  rules: {
    'subject-max-length': [RuleConfigSeverity.Warning, 'always', 100],
    'type-enum': [RuleConfigSeverity.Error, 'always', ['feat', 'fix', 'docs']]
  }
});

export default config;
```

#### 预设配置

```javascript
// commitlint.config.mjs
import { strictCommitlintConfig, relaxedCommitlintConfig } from '@x-library/lint/commitlint';

// 使用严格模式
export default strictCommitlintConfig();

// 或使用宽松模式
// export default relaxedCommitlintConfig();
```

### 生成 .prettierignore 文件

#### 方式一：使用默认忽略模式

```javascript
// Node.js 脚本
const { generatePrettierIgnore } = require('@x-library/lint/prettier');
const fs = require('fs');

const ignoreContent = generatePrettierIgnore();
fs.writeFileSync('.prettierignore', ignoreContent);
```

#### 方式二：添加项目特定的忽略模式

```javascript
const { generatePrettierIgnore } = require('@x-library/lint/prettier');
const fs = require('fs');

const ignoreContent = generatePrettierIgnore(['custom-dir/**/*', '*.custom-ext']);
fs.writeFileSync('.prettierignore', ignoreContent);
```

#### 方式三：直接使用忽略模式数组

```javascript
const { prettierIgnorePatterns } = require('@x-library/lint/prettier');

// 在你的工具中使用这些模式
console.log(prettierIgnorePatterns);
```

## 配置详情

### Prettier 配置说明

- **printWidth**: 100 - 每行最大字符数
- **tabWidth**: 2 - 缩进空格数
- **useTabs**: false - 使用空格缩进
- **semi**: true - 语句末尾添加分号
- **singleQuote**: true - 使用单引号
- **trailingComma**: 'none' - 不添加尾随逗号
- **arrowParens**: 'always' - 箭头函数参数始终使用括号

### Commitlint 配置说明

#### 默认规则

- **extends**: `@commitlint/config-conventional` - 继承 Conventional Commits 规范
- **subject-max-length**: 72 - 提交主题最大长度
- **type-enum**: 支持的提交类型（feat、fix、docs、style、refactor、perf、test、build、ci、chore、revert）
- **subject-case**: 提交主题必须以小写字母开头

#### 官方类型支持

本包使用 `@commitlint/types` 中的官方类型定义：

- **CommitlintConfig**: 等同于 `UserConfig` 类型
- **RuleConfigSeverity**: 规则严重性枚举
  - `RuleConfigSeverity.Disabled` (0) - 禁用规则
  - `RuleConfigSeverity.Warning` (1) - 警告级别
  - `RuleConfigSeverity.Error` (2) - 错误级别

#### 支持的提交类型

| 类型       | 说明         | 示例                        |
| ---------- | ------------ | --------------------------- |
| `feat`     | 新功能       | `feat: 添加用户登录功能`    |
| `fix`      | 修复 bug     | `fix: 修复用户头像显示问题` |
| `docs`     | 文档更新     | `docs: 更新 API 文档`       |
| `style`    | 代码格式调整 | `style: 格式化代码`         |
| `refactor` | 代码重构     | `refactor: 重构用户模块`    |
| `perf`     | 性能优化     | `perf: 优化查询性能`        |
| `test`     | 添加测试     | `test: 添加登录功能测试`    |
| `build`    | 构建相关     | `build: 更新构建配置`       |
| `ci`       | CI 配置      | `ci: 添加 GitHub Actions`   |
| `chore`    | 杂项         | `chore: 更新依赖版本`       |
| `revert`   | 回滚         | `revert: 回滚登录功能`      |

#### 预设配置对比

| 模式 | 主题长度 | 提交类型限制  | 大小写检查   |
| ---- | -------- | ------------- | ------------ |
| 默认 | 72字符   | 所有11种类型  | 必须小写开头 |
| 严格 | 50字符   | 仅5种核心类型 | 强制全小写   |
| 宽松 | 100字符  | 所有11种类型  | 不检查大小写 |

### Prettier 默认忽略模式

- Lock files: `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`
- Build outputs: `dist/`, `build/`, `.turbo/`
- Dependencies: `node_modules/`
- Generated files: `*.d.ts`, `coverage/`
- IDE/OS files: `.DS_Store`, `.vscode/settings.json`
- 临时文件和日志文件

## 第三方项目完整配置示例

### 1. 创建配置文件

```javascript
// eslint.config.mjs
import { eslintConfig } from '@x-library/lint';
export default eslintConfig;

// .prettierrc.mjs
import { prettierConfig } from '@x-library/lint/prettier';
export default prettierConfig();

// commitlint.config.mjs
import { commitlintConfig } from '@x-library/lint/commitlint';
export default commitlintConfig();
```

### 2. 配置 package.json

```json
{
  "scripts": {
    "prepare": "husky",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx,vue}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yml,yaml}": ["prettier --write"]
  }
}
```

### 3. 初始化 Git 钩子

```bash
# 初始化 husky
npx husky init

# 创建 pre-commit 钩子
echo "npx lint-staged" > .husky/pre-commit

# 创建 commit-msg 钩子
echo "npx --no -- commitlint --edit \${1}" > .husky/commit-msg
```

### 4. 创建忽略文件

```bash
# .eslintignore
node_modules/
dist/
build/

# .prettierignore (可选，使用内置忽略规则)
```

完整示例请参考 `examples/` 目录。

## 模块化结构

### 忽略配置

```js
import { baseIgnores, projectSpecificIgnores } from '@x-library/lint/eslint';
```

### 规则模块

```js
import {
  importRules, // Import 管理规则
  qualityRules, // 代码质量规则
  securityRules, // 安全性规则
  errorHandlingRules, // 错误处理规则
  namingRules, // 命名约定规则
  performanceRules, // 性能优化规则
  maintainabilityRules, // 维护性规则
  typescriptRules, // TypeScript 规则
  allJavaScriptRules, // 所有 JS/TS 规则组合

  // Vue 规则
  vueBaseRules,
  vueNamingRules,
  vueCompositionRules,
  vueBestPracticeRules,
  allVueRules
} from '@x-library/lint/eslint';
```

### 插件配置

```js
import {
  basePlugins, // 基础插件
  vuePlugins, // Vue 相关插件
  allPlugins // 所有插件
} from '@x-library/lint/eslint';
```

### 配置组合

```js
import {
  javascriptConfig, // JavaScript/TypeScript 配置
  vueConfig, // Vue 文件配置
  vueJavaScriptConfig, // Vue 中的 JS/TS 配置
  vueBaseConfig, // Vue 基础配置
  prettierConfig // Prettier 配置
} from '@x-library/lint/eslint';
```

## 规则说明与示例

### Import 管理规则

规则示例：

```js
// ❌ 错误示例
import { b } from 'module-b';
import { a } from 'module-a';
import { c } from './local-module';
import fs from 'fs';
import { d } from 'module-a';

// ✅ 正确示例
import fs from 'fs';

import { a, d } from 'module-a';
import { b } from 'module-b';

import { c } from './local-module';
```

| 规则名称                      | 说明               | 错误示例                                         | 正确示例                                 |
| ----------------------------- | ------------------ | ------------------------------------------------ | ---------------------------------------- |
| `import/newline-after-import` | 导入语句后需要空行 | `import { a } from 'a';\nconst b = 1;`           | `import { a } from 'a';\n\nconst b = 1;` |
| `import/no-duplicates`        | 禁止重复导入       | `import { a } from 'a';\nimport { b } from 'a';` | `import { a, b } from 'a';`              |
| `import/order`                | 导入顺序规范       | 见上方错误示例                                   | 见上方正确示例                           |
| `sort-imports`                | 导入内部成员排序   | `import { b, a } from 'module';`                 | `import { a, b } from 'module';`         |

### 代码质量规则

```js
// ❌ 错误示例
var count = 1;
var name = 'user';
var obj = {
  name: name,
  getCount: function () {
    return count;
  }
};
var message = 'Hello ' + name + '!';

// ✅ 正确示例
const count = 1;
const name = 'user';
const obj = {
  name,
  getCount() {
    return count;
  }
};
const message = `Hello ${name}!`;
```

| 规则名称           | 说明                   | 错误示例                        | 正确示例                       |
| ------------------ | ---------------------- | ------------------------------- | ------------------------------ |
| `no-var`           | 禁用 var 声明          | `var x = 1;`                    | `const x = 1;` 或 `let x = 1;` |
| `object-shorthand` | 使用对象字面量简写语法 | `const obj = { name: name };`   | `const obj = { name };`        |
| `prefer-const`     | 优先使用 const 声明    | `let x = 1;` (x 不会被重新赋值) | `const x = 1;`                 |
| `prefer-template`  | 优先使用模板字符串     | `'Hello ' + name + '!'`         | `Hello ${name}!`               |

### Vue 规则

#### Vue 基础规则

```vue
<!-- ❌ 错误示例 -->
<template>
  <div>
    <my-component></my-component>
    <span v-html="userContent"></span>
  </div>
</template>

<script>
export default {
  name: 'component'
};
</script>

<!-- ✅ 正确示例 -->
<template>
  <div>
    <MyComponent></MyComponent>
    <!-- v-html 使用谨慎，有 XSS 风险 -->
    <span>{{ safeContent }}</span>
  </div>
</template>

<script>
export default {
  name: 'Component',
  emits: ['update', 'delete']
};
</script>
```

#### Vue Composition API 规则

```vue
<!-- ❌ 错误示例 -->
<script setup>
const props = defineProps({
  enabled: Boolean
});

// 直接解构 props (在 setup 中会丢失响应性)
const { enabled } = props;

// 使用 ref 作为操作数
const count = ref(0);
if (count > 0) {
  /* ... */
}

// 在 await 后使用 watch
async function fetchData() {
  await api.getData();
  watch(source, callback);
}
</script>

<!-- ✅ 正确示例 -->
<script setup lang="ts">
// 使用类型定义 props
interface Props {
  enabled: boolean;
}

const props = defineProps<Props>();

// 使用 computed 保持响应性
const enabled = computed(() => props.enabled);

// 正确使用 ref
const count = ref(0);
if (count.value > 0) {
  /* ... */
}

// 在 await 前使用 watch
async function fetchData() {
  watch(source, callback);
  await api.getData();
}

// 使用类型声明 emits
const emit = defineEmits<{
  (e: 'update', value: string): void;
  (e: 'delete', id: number): void;
}>();
</script>
```

#### Vue 命名规则

```vue
<!-- ❌ 错误示例 -->
<template>
  <div>
    <MyComponent myProp="value" @myEvent="handler"></MyComponent>
  </div>
</template>

<script setup>
const props = defineProps({
  UserName: String // 不符合驼峰命名
});

// 事件名不是 kebab-case
const emit = defineEmits(['updateValue']);
</script>

<!-- ✅ 正确示例 -->
<template>
  <div>
    <MyComponent my-prop="value" @update-value="handler"></MyComponent>
  </div>
</template>

<script setup>
const props = defineProps({
  userName: String // 符合驼峰命名
});

// 事件名使用 kebab-case
const emit = defineEmits(['update-value']);
</script>
```

### TypeScript 规则

```ts
// ❌ 错误示例
function process(data: any) {
  // any 类型使用
  return data.value;
}

// 未使用的变量
function calculate(x: number, y: number) {
  const sum = x + y;
  const product = x * y;
  return sum;
}

// ✅ 正确示例
function process(data: { value: string }) {
  return data.value;
}

// 使用下划线前缀标记未使用的变量
function calculate(x: number, y: number) {
  const sum = x + y;
  // 未使用但需要计算的变量使用 _ 前缀
  const _product = x * y;
  return sum;
}
```

### 命名规则

```js
// ❌ 错误示例
const user_name = 'John';

// 构造函数使用小写
function user(name) {
  this.name = name;
}
const john = new user('John');

// 不必要的下划线
const _age = 30;

// ✅ 正确示例
const userName = 'John';

// 构造函数使用大写开头
function User(name) {
  this.name = name;
}
const john = new User('John');

// 允许的特殊下划线用法
class Person {
  constructor() {
    this._id = '12345'; // 允许在 this 后使用
  }
}
```

### 安全规则、错误处理、性能优化和维护性规则

类似地，其他规则集也提供了最佳实践：

- **安全规则**：防止 `eval()`、潜在不安全的正则表达式和其他安全风险。
- **错误处理规则**：确保适当的错误捕获和处理。
- **性能规则**：避免不必要的计算和内存使用。
- **维护性规则**：促进可读性和一致性的代码结构。

请参考相应的规则文件获取更多详细信息。

## 自定义使用

### 只使用特定规则

```js
// eslint.config.mjs
import { importRules, securityRules } from '@x-library/lint/eslint';

export default [
  {
    files: ['**/*.{js,ts}'],
    rules: {
      ...importRules,
      ...securityRules,
      // 添加自定义规则
      'no-console': 'warn'
    }
  }
];
```

### 覆盖特定规则

```js
// eslint.config.mjs
import { config } from '@x-library/lint/eslint';

export default [
  ...config,
  {
    // 覆盖特定规则
    rules: {
      'vue/multi-word-component-names': 'error'
    }
  }
];
```

## 开发说明

### 构建

```bash
pnpm build
```

### 文件结构

```
src/eslint/
├── index.ts              # 主配置文件
├── ignores.ts            # 忽略配置
├── plugins.ts            # 插件配置
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
