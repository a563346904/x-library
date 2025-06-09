// 使用 @x-library/lint 包的函数式配置
import { eslintConfig } from '../dist/eslint/index.js';

// 使用标准ESLint配置格式
// 注意：这些示例文件故意包含错误，不应该被编辑器自动格式化
// 如果使用VS Code，请确保在.vscode/settings.json中禁用自动格式化
// 同时项目中已添加.prettierignore文件以防止Prettier格式化这些文件
export default eslintConfig({
  // 指定要包含的文件
  files: ['./eslint-error-examples/**/*.{js,ts,vue}'],

  // 自定义规则配置
  rules: {
    'default-case': 'off',
    semi: 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-unused-vars': 'off',
    'no-undef': 'off',
    'no-unreachable': 'off',
    'prefer-const': 'off',
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    'no-fallthrough': 'off',

    // import-errors.js 相关规则
    'import/no-duplicates': 'off', // 禁用重复导入检查
    'import/order': 'off', // 禁用导入顺序检查
    'import/newline-after-import': 'off', // 禁用导入后换行检查
    'no-redeclare': 'off', // 禁用重复声明检查
    'prettier/prettier': 'off', // 禁用prettier格式检查

    // maintainability-errors.js 相关规则
    complexity: 'off', // 禁用函数复杂度检查
    'max-depth': 'off', // 禁用嵌套深度检查
    'max-params': 'off', // 禁用函数参数数量检查
    'max-lines-per-function': 'off', // 禁用函数行数限制检查

    // naming-errors.js 相关规则
    camelcase: 'off', // 禁用驼峰命名法检查
    'no-underscore-dangle': 'off', // 禁用下划线变量名检查
    'new-cap': 'off', // 禁用构造函数首字母大写检查

    // performance-errors.js 相关规则
    'no-array-constructor': 'off', // 禁用数组构造函数检查
    '@typescript-eslint/no-array-constructor': 'off', // 禁用TS数组构造函数检查
    'no-new-object': 'off', // 禁用对象构造函数检查
    'no-new-wrappers': 'off', // 禁用包装对象构造函数检查
    'no-loop-func': 'off', // 禁用循环中创建函数检查

    // quality-errors.js 相关规则
    'no-var': 'off', // 禁用var检查
    'object-shorthand': 'off', // 禁用对象简写语法检查
    'prefer-template': 'off', // 禁用模板字符串检查

    // security-errors.js 相关规则
    'no-eval': 'off', // 禁用eval检查
    'no-new-func': 'off', // 禁用Function构造函数检查
    'no-implied-eval': 'off', // 禁用隐式eval检查
    'no-caller': 'off', // 禁用arguments.callee检查
    'no-extend-native': 'off', // 禁用扩展原生对象检查
    'no-proto': 'off', // 禁用__proto__检查
    'no-script-url': 'off', // 禁用javascript:URL检查
    'no-return-assign': 'off', // 禁用return赋值检查
    'no-throw-literal': 'off', // 禁用throw字面量检查

    // typescript-errors.ts 相关规则
    '@typescript-eslint/no-explicit-any': 'off', // 禁用any类型检查

    // vue-errors.vue 相关规则
    'vue/attribute-hyphenation': 'off', // 禁用属性连字符命名检查
    'vue/v-on-event-hyphenation': 'off', // 禁用事件连字符命名检查
    'vue/no-v-html': 'off', // 禁用v-html指令检查
    'vue/no-useless-mustaches': 'off', // 禁用无用的花括号检查
    'vue/v-bind-style': 'off', // 禁用v-bind样式检查
    'vue/no-useless-v-bind': 'off', // 禁用无用的v-bind检查
    'vue/prefer-separate-static-class': 'off', // 禁用分离静态class检查
    'vue/no-multiple-objects-in-class': 'off', // 禁用class中多对象检查
    'vue/no-static-inline-styles': 'off', // 禁用内联样式检查
    'vue/prefer-define-options': 'off', // 禁用defineOptions检查
    'vue/component-definition-name-casing': 'off', // 禁用组件名大小写检查
    'vue/no-boolean-default': 'off', // 禁用布尔默认值检查
    'vue/require-explicit-emits': 'off', // 禁用显式emits检查
    'vue/order-in-components': 'off', // 禁用组件选项顺序检查
    'vue/no-dupe-keys': 'off', // 禁用重复键检查
    'vue/valid-define-props': 'off', // 禁用defineProps验证检查
    'vue/no-ref-as-operand': 'off', // 禁用ref作为操作数检查
    'vue/no-watch-after-await': 'off', // 禁用await后使用watch检查
    'vue/custom-event-name-casing': 'off', // 禁用事件名大小写检查
    'vue/require-macro-variable-name': 'off', // 禁用宏变量命名检查
    'sort-imports': 'off' // 禁用导入排序检查
  }
});
