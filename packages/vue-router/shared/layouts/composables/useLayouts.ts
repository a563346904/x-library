import { Component, inject, InjectionKey, ref, Ref } from 'vue';
import { useRoute } from 'vue-router';

export interface LayoutContext {
  layouts: Ref<Record<string, Component>>;
  resolveLayout: (name: string) => Component | null;
  setPageLayout: (name: string | false) => void;
}

export const LayoutSymbol: InjectionKey<LayoutContext> = Symbol('layouts');

// 当前路由的布局状态（用于动态切换）
const currentRouteLayout = ref<string | false | undefined>();

/**
 * 获取布局上下文
 * 注意：在简化设计中，这个函数可能不会被使用
 * 因为 Layout 组件自己管理所有状态
 */
export function useLayouts(): LayoutContext {
  const context = inject(LayoutSymbol);
  if (!context) {
    // 提供一个默认实现
    return {
      layouts: ref({}),
      resolveLayout: () => null,
      setPageLayout: (name: string | false) => {
        currentRouteLayout.value = name;
      }
    };
  }
  return context;
}

/**
 * 动态设置当前页面的布局
 */
export function setPageLayout(name: string | false): void {
  const route = useRoute();
  if (route.meta) {
    route.meta.layout = name;
  }
  currentRouteLayout.value = name;
}

/**
 * 获取当前路由的布局设置
 */
export function getCurrentLayout(): string | false | undefined {
  const route = useRoute();
  // 优先返回动态设置的布局
  if (currentRouteLayout.value !== undefined) {
    return currentRouteLayout.value;
  }
  // 否则返回路由 meta 中的布局
  return route.meta?.layout as string | false | undefined;
}
