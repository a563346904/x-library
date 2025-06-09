import type { PrettierConfig } from './types';

const defaultPrettierConfig: PrettierConfig = {
  printWidth: 100, // 每行最大字符数，超过会自动换行
  tabWidth: 2, // 缩进使用的空格数
  useTabs: false, // 使用空格而不是制表符进行缩进
  semi: true, // 语句末尾添加分号
  singleQuote: true, // 使用单引号而不是双引号
  quoteProps: 'as-needed', // 对象属性仅在需要时添加引号
  bracketSpacing: true, // 对象大括号内添加空格 { foo: bar } 而不是 {foo: bar}
  bracketSameLine: false, // HTML 标签的 > 换行显示
  arrowParens: 'avoid', // 箭头函数参数始终使用括号，TypeScript 项目中更一致
  endOfLine: 'lf', // 使用 Unix 换行符 (LF)
  trailingComma: 'none', // 不在任何地方添加尾随逗号
  vueIndentScriptAndStyle: false, // Vue 文件中 script 和 style 标签不额外缩进
  singleAttributePerLine: false, // HTML 属性不强制每行一个
  htmlWhitespaceSensitivity: 'css', // HTML 空格敏感度，遵循 CSS 规则
  embeddedLanguageFormatting: 'auto' // 自动格式化嵌入的代码块（如 Vue 模板中的 JS）
};

export default defaultPrettierConfig;
