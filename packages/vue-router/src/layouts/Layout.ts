import { createNamespace, type NamespaceManager } from '@x-library/core';
import { Component, computed, defineComponent, h, shallowRef, Transition, watchEffect } from 'vue';
import { useRoute } from 'vue-router';

import type { RouteOptions } from '../types';

// 布局组件缓存
const layoutCache = new Map<string, Component>();

// 导入所有布局（由构建工具生成）
let layouts: Record<string, () => Promise<any>> = {};

// 命名空间管理器
let namespaceManager: NamespaceManager;

/**
 * 初始化布局系统
 */
export function initLayouts(
  layoutModules: Record<string, () => Promise<any>>,
  options?: RouteOptions
) {
  layouts = layoutModules;
  namespaceManager = createNamespace(
    typeof options?.namespace === 'string' ? { prefix: options.namespace } : options?.namespace
  );
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
      // 允许手动指定布局
      name: {
        type: String,
        default: null
      },
      // 默认布局
      fallback: {
        type: String,
        default: 'default'
      },
      // 过渡效果配置
      transition: {
        type: [Boolean, Object],
        default: false
      }
    },
    setup(props, { slots, attrs }) {
      const route = useRoute();
      const currentLayout = shallowRef<Component | null>(null);

      // 计算当前应该使用的布局名称
      const layoutName = computed(() => {
        // 优先级：props.name > route.meta.layout > fallback
        if (props.name) return props.name;
        if (route.meta.layout !== undefined) {
          console.log(`[Layout] Route ${route.path} using layout:`, route.meta.layout);
          return route.meta.layout;
        }
        return props.fallback;
      });

      // 监听布局变化并加载对应的布局组件
      watchEffect(async () => {
        const name = layoutName.value;

        // 如果明确设置为 false，不使用布局
        if (name === false || !name) {
          currentLayout.value = null;
          return;
        }

        // 确保 name 是字符串类型
        const layoutNameStr = name as string;

        // 检查缓存
        if (layoutCache.has(layoutNameStr)) {
          currentLayout.value = layoutCache.get(layoutNameStr)!;
          return;
        }

        // 加载布局组件
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
      });

      return () => {
        const layout = currentLayout.value;
        const content = slots.default?.();

        if (!layout) {
          // 无布局，直接渲染内容
          return content;
        }

        // 渲染布局组件
        const layoutVNode = h(layout, attrs, {
          default: () => content
        });

        // 支持过渡效果
        if (props.transition) {
          const transitionProps =
            typeof props.transition === 'object'
              ? props.transition
              : { name: 'layout', mode: 'out-in' };

          return h(Transition, transitionProps as any, () => layoutVNode);
        }

        return layoutVNode;
      };
    }
  });
}
