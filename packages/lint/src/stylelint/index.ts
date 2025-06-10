import type { Config } from 'stylelint';

import { deepMerge } from '../utils/config-merge';

/**
 * 默认的 Stylelint 配置
 * 基于项目最佳实践的 CSS/SCSS 代码规范配置
 */
const defaultStylelintConfig: Config = {
  // 继承自 stylelint-config-standard 以便启用默认的推荐规则
  extends: ['stylelint-config-standard', 'stylelint-config-rational-order'],

  // 添加插件支持
  plugins: ['stylelint-scss', '@stylistic/stylelint-plugin'],

  // 针对不同文件类型的特殊配置
  overrides: [
    {
      files: ['**/*.scss', '**/*.sass'],
      customSyntax: 'postcss-scss',
      rules: {
        // 对于 SCSS 文件，使用 SCSS 专用的 at-rule 检查
        'at-rule-no-unknown': null,
        'scss/at-rule-no-unknown': true,
        // 允许 SCSS 函数如 darken(), lighten() 等
        'declaration-property-value-no-unknown': null
      }
    },
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
      rules: {
        // Vue 文件特殊规则
        'at-rule-no-unknown': null,
        'scss/at-rule-no-unknown': true
      }
    }
  ],

  // 自定义的规则
  rules: {
    // 禁止空的 CSS 块，确保样式文件不包含冗余代码
    'block-no-empty': true,
    // 禁止无效的十六进制颜色值
    'color-no-invalid-hex': true,
    // 防止声明重复的 CSS 属性
    'declaration-block-no-duplicate-properties': true,
    // 禁止重复的字体名称，以避免混淆
    'font-family-no-duplicate-names': true,
    // 禁止使用未知的属性，确保所有属性都是标准的
    'property-no-unknown': true,
    // 禁止使用未知的单位
    'unit-no-unknown': true,

    // 样式相关规则（使用 @stylistic 插件）
    // 限制每行最大字符数为 80，忽略 @import 语句
    '@stylistic/max-line-length': [80, { ignorePattern: '^@import' }],
    // 强制使用单引号，统一字符串引号风格
    '@stylistic/string-quotes': 'single',
    // 强制使用 2 个空格缩进，确保缩进一致性
    '@stylistic/indentation': 2,

    // SCSS 特有规则
    // 强制 SCSS 混合宏（Mixin）名称为小写并使用破折号分隔
    'scss/at-mixin-pattern': '^[_a-z0-9-]+$',
    // 禁止使用 SCSS 不支持的 @at-rule
    'scss/at-rule-no-unknown': true,

    // 强制 BEM 风格命名类名
    'selector-class-pattern': '^([a-z0-9]+-)*[a-z0-9]+$',

    // 禁止 URL 使用相对方案，确保所有 URL 具有明确的方案
    'function-url-no-scheme-relative': true,
    // 禁止选择器同时使用元素类型和类名，如 div.button
    'selector-no-qualifying-type': true,
    // 禁止使用带供应商前缀的值，推崇标准的 CSS 属性值
    'value-no-vendor-prefix': true
  }
};

/**
 * 创建 Stylelint 配置的函数
 * @param customConfig 自定义配置，会与默认配置进行深度合并
 * @returns 合并后的 Stylelint 配置
 */
export function createStylelintConfig(customConfig: Partial<Config> = {}): Config {
  return deepMerge(
    defaultStylelintConfig as Record<string, unknown>,
    customConfig as Record<string, unknown>
  ) as Config;
}

/**
 * 默认的 Stylelint 配置对象（向后兼容）
 */
export const stylelintConfig: Config = defaultStylelintConfig;

// 默认导出函数形式
export default createStylelintConfig;

// 导出类型
export type { Config as StylelintConfig } from 'stylelint';
