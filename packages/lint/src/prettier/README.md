# Prettier 配置模块

Prettier 配置模块提供了一套完整的、可扩展的代码格式化配置解决方案，确保项目代码风格的一致性。

## 主要功能

- ✅ **开箱即用** - 预配置的最佳实践格式化规则
- 🔧 **易于扩展** - 支持自定义和覆盖默认配置
- 🛠️ **与 ESLint 无缝集成** - 自动协调 Prettier 与 ESLint 的工作
- 🚀 **提高开发效率** - 自动格式化，让开发者专注于代码逻辑
- 🌟 **提升代码质量** - 统一的代码风格提高可读性和可维护性

## 使用方法

### 基本用法

在项目根目录创建 `.prettierrc.js` 文件：

```javascript
import { prettierConfig } from '@x-library/lint/prettier';

export default prettierConfig();
```

### 自定义配置

你可以通过传入配置对象来自定义 Prettier 配置：

```javascript
import { prettierConfig } from '@x-library/lint/prettier';

export default prettierConfig({
  // 自定义配置
  printWidth: 120 // 修改每行最大字符数
  // 其他自定义配置...
});
```

## 配置详解

本模块提供的默认 Prettier 配置包含以下规则：

### 基础格式设置

#### `printWidth`

- **值**: `100`
- **说明**: 每行代码的最大字符数，超过会自动换行
- **示例**:

  ```js
  // printWidth: 100 的效果
  const longString =
    'This is a very long string that will be wrapped automatically when it exceeds the print width limit';

  // 超过 100 个字符后会自动换行
  const wrappedString =
    'This is a very long string that will be wrapped automatically when it exceeds the print width limit';
  ```

#### `tabWidth`

- **值**: `2`
- **说明**: 缩进使用的空格数
- **示例**:
  ```js
  // tabWidth: 2 的效果
  function example() {
    if (condition) {
      doSomething();
    }
  }
  ```

#### `useTabs`

- **值**: `false`
- **说明**: 使用空格而不是制表符进行缩进
- **示例**: 所有缩进使用空格，而不是 Tab 字符

### 标点符号设置

#### `semi`

- **值**: `true`
- **说明**: 语句末尾添加分号
- **示例**:
  ```js
  // semi: true 的效果
  const x = 1;
  function test() {
    return true;
  }
  ```

#### `singleQuote`

- **值**: `true`
- **说明**: 使用单引号而不是双引号
- **示例**:
  ```js
  // singleQuote: true 的效果
  const name = 'John';
  const message = 'Hello, world!';
  ```

#### `quoteProps`

- **值**: `'as-needed'`
- **说明**: 对象属性仅在需要时添加引号
- **示例**:
  ```js
  // quoteProps: 'as-needed' 的效果
  const obj = {
    regular: 'value',
    'special-key': 'value' // 只有特殊字符的键名需要引号
  };
  ```

#### `trailingComma`

- **值**: `'none'`
- **说明**: 不在任何地方添加尾随逗号
- **示例**:

  ```js
  // trailingComma: 'none' 的效果
  const obj = {
    a: 1,
    b: 2
  };

  const arr = [1, 2];
  ```

### 空格和括号设置

#### `bracketSpacing`

- **值**: `true`
- **说明**: 对象大括号内添加空格
- **示例**:
  ```js
  // bracketSpacing: true 的效果
  const obj = { foo: bar }; // 有空格
  ```

#### `bracketSameLine`

- **值**: `false`
- **说明**: 多行 HTML、JSX、Vue 等标签的闭合尖括号是否与最后一个属性在同一行。设为 `false` 时，闭合尖括号会单独放在新行。
- **示例**:

  ```jsx
  // bracketSameLine: false 的效果（默认）
  <div
    className="example"
    id="demo"
  >
    Content
  </div>

  // bracketSameLine: true 的效果
  <div
    className="example"
    id="demo">
    Content
  </div>
  ```

#### `arrowParens`

- **值**: `'avoid'`
- **说明**: 当只有一个参数时，箭头函数参数不使用括号
- **示例**:
  ```js
  // arrowParens: 'avoid' 的效果
  const singleParam = x => x * 2;
  const multipleParams = (x, y) => x * y;
  ```

### 其他设置

#### `endOfLine`

- **值**: `'lf'`
- **说明**: 使用 Unix 换行符 (LF)
- **示例**: 文件使用 \n 作为换行符

#### `vueIndentScriptAndStyle`

- **值**: `false`
- **说明**: Vue 文件中 script 和 style 标签不额外缩进
- **示例**:
  ```vue
  <template>
    <div>Content</div>
  </template>
  <script>
  export default {
    // 不额外缩进
  };
  </script>
  ```

#### `singleAttributePerLine`

- **值**: `false`
- **说明**: HTML 属性不强制每行一个
- **示例**:
  ```jsx
  // singleAttributePerLine: false 的效果
  <button className="btn" onClick={handleClick}>
    Click me
  </button>
  ```

#### `htmlWhitespaceSensitivity`

- **值**: `'css'`
- **说明**: HTML 空格敏感度，遵循 CSS 规则
- **示例**: 根据 CSS 的 display 属性处理 HTML 元素之间的空白

#### `embeddedLanguageFormatting`

- **值**: `'auto'`
- **说明**: 自动格式化嵌入的代码块
- **示例**: 在 Vue 组件或 Markdown 中的代码块会被格式化

## 注意事项

使用本配置时，请确保项目中已安装 Prettier 相关依赖。为了获得最佳体验，建议将 Prettier 与 ESLint 集成使用，`@x-library/lint` 包已经为你处理了这些集成工作。

如果你的项目中同时使用 ESLint 和 Prettier，`@x-library/lint` 已经配置了相应的规则来避免冲突，无需额外设置。
