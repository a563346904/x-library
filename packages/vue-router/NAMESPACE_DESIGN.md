# 命名空间功能设计文档

## 1. 概述

在 `@x-library/core` 包中实现通用的命名空间功能，供其他包（如 `@x-library/vue-router`）使用。

## 2. @x-library/core 中的实现

### 2.1 命名空间管理器 (src/namespace.ts)

```typescript
// packages/core/src/namespace.ts

export interface NamespaceOptions {
  /** 命名空间前缀，默认 'X' */
  prefix?: string;
  /** 分隔符，默认为空字符串 */
  separator?: string;
  /** 是否将前缀转换为 PascalCase，默认 true */
  pascalCase?: boolean;
}

export class NamespaceManager {
  private prefix: string;
  private separator: string;
  private pascalCase: boolean;

  constructor(options: NamespaceOptions = {}) {
    this.prefix = options.prefix || 'X';
    this.separator = options.separator || '';
    this.pascalCase = options.pascalCase !== false;
  }

  /**
   * 为组件名添加命名空间前缀
   * @example
   * namespace.getName('Layout') // 'XLayout'
   * namespace.getName('LayoutProvider') // 'XLayoutProvider'
   */
  getName(baseName: string): string {
    if (!this.prefix) {
      return baseName;
    }

    const prefix = this.pascalCase ? this.toPascalCase(this.prefix) : this.prefix;
    return `${prefix}${this.separator}${baseName}`;
  }

  /**
   * 创建一个组件工厂，自动应用命名空间
   */
  createComponentFactory<T extends { name?: string }>(
    createComponent: (name: string) => T,
    baseName: string
  ): T {
    const namespacedName = this.getName(baseName);
    return createComponent(namespacedName);
  }

  /**
   * 批量生成带命名空间的组件名映射
   */
  createNameMap<K extends string>(baseNames: K[]): Record<K, string> {
    const map = {} as Record<K, string>;
    baseNames.forEach(baseName => {
      map[baseName] = this.getName(baseName);
    });
    return map;
  }

  /**
   * 获取当前配置
   */
  getConfig(): Required<NamespaceOptions> {
    return {
      prefix: this.prefix,
      separator: this.separator,
      pascalCase: this.pascalCase
    };
  }

  private toPascalCase(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
}

/**
 * 创建命名空间管理器的工厂函数
 */
export function createNamespace(options?: NamespaceOptions): NamespaceManager {
  return new NamespaceManager(options);
}

/**
 * 默认命名空间实例
 */
export const defaultNamespace = createNamespace();
```

### 2.2 导出更新 (src/index.ts)

```typescript
// packages/core/src/index.ts
export * from './namespace';

// ... 现有导出
```

### 2.3 单元测试 (src/**tests**/namespace.test.ts)

```typescript
// packages/core/src/__tests__/namespace.test.ts
import { createNamespace, NamespaceManager } from '../namespace';

describe('NamespaceManager', () => {
  it('should use default prefix "X"', () => {
    const ns = createNamespace();
    expect(ns.getName('Layout')).toBe('XLayout');
  });

  it('should handle custom prefix', () => {
    const ns = createNamespace({ prefix: 'App' });
    expect(ns.getName('Layout')).toBe('AppLayout');
  });

  it('should handle empty prefix', () => {
    const ns = createNamespace({ prefix: '' });
    expect(ns.getName('Layout')).toBe('Layout');
  });

  it('should handle separator', () => {
    const ns = createNamespace({ prefix: 'X', separator: '-' });
    expect(ns.getName('Layout')).toBe('X-Layout');
  });

  it('should handle pascalCase option', () => {
    const ns = createNamespace({ prefix: 'app', pascalCase: true });
    expect(ns.getName('Layout')).toBe('AppLayout');

    const ns2 = createNamespace({ prefix: 'app', pascalCase: false });
    expect(ns2.getName('Layout')).toBe('appLayout');
  });

  it('should create name map correctly', () => {
    const ns = createNamespace({ prefix: 'My' });
    const map = ns.createNameMap(['Layout', 'LayoutProvider']);
    expect(map).toEqual({
      Layout: 'MyLayout',
      LayoutProvider: 'MyLayoutProvider'
    });
  });
});
```

## 3. @x-library/vue-router 中的使用

### 3.1 更新类型定义 (src/core/types.ts)

```typescript
// packages/vue-router/src/core/types.ts
import type { NamespaceOptions } from '@x-library/core';

export interface RouteOptions {
  // ... 现有选项

  /** 组件命名空间配置 */
  namespace?: string | NamespaceOptions;
}
```

### 3.2 布局组件工厂 (src/layouts/factory.ts)

```typescript
// packages/vue-router/src/layouts/factory.ts
import { defineComponent, h, computed } from 'vue';
import { useRoute } from 'vue-router';
import { createNamespace, type NamespaceManager } from '@x-library/core';
import { useLayouts } from './composables/useLayouts';

let namespaceManager: NamespaceManager;

/**
 * 初始化命名空间管理器
 */
export function initNamespace(options?: string | NamespaceOptions): void {
  if (typeof options === 'string') {
    namespaceManager = createNamespace({ prefix: options });
  } else {
    namespaceManager = createNamespace(options);
  }
}

/**
 * 创建布局组件
 */
export function createLayoutComponent(baseName = 'Layout') {
  const name = namespaceManager?.getName(baseName) || baseName;

  return defineComponent({
    name,
    inheritAttrs: false,
    props: {
      name: {
        type: String,
        default: null
      },
      fallback: {
        type: String,
        default: 'default'
      },
      transition: {
        type: [Boolean, Object],
        default: false
      }
    },
    setup(props, { slots, attrs }) {
      const route = useRoute();
      const { layouts, resolveLayout } = useLayouts();

      const layoutName = computed(() => {
        if (props.name) return props.name;
        if (route.meta.layout !== undefined) return route.meta.layout;
        return props.fallback;
      });

      const LayoutComponent = computed(() => {
        const name = layoutName.value;
        if (name === false || !name) return null;
        return resolveLayout(name);
      });

      return () => {
        const layout = LayoutComponent.value;
        const content = slots.default?.();

        if (!layout) {
          return content;
        }

        const layoutVNode = h(layout, attrs, content);

        if (props.transition) {
          const transitionProps =
            typeof props.transition === 'object'
              ? props.transition
              : { name: 'layout', mode: 'out-in' };

          return h(Transition, transitionProps, () => layoutVNode);
        }

        return layoutVNode;
      };
    }
  });
}

/**
 * 创建布局提供者组件
 */
export function createLayoutProvider(baseName = 'LayoutProvider') {
  const name = namespaceManager?.getName(baseName) || baseName;

  return defineComponent({
    name,
    setup(_, { slots }) {
      // ... 实现逻辑
      return () => slots.default?.();
    }
  });
}
```

### 3.3 虚拟模块生成器更新 (src/core/virtual.ts)

```typescript
// packages/vue-router/src/core/virtual.ts
import { createNamespace } from '@x-library/core';
import type { RouteOptions } from './types';

export function generateLayoutsEntry(options: RouteOptions): string {
  const namespace = createNamespace(
    typeof options.namespace === 'string' ? { prefix: options.namespace } : options.namespace
  );

  const layoutName = namespace.getName('Layout');
  const providerName = namespace.getName('LayoutProvider');

  return `// Auto-generated layouts entry
import { initNamespace, createLayoutComponent, createLayoutProvider } from '@x-library/vue-router/layouts/factory'

// 初始化命名空间
initNamespace(${JSON.stringify(options.namespace || 'X')})

// 创建带命名空间的组件
export const ${layoutName} = createLayoutComponent('Layout')
export const ${providerName} = createLayoutProvider('LayoutProvider')

// 导出默认命名（不带前缀）
export const Layout = ${layoutName}
export const LayoutProvider = ${providerName}

// 导出 composables 和工具函数
export { useLayouts, setPageLayout } from '@x-library/vue-router/layouts/composables'
export { definePageMeta } from '@x-library/vue-router/layouts/macros'
`;
}
```

### 3.4 RSBuild 插件更新

```typescript
// packages/vue-router/src/rsbuild/plugin.ts
export const rsAutoRoutes = (options: RouteOptions = {}): RsbuildPlugin => {
  // 设置默认命名空间
  const finalOptions = {
    namespace: 'X',
    ...options
  };

  return {
    name: 'rs-auto-routes',
    setup(api) {
      // ... 现有逻辑

      api.resolveVirtualModule('@x-library/vue-router/layouts', () => {
        return generateLayoutsEntry(finalOptions);
      });
    }
  };
};
```

### 3.5 package.json 更新

```json
{
  "name": "@x-library/vue-router",
  "dependencies": {
    "@x-library/core": "workspace:*"
  }
}
```

## 4. 使用示例

### 4.1 基本使用

```typescript
// rsbuild.config.ts
import { rsAutoRoutes } from '@x-library/vue-router/rsbuild';

export default {
  plugins: [
    rsAutoRoutes({
      // 使用默认命名空间 'X'
      pagesDir: 'src/pages',
      layoutsDir: 'src/layouts'
    })
  ]
};
```

### 4.2 自定义命名空间

```typescript
// 简单字符串配置
rsAutoRoutes({
  namespace: 'App' // AppLayout, AppLayoutProvider
});

// 高级配置
rsAutoRoutes({
  namespace: {
    prefix: 'My',
    separator: '-', // My-Layout, My-LayoutProvider
    pascalCase: true
  }
});
```

### 4.3 在组件中使用

```vue
<!-- App.vue -->
<script setup>
// 使用带命名空间的组件
import { XLayout, XLayoutProvider } from '@x-library/vue-router/layouts';

// 或使用默认导出
import { Layout, LayoutProvider } from '@x-library/vue-router/layouts';
</script>

<template>
  <LayoutProvider>
    <Layout>
      <router-view />
    </Layout>
  </LayoutProvider>
</template>
```

## 5. 优势

1. **复用性**：命名空间功能在 core 包中，可被所有包使用
2. **灵活性**：支持字符串和对象两种配置方式
3. **一致性**：确保整个库的命名规范统一
4. **可扩展**：未来可以添加更多命名空间相关功能
5. **类型安全**：完整的 TypeScript 支持
