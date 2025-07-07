import { createNamespace, type NamespaceManager } from '@x-library/core';
import {
  Component,
  computed,
  defineComponent,
  h,
  shallowRef,
  Transition,
  TransitionProps,
  watchEffect
} from 'vue';
import { useRoute } from 'vue-router';

import type { RouteOptions } from '../types';

// 布局组件缓存
const layoutCache = new Map<string, Component>();

// 导入所有布局（由构建工具生成）
let layouts: Record<string, () => Promise<{ default: Component }>> = {};

// 命名空间管理器
let namespaceManager: NamespaceManager;

/**
 * 初始化布局系统
 */
export function initLayouts(
  layoutModules: Record<string, () => Promise<{ default: Component }>>,
  options?: RouteOptions
) {
  layouts = layoutModules;
  namespaceManager = createNamespace(
    typeof options?.namespace === 'string' ? { prefix: options.namespace } : options?.namespace
  );
}

/**
 * 加载布局组件
 */
async function loadLayoutComponent(layoutNameStr: string, currentLayout: any) {
  if (layoutCache.has(layoutNameStr)) {
    currentLayout.value = layoutCache.get(layoutNameStr)!;
    return;
  }

  const loader = layouts[layoutNameStr];
  if (loader) {
    try {
      const module = await loader();
      const component = module.default || module;
      layoutCache.set(layoutNameStr, component);
      currentLayout.value = component;
    } catch (error) {
      console.error(`Failed to load layout "${layoutNameStr}":`, error);
      currentLayout.value = null;
    }
  } else {
    console.warn(`Layout "${layoutNameStr}" not found`);
    currentLayout.value = null;
  }
}

/**
 * 渲染布局内容
 */
function renderLayoutContent(layout: Component | null, content: any, attrs: any, transition: any) {
  if (!layout) {
    return content;
  }

  const layoutVNode = h(layout, attrs, { default: () => content });

  if (transition) {
    const transitionProps =
      typeof transition === 'object' ? transition : { name: 'layout', mode: 'out-in' };
    return h(Transition, transitionProps as TransitionProps, () => layoutVNode);
  }

  return layoutVNode;
}

/**
 * 创建 Layout 组件
 */
export function createLayoutComponent(baseName = 'Layout') {
  const name = namespaceManager?.getName(baseName) || baseName;

  return defineComponent({
    name,
    inheritAttrs: false,
    props: {
      name: { type: String, default: null },
      fallback: { type: String, default: 'default' },
      transition: { type: [Boolean, Object], default: false }
    },
    setup(props, { slots, attrs }) {
      const route = useRoute();
      const currentLayout = shallowRef<Component | null>(null);

      const layoutName = computed(() => {
        if (props.name) return props.name;
        if (route.meta.layout !== undefined) {
          console.log(`[Layout] Route ${route.path} using layout:`, route.meta.layout);
          return route.meta.layout;
        }
        return props.fallback;
      });

      watchEffect(async () => {
        const name = layoutName.value;

        if (name === false || !name) {
          currentLayout.value = null;
          return;
        }

        await loadLayoutComponent(name as string, currentLayout);
      });

      return () => {
        const layout = currentLayout.value;
        const content = slots.default?.();
        return renderLayoutContent(layout, content, attrs, props.transition);
      };
    }
  });
}
