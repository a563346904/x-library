# Stylelint 配置模块

Stylelint 配置模块提供了一套完整的、可扩展的 CSS/SCSS 代码规范配置解决方案，确保项目样式代码的一致性和质量。

## 主要功能

- ✅ **开箱即用** - 预配置的最佳实践样式规则
- 🔧 **易于扩展** - 支持自定义和覆盖默认配置
- 🎯 **SCSS 支持** - 内置 SCSS 专用规则集成
- 🖌️ **Vue 支持** - 支持 Vue 单文件组件中的样式部分
- 🚀 **提高开发效率** - 统一的样式规范减少团队协作成本

## 使用方法

### 基本用法

在项目根目录创建 `.stylelintrc.js` 文件：

```javascript
import { createStylelintConfig } from '@x-library/lint/stylelint';

export default createStylelintConfig();
```

### 自定义配置

你可以通过传入配置对象来自定义 Stylelint 配置：

```javascript
import { createStylelintConfig } from '@x-library/lint/stylelint';

export default createStylelintConfig({
  // 添加自定义规则
  rules: {
    '@stylistic/string-quotes': 'double' // 使用双引号
    // 其他自定义规则...
  },

  // 添加额外的插件
  plugins: [
    // 其他 Stylelint 插件...
  ]
});
```

## 配置详解

本模块提供的默认 Stylelint 配置包含以下核心组件：

### 继承的配置

- **stylelint-config-standard**: 官方标准配置，包含大量的最佳实践规则
- **stylelint-config-rational-order**: 提供合理的 CSS 属性排序规则

### 插件支持

- **stylelint-scss**: 提供 SCSS 专用的规则支持
- **@stylistic/stylelint-plugin**: 提供代码风格相关的规则

### 文件类型支持

配置针对不同文件类型提供了特殊处理：

#### SCSS/Sass 文件

- 使用 `postcss-scss` 语法解析器
- 启用 SCSS 专用的 at-rule 检查
- 允许使用 SCSS 特有函数

#### Vue 文件

- 使用 `postcss-html` 语法解析器
- 支持 Vue 单文件组件中的样式部分

## 规则详解

本节列举了 `@x-library/lint` 包中的所有 Stylelint 规则，并为每个规则提供了说明。

### 代码错误预防规则

#### `block-no-empty`

- **值**: `true`
- **说明**: 禁止空的 CSS 块
- **正例**:
  ```css
  .foo {
    color: red;
  }
  ```
- **反例**:
  ```css
  .foo {
  }
  ```

#### `color-no-invalid-hex`

- **值**: `true`
- **说明**: 禁止无效的十六进制颜色值
- **正例**:
  ```css
  .foo {
    color: #fff;
  }
  ```
- **反例**:
  ```css
  .foo {
    color: #zzz;
  }
  ```

#### `declaration-block-no-duplicate-properties`

- **值**: `true`
- **说明**: 禁止在同一声明块中重复的属性
- **正例**:
  ```css
  .foo {
    color: red;
    font-size: 16px;
  }
  ```
- **反例**:
  ```css
  .foo {
    color: red;
    font-size: 16px;
    color: blue;
  }
  ```

#### `font-family-no-duplicate-names`

- **值**: `true`
- **说明**: 禁止在字体族名称列表中重复的名称
- **正例**:
  ```css
  .foo {
    font-family: 'Arial', sans-serif;
  }
  ```
- **反例**:
  ```css
  .foo {
    font-family: 'Arial', 'Arial', sans-serif;
  }
  ```

#### `property-no-unknown`

- **值**: `true`
- **说明**: 禁止未知的属性
- **正例**:
  ```css
  .foo {
    color: red;
  }
  ```
- **反例**:
  ```css
  .foo {
    colr: red;
  }
  ```

#### `unit-no-unknown`

- **值**: `true`
- **说明**: 禁止未知的单位
- **正例**:
  ```css
  .foo {
    margin: 10px;
  }
  ```
- **反例**:
  ```css
  .foo {
    margin: 10pixels;
  }
  ```

### 代码风格规则

#### `@stylistic/max-line-length`

- **值**: `[80, { ignorePattern: '^@import' }]`
- **说明**: 限制每行最大字符数为 80，忽略 @import 语句
- **正例**:

  ```css
  /* 不超过 80 个字符的行 */
  .foo {
    color: red;
  }

  /* @import 语句可以超过 80 个字符 */
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
  ```

#### `@stylistic/string-quotes`

- **值**: `'single'`
- **说明**: 强制使用单引号
- **正例**:
  ```css
  .foo {
    font-family: 'Arial', sans-serif;
  }
  ```
- **反例**:
  ```css
  .foo {
    font-family: 'Arial', sans-serif;
  }
  ```

#### `@stylistic/indentation`

- **值**: `2`
- **说明**: 强制使用 2 个空格缩进
- **正例**:
  ```css
  .foo {
    color: red;
    .bar {
      color: blue;
    }
  }
  ```
- **反例**:
  ```css
  .foo {
    color: red;
    .bar {
      color: blue;
    }
  }
  ```

### SCSS 特有规则

#### `scss/at-mixin-pattern`

- **值**: `'^[_a-z0-9-]+$'`
- **说明**: 强制 SCSS 混合宏（Mixin）名称为小写并使用破折号分隔
- **正例**:
  ```scss
  @mixin button-style {
    // ...
  }
  ```
- **反例**:
  ```scss
  @mixin ButtonStyle {
    // ...
  }
  ```

#### `scss/at-rule-no-unknown`

- **值**: `true`
- **说明**: 检查未知的 at 规则，但会识别 SCSS 特有的规则。该规则禁用了标准的 `at-rule-no-unknown` 规则，并使用 SCSS 版本代替，这样就不会错误地将 SCSS 特有的 at 规则（如 `@mixin`、`@include`、`@function` 等）标记为错误。
- **正例**:

  ```scss
  // 标准 CSS at 规则
  @media (min-width: 768px) {
    // ...
  }

  // SCSS 特有的 at 规则
  @mixin button-style {
    // ...
  }

  @include button-style;

  @if $condition {
    // ...
  }
  ```

- **反例**:
  ```scss
  // 在 SCSS 中不存在的 at 规则
  @unknown {
    // 这会被标记为错误
  }
  ```

### 选择器规则

#### `selector-class-pattern`

- **值**: `'^[a-z0-9]+(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$'`
- **说明**: 强制 BEM 风格命名类名，支持块（block）、元素（element）和修饰符（modifier）
- **正例**:

  ```css
  /* 块 */
  .block {
    /* ... */
  }

  /* 块+修饰符 */
  .block--modifier {
    /* ... */
  }

  /* 块+元素 */
  .block__element {
    /* ... */
  }

  /* 块+元素+修饰符 */
  .block__element--modifier {
    /* ... */
  }

  /* 多词块名 */
  .multi-word-block__element {
    /* ... */
  }
  ```

- **反例**:

  ```css
  /* 首字母大写 */
  .Block {
    /* ... */
  }

  /* 驼峰命名 */
  .blockElement {
    /* ... */
  }

  /* 不符合 BEM 结构 */
  .block_element {
    /* ... */
  }
  ```

#### `selector-no-qualifying-type`

- **值**: `true`
- **说明**: 禁止选择器同时使用元素类型和类名
- **正例**:
  ```css
  .button {
    /* ... */
  }
  ```
- **反例**:
  ```css
  button.button {
    /* ... */
  }
  ```

### 其他规则

#### `function-url-no-scheme-relative`

- **值**: `true`
- **说明**: 禁止 URL 使用相对方案
- **正例**:
  ```css
  .foo {
    background: url('https://example.com/image.png');
  }
  ```
- **反例**:
  ```css
  .foo {
    background: url('//example.com/image.png');
  }
  ```

#### `value-no-vendor-prefix`

- **值**: `true`
- **说明**: 禁止使用带供应商前缀的值
- **正例**:
  ```css
  .foo {
    display: flex;
  }
  ```
- **反例**:
  ```css
  .foo {
    display: -webkit-flex;
  }
  ```

## 注意事项

使用本配置时，请确保项目中已安装 Stylelint 相关依赖。为了获得最佳体验，建议将此配置与 ESLint 和 Prettier 一起使用，`@x-library/lint` 包已经为你处理了这些集成工作。

对于 SCSS 或 Vue 项目，本配置自动处理了相应的语法解析，无需额外配置。如果你需要对其他类型的文件进行特殊处理，可以通过自定义配置中的 `overrides` 字段进行扩展。
