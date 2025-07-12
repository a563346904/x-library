/**
 * 布局相关模块生成器
 * 负责生成布局系统的虚拟模块内容
 */

import { createNamespace } from '@x-library/core';

import type { RouteOptions } from '../types';

/**
 * 生成布局模块内容
 * 将布局文件映射转换为 ES 模块格式
 *
 * @param layouts 布局文件信息数组
 * @returns 生成的模块代码字符串
 *
 * @example
 * 输入: [{ name: 'default', component: '@/layouts/default.vue' }]
 * 输出:
 * ```js
 * const layout0 = () => import('@/layouts/default.vue')
 * export default {
 *   'default': layout0
 * }
 * ```
 */
export function generateLayoutsModule(layouts: Array<{ name: string; component: string }>): string {
  const imports: string[] = [];
  const exports: string[] = [];

  layouts.forEach((layout, index) => {
    imports.push(`const layout${index} = () => import('${layout.component}')`);
    exports.push(`  '${layout.name}': layout${index}`);
  });

  return `// Auto-generated layouts
${imports.join('\n')}

export default {
${exports.join(',\n')}
}
`;
}

/**
 * 生成布局导出模块
 * 创建包含 Layout 组件和工具函数的导出模块
 *
 * @param options 路由配置选项
 * @returns 生成的模块代码字符串
 */
export function generateLayoutsExport(options: RouteOptions): string {
  const namespace = createNamespace(
    typeof options.namespace === 'string' ? { prefix: options.namespace } : options.namespace
  );

  const layoutName = namespace.getName('Layout');

  // 使用相对路径导入，让构建工具自动解析
  // 在虚拟模块中使用包名导入会更可靠
  return `// Auto-generated layout component
import { createLayoutComponent, initLayouts, useLayouts, setPageLayout, getCurrentLayout } from '@x-library/vue-router-shared/layouts'
import layouts from '~virtual-layouts'

// 初始化布局系统
const options = ${JSON.stringify({ namespace: options.namespace })};
initLayouts(layouts, options);

// 创建并导出布局组件
export const ${layoutName} = createLayoutComponent('Layout');
export const Layout = ${layoutName};

// 重新导出工具函数
export { useLayouts, setPageLayout, getCurrentLayout };

// definePageMeta is a compile-time macro, not a runtime export
export function definePageMeta() {
  throw new Error('definePageMeta is a compile-time macro and should not be called at runtime');
}
`;
}
