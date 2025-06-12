# ESLint 配置模块

ESLint 配置模块提供了一套完整的、可扩展的 ESLint 配置解决方案，支持 JavaScript、TypeScript 和 Vue.js 项目。

## 主要功能

- ✅ **开箱即用** - 预配置的最佳实践规则集
- 🔧 **模块化设计** - 支持按需引入各种规则集
- 🛠️ **可扩展性强** - 轻松自定义和覆盖默认规则
- 🎯 **TypeScript 支持** - 内置 TypeScript 规则集成
- 🖌️ **Prettier 集成** - 自动与 Prettier 协同工作
- 🖼️ **Vue.js 支持** - 专门针对 Vue 项目的规则集

## 使用方法

### 基本用法

在项目根目录创建 `eslint.config.mjs` 文件：

```javascript
import { eslintConfig } from '@x-library/lint/eslint';

export default eslintConfig();
```

### 自定义配置

你可以通过传入配置对象来自定义 ESLint 配置：

```javascript
import { eslintConfig } from '@x-library/lint/eslint';

export default eslintConfig({
  // 禁用某些配置
  disable: {
    prettier: false, // 设为 true 可禁用 Prettier 集成
    vue: false // 设为 true 可禁用 Vue 规则
  },

  // 添加自定义规则
  rules: {
    'no-console': 'warn'
    // 其他自定义规则...
  },

  // 添加忽略项
  ignores: ['build/**', 'dist/**'],

  // 添加额外配置
  additionalConfigs: [
    // 其他 ESLint 配置...
  ]
});
```

### 单独使用各个规则集

你也可以单独导入和使用各个规则集：

```javascript
import { javascriptRules, typescriptRules, vueRules } from '@x-library/lint/eslint';

export default [
  // 你的基础配置
  {
    rules: {
      ...javascriptRules,
      ...typescriptRules
      // 其他规则...
    }
  }
];
```

## 配置结构

本模块包含以下主要组件：

- **规则集**：按类别划分的各种规则配置

  - JavaScript/TypeScript 基础规则
  - Vue.js 专用规则
  - 代码质量规则
  - 性能优化规则
  - 安全性规则
  - 可维护性规则
  - 命名规范规则
  - 导入/导出规则
  - 错误处理规则
  - Prettier 兼容规则

- **预设配置**：
  - 基础 JavaScript 配置
  - Vue.js 配置
  - Prettier 集成配置

## 注意事项

使用本配置时，请确保项目中已安装所需的依赖，包括 ESLint 相关插件。详细依赖列表请参考主 README 文件中的注意事项部分。

## 规则详解

本节列举了 `@x-library/lint` 包中的所有 ESLint 规则，并为每个规则提供了正例和反例。

### 代码质量规则 (quality.ts)

#### `no-var`

- **说明**: 禁止使用 var 声明变量
- **正例**:
  ```js
  let x = 1;
  const y = 2;
  ```
- **反例**:
  ```js
  var z = 3;
  ```

#### `object-shorthand`

- **说明**: 要求使用对象字面量简写语法
- **正例**:
  ```js
  const obj = { x, method() {} };
  ```
- **反例**:
  ```js
  const obj = { x: x, method: function () {} };
  ```

#### `prefer-const`

- **说明**: 要求使用 const 声明那些声明后不再被修改的变量
- **正例**:
  ```js
  const x = 1;
  ```
- **反例**:
  ```js
  let x = 1; // x 未被修改
  ```

#### `prefer-template`

- **说明**: 要求使用模板字面量而非字符串连接
- **正例**:
  ```js
  const message = `Hello, ${name}!`;
  ```
- **反例**:
  ```js
  const message = 'Hello, ' + name + '!';
  ```

### 错误处理规则 (error-handling.ts)

#### `default-case`

- **说明**: 要求 switch 语句中有 default 分支
- **正例**:
  ```js
  switch (x) {
    case 1:
      break;
    default:
      break;
  }
  ```
- **反例**:
  ```js
  switch (x) {
    case 1:
      break;
  }
  ```

#### `no-empty`

- **说明**: 禁止空块语句
- **正例**:
  ```js
  if (condition) {
    doSomething();
  }
  ```
- **反例**:
  ```js
  if (condition) {
  }
  ```

#### `no-empty-function`

- **说明**: 禁止空函数
- **正例**:
  ```js
  function fn() {
    return null;
  }
  ```
- **反例**:
  ```js
  function fn() {}
  ```

#### `no-fallthrough`

- **说明**: 禁止 case 语句落空
- **正例**:
  ```js
  switch (x) {
    case 1:
      doSomething();
      break;
  }
  ```
- **反例**:
  ```js
  switch (x) {
    case 1:
      doSomething();
    case 2:
    // 落空到这里
  }
  ```

#### `no-unreachable`

- **说明**: 禁止在 return 等语句之后出现不可达代码
- **正例**:
  ```js
  function fn() {
    return true;
  }
  ```
- **反例**:
  ```js
  function fn() {
    return true;
    console.log('unreachable'); // 永远不会执行
  }
  ```

#### `no-unused-expressions`

- **说明**: 禁止出现未使用的表达式
- **正例**:
  ```js
  let x = 5;
  ```
- **反例**:
  ```js
  5; // 未使用的表达式
  x && y; // 未使用结果
  ```

### 导入规则 (import.ts)

#### `import/newline-after-import`

- **说明**: 要求在最后一个导入语句后有一个空行
- **正例**:

  ```js
  import x from 'x';

  const y = 1;
  ```

- **反例**:
  ```js
  import x from 'x';
  const y = 1;
  ```

#### `import/no-duplicates`

- **说明**: 禁止重复导入同一模块
- **正例**:
  ```js
  import { a, b } from 'module';
  ```
- **反例**:
  ```js
  import { a } from 'module';
  import { b } from 'module';
  ```

#### `import/order`

- **说明**: 强制导入的排序
- **正例**:
  ```js
  // 按内置、外部、内部、父级、同级、索引顺序排列
  import fs from 'fs';
  import express from 'express';
  import { api } from '@internal/api';
  import { parent } from '../parent';
  import { sibling } from './sibling';
  import './index.css';
  ```
- **反例**:
  ```js
  // 导入顺序混乱
  import './index.css';
  import { api } from '@internal/api';
  import fs from 'fs';
  import { sibling } from './sibling';
  import express from 'express';
  ```

#### `sort-imports`

- **说明**: 强制导入声明按字母顺序排列
- **正例**:
  ```js
  import { a, b, c } from 'module';
  ```
- **反例**:
  ```js
  import { c, a, b } from 'module';
  ```

### 代码维护性规则 (maintainability.ts)

#### `complexity`

- **说明**: 限制圈复杂度，最大值为 10
- **正例**:
  ```js
  // 简单的条件判断和循环
  function simpleFunction(a, b) {
    if (a > b) {
      return a;
    }
    return b;
  }
  ```
- **反例**:
  ```js
  // 嵌套多层的条件判断或循环
  function complexFunction(a, b, c, d, e) {
    if (a > 0) {
      if (b > 0) {
        if (c > 0) {
          if (d > 0) {
            if (e > 0) {
              // 过于复杂的嵌套
            }
          }
        }
      }
    }
    // ...很多其他逻辑分支
  }
  ```

#### `max-depth`

- **说明**: 限制嵌套块的最大深度为 4
- **正例**:
  ```js
  // 最多 4 层嵌套
  if (condition1) {
    if (condition2) {
      if (condition3) {
        if (condition4) {
          doSomething();
        }
      }
    }
  }
  ```
- **反例**:
  ```js
  // 5 层嵌套
  if (condition1) {
    if (condition2) {
      if (condition3) {
        if (condition4) {
          if (condition5) {
            doSomething();
          }
        }
      }
    }
  }
  ```

#### `max-lines-per-function`

- **说明**: 限制函数的最大行数为 50
- **正例**:
  ```js
  // 小型、单一职责的函数
  function calculateTotal(items) {
    return items.reduce((sum, item) => sum + item.price, 0);
  }
  ```
- **反例**:
  ```js
  // 超过 50 行的长函数
  function doEverything() {
    // ...50+ 行代码
  }
  ```

#### `max-params`

- **说明**: 限制函数定义中参数的最大数量为 4
- **正例**:
  ```js
  function process(a, b, c, d) {
    // 处理逻辑
  }
  ```
- **反例**:
  ```js
  function process(a, b, c, d, e) {
    // 参数过多
  }
  ```

### 命名规则 (naming.ts)

#### `camelcase`

- **说明**: 要求使用骆驼拼写法
- **正例**:
  ```js
  const myVariable = 1;
  ```
- **反例**:
  ```js
  const my_variable = 1;
  ```

#### `new-cap`

- **说明**: 要求构造函数首字母大写
- **正例**:
  ```js
  const instance = new Constructor();
  ```
- **反例**:
  ```js
  const instance = new constructor();
  ```

#### `no-underscore-dangle`

- **说明**: 禁止标识符中有悬空下划线
- **正例**:
  ```js
  const normalVar = 1;
  ```
- **反例**:
  ```js
  const _privateVar = 1; // 除了特定允许的标识符
  ```

### 性能规则 (performance.ts)

#### `no-array-constructor`

- **说明**: 禁用 Array 构造函数
- **正例**:
  ```js
  const arr = [1, 2, 3];
  ```
- **反例**:
  ```js
  const arr = new Array(1, 2, 3);
  ```

#### `no-loop-func`

- **说明**: 禁止在循环中创建函数
- **正例**:
  ```js
  const funcs = [];
  for (let i = 0; i < 10; i++) {
    funcs[i] = x => x + i;
  }
  ```
- **反例**:
  ```js
  for (let i = 0; i < 10; i++) {
    setTimeout(function () {
      console.log(i);
    }, 100);
  }
  ```

#### `no-new-object`

- **说明**: 禁用 Object 构造函数
- **正例**:
  ```js
  const obj = {};
  ```
- **反例**:
  ```js
  const obj = new Object();
  ```

#### `no-new-wrappers`

- **说明**: 禁止对原始类型使用 new 操作符
- **正例**:
  ```js
  const str = 'Hello';
  ```
- **反例**:
  ```js
  const str = new String('Hello');
  ```

### Prettier 规则 (prettier.ts)

#### `prettier/prettier`

- **说明**: 按照 Prettier 配置格式化代码
- **正例**: 符合 Prettier 配置的代码格式
- **反例**: 不符合 Prettier 配置的代码格式

### 安全规则 (security.ts)

#### `no-caller`

- **说明**: 禁用 arguments.caller 或 arguments.callee
- **正例**:
  ```js
  function fn() {
    return arguments[0];
  }
  ```
- **反例**:
  ```js
  function fn() {
    return arguments.caller;
  }
  ```

#### `no-eval`

- **说明**: 禁用 eval()
- **正例**:
  ```js
  const obj = JSON.parse(json);
  ```
- **反例**:
  ```js
  eval('const x = 10');
  ```

#### `no-extend-native`

- **说明**: 禁止扩展原生对象
- **正例**:
  ```js
  const myArray = {
    customMethod() {}
  };
  ```
- **反例**:
  ```js
  Array.prototype.customMethod = function () {};
  ```

#### `no-implied-eval`

- **说明**: 禁止使用类似 eval() 的方法
- **正例**:
  ```js
  setTimeout(() => {
    alert('Hi!');
  }, 100);
  ```
- **反例**:
  ```js
  setTimeout("alert('Hi!')", 100);
  ```

#### `no-new-func`

- **说明**: 禁止对 Function 对象使用 new 操作符
- **正例**:
  ```js
  const add = (a, b) => a + b;
  ```
- **反例**:
  ```js
  const add = new Function('a', 'b', 'return a + b');
  ```

#### `no-proto`

- **说明**: 禁用 **proto** 属性
- **正例**:
  ```js
  const proto = Object.getPrototypeOf(obj);
  ```
- **反例**:
  ```js
  const proto = obj.__proto__;
  ```

#### `no-return-assign`

- **说明**: 禁止在 return 语句中使用赋值语句
- **正例**:
  ```js
  function fn() {
    let x = 1;
    return x;
  }
  ```
- **反例**:
  ```js
  function fn() {
    return (x = 1);
  }
  ```

#### `no-script-url`

- **说明**: 禁止使用 javascript: url
- **正例**:
  ```js
  location.href = 'https://example.com';
  ```
- **反例**:
  ```js
  location.href = 'javascript:alert("XSS")';
  ```

#### `no-throw-literal`

- **说明**: 禁止抛出异常字面量
- **正例**:
  ```js
  throw new Error('error');
  ```
- **反例**:
  ```js
  throw 'error';
  ```

### TypeScript 规则 (typescript.ts)

#### `@typescript-eslint/no-explicit-any`

- **说明**: 禁止使用 any 类型
- **正例**:
  ```ts
  function fn(param: unknown) {}
  ```
- **反例**:
  ```ts
  function fn(param: any) {}
  ```

#### `@typescript-eslint/no-unused-vars`

- **说明**: 禁止未使用的变量
- **正例**:
  ```ts
  function fn(used) {
    return used;
  }
  ```
- **反例**:
  ```ts
  function fn(unused) {
    return 5;
  }
  ```

### Vue 规则 (vue.ts)

#### Vue 基础规则

##### `vue/component-name-in-template-casing`

- **说明**: 要求组件名称使用 PascalCase
- **正例**:
  ```vue
  <MyComponent />
  ```
- **反例**:
  ```vue
  <my-component />
  ```

##### `vue/multi-word-component-names`

- **说明**: 不强制要求组件名称使用多个单词
- **正例**:
  ```vue
  <User />
  <UserProfile />
  ```

##### `vue/no-setup-props-destructure`

- **说明**: 不禁止解构 setup 的 props
- **正例**:
  ```js
  setup(props) {
    const { title } = props;
  }
  ```

##### `vue/no-v-html`

- **说明**: 警告使用 v-html 指令
- **正例**:
  ```vue
  <div>{{ safeHtml }}</div>
  ```
- **反例**:
  ```vue
  <div v-html="html"></div>
  ```

##### `vue/require-default-prop`

- **说明**: 不要求 props 有默认值
- **正例**:
  ```js
  props: {
    title: String;
  }
  ```

##### `vue/require-explicit-emits`

- **说明**: 要求明确定义 emits
- **正例**:
  ```js
  emits: ['update', 'delete'];
  ```
- **反例**: 未定义但使用 emit

#### Vue 属性和命名规则

##### `vue/attribute-hyphenation`

- **说明**: 要求在模板中的自定义组件上使用连字符属性名
- **正例**:
  ```vue
  <MyComponent custom-prop="value" />
  ```
- **反例**:
  ```vue
  <MyComponent customProp="value" />
  ```

##### `vue/custom-event-name-casing`

- **说明**: 要求自定义事件名使用 kebab-case
- **正例**:
  ```js
  this.$emit('my-event');
  ```
- **反例**:
  ```js
  this.$emit('myEvent');
  ```

##### `vue/prop-name-casing`

- **说明**: 要求 prop 名称使用 camelCase
- **正例**:
  ```js
  props: {
    userName: String;
  }
  ```
- **反例**:
  ```js
  props: {
    'user-name': String
  }
  ```

#### Vue Composition API 规则

##### `vue/define-emits-declaration`

- **说明**: 要求使用类型字面量定义 emits
- **正例**:
  ```js
  const emit = defineEmits({
    change: value => typeof value === 'string'
  });
  ```
- **反例**:
  ```js
  const emit = defineEmits(['change']);
  ```

##### `vue/define-props-declaration`

- **说明**: 要求使用基于类型的 props 定义
- **正例**:
  ```js
  const props = defineProps({
    title: {
      type: String,
      required: true
    }
  });
  ```
- **反例**:
  ```js
  const props = defineProps({
    title: String
  });
  ```

##### `vue/no-boolean-default`

- **说明**: 要求布尔类型的 prop 默认值为 false
- **正例**:
  ```js
  const props = defineProps({
    visible: {
      type: Boolean,
      default: false
    }
  });
  ```
- **反例**:
  ```js
  const props = defineProps({
    visible: {
      type: Boolean,
      default: true
    }
  });
  ```

##### `vue/no-ref-as-operand`

- **说明**: 禁止将 ref 对象用作操作数
- **正例**:
  ```js
  if (value.value === 0)
  ```
- **反例**:
  ```js
  if (value === 0)
  ```

##### `vue/no-watch-after-await`

- **说明**: 禁止在 await 之后使用 watch
- **正例**:
  ```js
  const data = ref(null);
  watch(data, () => {});
  await fetchData();
  ```
- **反例**:
  ```js
  await fetchData();
  watch(data, () => {}); // 在 await 之后使用 watch
  ```

##### `vue/prefer-define-options`

- **说明**: 建议使用 defineOptions 而非 export default
- **正例**:
  ```js
  defineOptions({
    name: 'MyComponent'
  });
  ```
- **反例**:
  ```js
  export default {
    name: 'MyComponent'
  };
  ```

##### `vue/require-macro-variable-name`

- **说明**: 要求宏变量使用标准命名约定
- **正例**:
  ```js
  const props = defineProps<{...}>()
  ```
- **反例**:
  ```js
  const p = defineProps<{...}>()
  ```

#### Vue 最佳实践规则

##### `vue/no-duplicate-attr-inheritance`

- **说明**: 禁止属性重复继承
- **正例**: 避免在组件和子组件中重复定义相同的属性
- **反例**: 在组件和子组件中重复定义相同的属性

##### `vue/no-empty-component-block`

- **说明**: 禁止空的组件块
- **正例**:
  ```vue
  <template>
    <div>Content</div>
  </template>
  ```
- **反例**:
  ```vue
  <template></template>
  ```

##### `vue/no-multiple-objects-in-class`

- **说明**: 禁止在 class 中使用多个对象
- **正例**:
  ```vue
  <div :class="[condition ? 'a' : 'b']"></div>
  ```
- **反例**:
  ```vue
  <div :class="[{ a: true }, { b: false }]"></div>
  ```

##### `vue/no-static-inline-styles`

- **说明**: 警告使用静态内联样式
- **正例**:
  ```vue
  <div class="styled"></div>
  ```
- **反例**:
  ```vue
  <div style="color: red"></div>
  ```

##### `vue/no-useless-mustaches`

- **说明**: 禁止不必要的模板字符串
- **正例**:
  ```vue
  <div>Text</div>
  ```
- **反例**:
  ```vue
  <div>{{ 'Text' }}</div>
  ```

##### `vue/no-useless-v-bind`

- **说明**: 禁止不必要的 v-bind
- **正例**:
  ```vue
  <div class="text"></div>
  ```
- **反例**:
  ```vue
  <div :class="'text'"></div>
  ```

##### `vue/prefer-separate-static-class`

- **说明**: 建议将静态类和动态类分开
- **正例**:
  ```vue
  <div class="static" :class="dynamic"></div>
  ```
- **反例**:
  ```vue
  <div :class="['static', dynamic]"></div>
  ```
