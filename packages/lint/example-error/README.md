# ESLint 错误示例目录

这个目录包含了各种故意引入ESLint错误的示例文件，用于测试和学习ESLint规则。

## 目录结构

- `eslint-error-examples/` - 包含各种类型的错误示例文件
- `eslint.config.mjs` - 专门为这些示例文件定制的ESLint配置

## 配置说明

这个目录使用独立的ESLint配置，与项目根目录的ESLint配置分开。主要特点：

1. 对示例文件中的各种错误类型禁用了相关规则
2. 仅适用于当前目录下的文件
3. 项目根目录的ESLint配置会忽略这个目录

## 防止自动格式化

这些示例文件故意包含各种ESLint错误，不应该被编辑器自动格式化。为了防止自动格式化，项目中已设置：

1. `.prettierignore` 文件，防止Prettier格式化这些文件
2. `.vscode/settings.json` 文件，禁用VS Code的自动格式化功能

如果您的编辑器仍然自动格式化这些文件，请参考您编辑器的文档，禁用对这些文件的格式化。

## 使用方法

### 使用特殊配置检查（禁用规则）

要使用特殊配置（禁用所有规则）检查示例文件，可以使用以下方法：

1. 使用npm脚本（从packages/lint目录）：

   ```bash
   npm run lint:example
   ```

2. 使用命令行（从example-error目录）：

   ```bash
   npx eslint -c /Users/kangjunpeng/Documents/project/x-library/packages/lint/example-error/eslint.config.mjs "/Users/kangjunpeng/Documents/project/x-library/packages/lint/example-error/eslint-error-examples/" --no-ignore
   ```

3. 使用相对路径（从packages/lint目录）：
   ```bash
   npx eslint -c example-error/eslint.config.mjs example-error/eslint-error-examples/**/*.{js,ts,vue} --no-ignore
   ```

### 查看所有规则错误（不禁用规则）

要查看示例文件中所有的ESLint错误（不使用特殊配置），可以使用以下方法：

1. 使用npm脚本（从packages/lint目录）：

   ```bash
   npm run lint:example:details
   ```

2. 使用命令行（不指定配置文件）：
   ```bash
   npx eslint example-error/eslint-error-examples/**/*.{js,ts,vue} --no-ignore
   ```

## 目的

这些示例主要用于：

1. 学习和理解各种ESLint规则
2. 测试ESLint配置的有效性
3. 作为文档，展示应该避免的代码实践
