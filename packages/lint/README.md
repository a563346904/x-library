# @x-library/lint

一个统一的前端代码规范配置包，集成 ESLint、Prettier、Commitlint 和 Stylelint 配置，为 JavaScript、TypeScript 和 Vue.js 项目提供开箱即用的代码规范解决方案。

## ✨ 特性

- 🔧 **统一配置** - 一个包解决所有代码规范需求
- 📦 **模块化设计** - 支持按需引入各个配置模块
- 🎯 **TypeScript 友好** - 完整的类型定义支持
- 🚀 **开箱即用** - 基于最佳实践的默认配置
- ⚙️ **灵活扩展** - 支持自定义规则覆盖和配置合并
- 🎨 **Vue.js 支持** - 内置 Vue 项目的完整支持

## 🛠 支持的工具

| 工具       | 版本 | 说明                                        |
| ---------- | ---- | ------------------------------------------- |
| ESLint     | 9.x  | JavaScript/TypeScript 代码检查，支持 Vue    |
| Prettier   | 3.x  | 代码格式化，100 字符行宽，单引号风格        |
| Commitlint | -    | Git 提交信息规范，基于 Conventional Commits |
| Stylelint  | 16.x | CSS/SCSS 样式检查，支持 BEM 命名规范        |

## 📦 安装

```bash
# npm
npm install --save-dev @x-library/lint

# yarn
yarn add --dev @x-library/lint

# pnpm
pnpm add -D @x-library/lint
```

## 🚀 快速开始

### 完整配置（推荐）

在项目根目录创建配置文件：

```javascript
// eslint.config.mjs
import { eslintConfig } from '@x-library/lint/eslint';

export default eslintConfig();
```

```javascript
// prettier.config.mjs
import { prettierConfig } from '@x-library/lint/prettier';

export default prettierConfig();
```

```
// .prettierignore
# 构建产物
dist/
build/
coverage/

# 依赖目录
node_modules/

# 自动生成的文件
*.min.js
*.min.css
*.lock
package-lock.json
yarn.lock
pnpm-lock.yaml

# 其他不需格式化的文件
*.log
*.md
*.svg
*.png
*.ico
*.jpg
*.gif
*.webp
```

```javascript
// commitlint.config.mjs
import { commitlintConfig } from '@x-library/lint/commitlint';

export default commitlintConfig();
```

```javascript
// stylelint.config.mjs
import createStylelintConfig from '@x-library/lint/stylelint';

export default createStylelintConfig();
```

```
// .stylelintignore
# 构建产物
dist/
build/
coverage/

# 依赖目录
node_modules/

# 自动生成的文件
*.min.css
*.min.js

# 第三方库
vendor/
lib/

# 不需要检查的文件类型
*.json
*.md
*.html
```

### Package.json 脚本配置

```json
{
  "scripts": {
    "lint:js": "eslint \"**/*.{js,jsx,ts,tsx,vue}\"",
    "lint:js:fix": "eslint \"**/*.{js,jsx,ts,tsx,vue}\" --fix",
    "lint:css": "stylelint \"**/*.{css,scss,sass}\"",
    "lint:css:fix": "stylelint \"**/*.{css,scss,sass}\" --fix",
    "lint": "pnpm lint:js && pnpm lint:css",
    "lint:fix": "pnpm lint:js:fix && pnpm lint:css:fix",
    "prepare": "husky"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx,vue}": ["eslint --fix", "prettier --write"],
    "*.{css,scss,sass,less}": ["stylelint --fix --allow-empty-input", "prettier --write"],
    "*.{json,md,yml,yaml}": ["prettier --write"]
  }
}
```

## 📋 详细使用

见文档

## 🎯 支持的文件类型

- **JavaScript**: `.js`, `.jsx`
- **TypeScript**: `.ts`, `.tsx`
- **Vue**: `.vue`
- **样式文件**: `.css`, `.scss`, `.sass`
- **配置文件**: `.json`, `.yml`, `.yaml`

## 💡 最佳实践

### 1. Git Hooks 集成

本包已将 husky 和 lint-staged 作为 peerDependencies 引入，安装此包时会自动安装这些依赖。下面是配置方法：

在 `package.json` 中添加必要的配置：

```json
// package.json
{
  "scripts": {
    "prepare": "husky"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx,vue}": ["eslint --fix", "prettier --write"],
    "*.{css,scss,sass,less}": ["stylelint --fix --allow-empty-input", "prettier --write"],
    "*.{json,md,yml,yaml}": ["prettier --write"]
  }
}
```

然后初始化并设置 Git hooks：

```bash
# 确保项目是一个 Git 仓库
git init

# 初始化 husky（这一步会创建 .husky 目录）
npx husky init
```

由于 husky add 命令已被弃用，建议直接手动创建钩子文件：

1. 创建 `.husky/pre-commit` 文件，内容如下：

```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

2. 创建 `.husky/commit-msg` 文件，内容如下：

```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit "$1"
```

3. 确保钩子文件具有执行权限：

```bash
chmod +x .husky/pre-commit .husky/commit-msg
```

确认已生成以下文件：

- `.husky/pre-commit`
- `.husky/commit-msg`
- `.husky/_/.gitignore`
- `.husky/_/husky.sh`

### 2. VSCode 配置

推荐创建 `.vscode` 目录，并添加以下配置文件，以便 VSCode 能够与 lint 工具更好地协同工作：

```json
// .vscode/settings.json
{
  // 启用保存时自动格式化
  "editor.formatOnSave": true,

  // 设置默认格式化工具为 Prettier
  "editor.defaultFormatter": "esbenp.prettier-vscode",

  // ESLint 配置
  "eslint.enable": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue",
    "html",
    "markdown"
  ],
  "eslint.useFlatConfig": true,
  "eslint.workingDirectories": [
    {
      "mode": "auto"
    }
  ],
  "eslint.options": {
    "ignorePatterns": ["**/dist/**", "**/build/**"]
  },

  "stylelint.enable": true,
  "stylelint.validate": ["css", "scss", "sass", "less", "vue"],
  "stylelint.snippet": ["css", "scss", "sass", "less", "vue"],

  // 保存时的代码操作
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.fixAll.stylelint": "explicit"
    // "source.organizeImports": "explicit"  // 暂时禁用，使用 ESLint 管理 import
  },

  // 自动清理行尾空格
  "files.trimTrailingWhitespace": true,
  "files.trimFinalNewlines": true,
  "files.insertFinalNewline": true,

  // Prettier 扩展配置
  "prettier.requireConfig": true,
  "prettier.useEditorConfig": false
}
```

```json
// .vscode/extensions.json
{
  "recommendations": ["vue.volar", "stylelint.vscode-stylelint", "esbenp.prettier-vscode"]
}
```

### 3. 推荐的 VSCode 扩展

- ESLint
- Prettier - Code formatter
- Stylelint
- Vue Language Features (Volar)
