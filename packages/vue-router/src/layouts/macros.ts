/**
 * 页面元数据接口
 */
export interface PageMeta {
  /** 布局名称或 false 禁用布局 */
  layout?: string | false;
  /** 路由名称 */
  name?: string;
  /** 路由路径 */
  path?: string;
  /** 路由别名 */
  alias?: string | string[];
  /** 重定向配置 */
  redirect?: string | Record<string, any>;
  /** 其他元数据 */
  meta?: Record<string, any>;
  /** 中间件 */
  middleware?: string | string[];
  [key: string]: any;
}

/**
 * 定义页面元数据（编译时宏）
 *
 * @example
 * ```vue
 * <script setup>
 * definePageMeta({
 *   layout: 'admin',
 *   middleware: 'auth'
 * })
 * </script>
 * ```
 *
 * 注意：这个函数在运行时不会被执行，构建工具会在编译时提取参数
 */
export function definePageMeta(_meta: PageMeta): void {
  // 这个函数体在运行时不会被执行
  // 构建工具会在编译时提取参数并注入到组件中
  if (process.env.NODE_ENV === 'development') {
    console.warn('definePageMeta() is a compiler macro and should not be called at runtime.');
  }
}
