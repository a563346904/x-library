/**
 * definePageMeta 宏转换插件
 *
 * 在编译时移除 definePageMeta 调用，避免运行时错误
 * definePageMeta 的元数据已经在路由生成阶段被提取
 */

import { createUnplugin } from 'unplugin';

/**
 * Unplugin to transform definePageMeta macro
 * Removes definePageMeta calls from the code at compile time
 *
 * @example
 * 输入:
 * ```vue
 * <script setup>
 * definePageMeta({
 *   layout: 'admin'
 * });
 * </script>
 * ```
 *
 * 输出:
 * ```vue
 * <script setup>
 * // definePageMeta removed by compiler
 * </script>
 * ```
 */
export const unpluginDefinePageMeta = createUnplugin(() => {
  return {
    name: 'unplugin-define-page-meta',
    enforce: 'pre',

    // 只处理 .vue 文件
    transformInclude(id) {
      return id.endsWith('.vue');
    },

    transform(code) {
      // Check if code contains definePageMeta
      if (!code.includes('definePageMeta')) {
        return null;
      }

      // Remove definePageMeta calls
      // 使用更健壮的正则表达式，支持多行和嵌套对象
      // [\s\S]*? 匹配任意字符（包括换行），非贪婪模式
      const transformed = code.replace(
        /definePageMeta\s*\(\s*\{[\s\S]*?\}\s*\)\s*;?/g,
        '/* definePageMeta removed by compiler */'
      );

      return {
        code: transformed,
        map: null
      };
    }
  };
});
