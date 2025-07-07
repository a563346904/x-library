# Nuxt 风格布局系统设计文档

## 1. 概述

模仿 Nuxt 3 的布局系统，实现一个在运行时动态应用布局的系统。主要特点：

- 布局通过组件而非路由包装实现
- 支持在页面中使用 `definePageMeta` 指定布局
- 支持动态切换布局
- 布局文件使用 `<slot />` 渲染内容
- 可配置的组件命名空间（默认 `X`）
- **简化设计：只有单一 Layout 组件，降低学习成本**

## 2. 使用方式

### 2.1 布局文件

```vue
<!-- layouts/default.vue -->
<template>
  <div class="default-layout">
    <AppHeader />
    <main>
      <slot />
      <!-- 页面内容将在这里渲染 -->
    </main>
    <AppFooter />
  </div>
</template>
```

```vue
<!-- layouts/admin.vue -->
<template>
  <div class="admin-layout">
    <AdminSidebar />
    <div class="admin-content">
      <AdminHeader />
      <slot />
    </div>
  </div>
</template>
```

### 2.2 在页面中使用布局

```vue
<!-- pages/index.vue -->
<script setup>
// 使用默认布局（不需要特别指定）
</script>

<template>
  <div>
    <h1>Home Page</h1>
  </div>
</template>
```

```vue
<!-- pages/admin/dashboard.vue -->
<script setup>
// 指定使用 admin 布局
definePageMeta({
  layout: 'admin'
});
</script>

<template>
  <div>
    <h1>Admin Dashboard</h1>
  </div>
</template>
```

```vue
<!-- pages/auth/login.vue -->
<script setup>
// 禁用布局
definePageMeta({
  layout: false
});
</script>

<template>
  <div class="login-page">
    <h1>Login</h1>
  </div>
</template>
```

### 2.3 动态切换布局

```vue
<script setup>
import { setPageLayout } from '@x-library/vue-router/layouts';

// 初始使用 default 布局
definePageMeta({
  layout: 'default'
});

// 动态切换到 admin 布局
const switchToAdmin = () => {
  setPageLayout('admin');
};
</script>
```

### 2.4 App.vue 集成（简化版）

```vue
<!-- App.vue -->
<template>
  <Layout>
    <router-view />
  </Layout>
</template>

<script setup>
// 使用配置的命名空间
import { Layout } from '@x-library/vue-router/layouts';
</script>
```

## 3. 核心组件设计（简化版）

### 3.0 配置类型定义

```typescript
// src/core/types.ts
export interface LayoutOptions {
  // 组件命名空间，默认 'X'
  namespace?: string | NamespaceOptions;
  // 其他现有配置...
  layoutsDir?: string;
  defaultLayout?: string;
  enableLayouts?: boolean;
}
```

### 3.1 单一 Layout 组件 (src/layouts/Layout.ts)

```typescript
// src/layouts/Layout.ts
import { defineComponent, h, computed, Component, shallowRef, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { createNamespace, type NamespaceManager } from '@x-library/core';
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
        if (route.meta.layout !== undefined) return route.meta.layout;
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

        // 检查缓存
        if (layoutCache.has(name)) {
          currentLayout.value = layoutCache.get(name)!;
          return;
        }

        // 加载布局组件
        const loader = layouts[name];
        if (loader) {
          try {
            const module = await loader();
            const component = module.default || module;
            layoutCache.set(name, component);
            currentLayout.value = component;
          } catch (error) {
            console.error(`Failed to load layout "${name}":`, error);
            currentLayout.value = null;
          }
        } else {
          console.warn(`Layout "${name}" not found`);
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
        const layoutVNode = h(layout, attrs, content);

        // 支持过渡效果
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
```

### 3.2 definePageMeta 宏 (src/core/macros.ts)

```typescript
// 这是一个编译时宏，在构建时会被转换
export function definePageMeta(meta: PageMeta): void {
  // 这个函数在运行时不会被调用
  // 构建工具会提取它的参数并注入到组件中
}

export interface PageMeta {
  layout?: string | false;
  middleware?: string | string[];
  name?: string;
  path?: string;
  alias?: string | string[];
  redirect?: string | RouteLocationRaw;
  meta?: Record<string, any>;
  [key: string]: any;
}
```

### 3.3 布局 Composable (src/layouts/composables/useLayouts.ts)

```typescript
import { inject, InjectionKey, Ref, Component } from 'vue';
import type { Layout } from '../../core/types';

export interface LayoutContext {
  layouts: Ref<Record<string, Component>>;
  resolveLayout: (name: string) => Component | null;
  setPageLayout: (name: string | false) => void;
}

export const LayoutSymbol: InjectionKey<LayoutContext> = Symbol('layouts');

export function useLayouts(): LayoutContext {
  const context = inject(LayoutSymbol);
  if (!context) {
    throw new Error('useLayouts() must be called within a Layout component');
  }
  return context;
}

export function setPageLayout(name: string | false): void {
  const { setPageLayout } = useLayouts();
  setPageLayout(name);
}
```

### 3.4 组件工厂 (src/layouts/factory.ts)

```typescript
// src/layouts/factory.ts
import { createLayoutComponent } from './Layout';

// 导出工厂函数
export { createLayoutComponent };

// 导出默认组件
export const Layout = createLayoutComponent();
```

### 3.5 构建时转换 (src/core/transform.ts)

```typescript
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';

export function transformDefinePageMeta(code: string, id: string): string {
  const ast = parse(code, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx']
  });

  let pageMeta: any = null;
  let hasDefinePageMeta = false;

  traverse(ast, {
    CallExpression(path) {
      if (t.isIdentifier(path.node.callee) && path.node.callee.name === 'definePageMeta') {
        hasDefinePageMeta = true;
        const arg = path.node.arguments[0];

        if (t.isObjectExpression(arg)) {
          // 提取元数据
          pageMeta = extractObjectExpression(arg);
        }

        // 移除 definePageMeta 调用
        path.remove();
      }
    }
  });

  if (hasDefinePageMeta && pageMeta) {
    // 注入 pageMeta 到组件
    injectPageMeta(ast, pageMeta);
  }

  const output = generate(ast, { preserveLines: true });
  return output.code;
}

function extractObjectExpression(node: t.ObjectExpression): any {
  const obj: any = {};

  node.properties.forEach(prop => {
    if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
      const key = prop.key.name;

      if (t.isStringLiteral(prop.value)) {
        obj[key] = prop.value.value;
      } else if (t.isBooleanLiteral(prop.value)) {
        obj[key] = prop.value.value;
      } else if (t.isObjectExpression(prop.value)) {
        obj[key] = extractObjectExpression(prop.value);
      } else if (t.isArrayExpression(prop.value)) {
        obj[key] = prop.value.elements
          .map(el => {
            if (t.isStringLiteral(el)) return el.value;
            return null;
          })
          .filter(Boolean);
      }
    }
  });

  return obj;
}

function injectPageMeta(ast: any, pageMeta: any): void {
  // 查找默认导出
  let defaultExport: any = null;

  traverse(ast, {
    ExportDefaultDeclaration(path) {
      defaultExport = path;
    }
  });

  if (defaultExport) {
    // 注入 pageMeta 属性
    const metaProperty = t.objectProperty(t.identifier('__pageMeta'), t.valueToNode(pageMeta));

    if (t.isObjectExpression(defaultExport.node.declaration)) {
      defaultExport.node.declaration.properties.push(metaProperty);
    } else {
      // 如果是其他类型的导出，包装成对象
      const wrapped = t.objectExpression([
        t.spreadElement(defaultExport.node.declaration),
        metaProperty
      ]);
      defaultExport.node.declaration = wrapped;
    }
  }
}
```

### 3.6 路由生成器更新 (src/core/generator.ts)

```typescript
// 更新路由生成器以支持 pageMeta
export class RouteGenerator {
  // ... 现有代码

  private async generateRoute(file: string): Promise<RouteRecord> {
    // ... 现有路由生成逻辑

    // 提取 pageMeta
    const pageMeta = await this.extractPageMeta(file);

    if (pageMeta) {
      route.meta = {
        ...route.meta,
        ...pageMeta.meta,
        layout: pageMeta.layout
      };

      // 应用其他 pageMeta 属性
      if (pageMeta.name) route.name = pageMeta.name;
      if (pageMeta.redirect) route.redirect = pageMeta.redirect;
      if (pageMeta.alias) route.alias = pageMeta.alias;
    }

    return route;
  }

  private async extractPageMeta(filepath: string): Promise<any> {
    // 这里可以：
    // 1. 使用 AST 解析提取 definePageMeta
    // 2. 或者在构建时已经转换好，从组件导出中读取
    // 3. 或者使用正则简单提取

    try {
      const content = await readFile(filepath, 'utf-8');
      const definePageMetaRegex = /definePageMeta\s*\(\s*({[\s\S]*?})\s*\)/;
      const match = content.match(definePageMetaRegex);

      if (match) {
        // 简单的对象字面量解析
        const metaString = match[1];
        return new Function(`return ${metaString}`)();
      }
    } catch (error) {
      console.error(`Failed to extract pageMeta from ${filepath}:`, error);
    }

    return null;
  }
}
```

### 3.7 虚拟模块更新 (src/core/virtual.ts)

```typescript
// 生成布局模块
export function generateLayoutsModule(layouts: Layout[]): string {
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

// 生成布局模块入口
export function generateLayoutsEntry(options: LayoutOptions): string {
  const { namespace = 'X' } = options;

  return `// Auto-generated layouts entry
import { createLayoutComponent } from '@x-library/vue-router/layouts/factory'

// 使用配置的命名空间创建组件
export const ${namespace}Layout = createLayoutComponent('Layout')

// 导出默认命名
export const Layout = ${namespace}Layout

// 导出 composables 和工具函数
export { useLayouts, setPageLayout } from '@x-library/vue-router/layouts/composables'
export { definePageMeta } from '@x-library/vue-router/layouts/macros'
`;
}
```

## 4. 插件集成

### 4.1 RSBuild 插件更新（使用 rspack-plugin-virtual-module）

```typescript
import VirtualModulePlugin from 'rspack-plugin-virtual-module';
import { createNamespace } from '@x-library/core';
import { transformDefinePageMeta } from '../core/transform';

export const rsAutoRoutes = (options: RouteOptions = {}): RsbuildPlugin => {
  const namespace = createNamespace(
    typeof options.namespace === 'string' ? { prefix: options.namespace } : options.namespace
  );

  return {
    name: 'rs-auto-routes',

    setup(api) {
      const layoutsModuleId = '~virtual-layouts';
      const routesModuleId = options.virtualModule || '~virtual-routes';

      // 虚拟模块插件实例
      const virtualModules = new VirtualModulePlugin({
        [routesModuleId]: '', // 路由内容
        [layoutsModuleId]: '', // 布局内容
        '@x-library/vue-router/layouts': '', // 布局组件导出
        '~route-options': '' // 路由配置
      });

      api.modifyRspackConfig(config => {
        config.plugins = config.plugins || [];
        config.plugins.push(virtualModules);
        return config;
      });

      // 生成布局虚拟模块内容
      const generateLayoutsModule = (layouts: Layout[]) => {
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
      };

      // 生成布局导出模块
      const generateLayoutsExport = () => {
        const layoutName = namespace.getName('Layout');

        return `// Auto-generated layout component
import { createLayoutComponent, initLayouts } from '@x-library/vue-router/layouts'
import layouts from '${layoutsModuleId}'
import options from '~route-options'

// 初始化布局系统
initLayouts(layouts, options)

// 创建并导出布局组件
export const ${layoutName} = createLayoutComponent('Layout')
export const Layout = ${layoutName}

// 工具函数
export { definePageMeta } from '@x-library/vue-router/layouts'
`;
      };

      api.onBeforeStartDevServer(async () => {
        // 扫描布局文件
        const layouts = await scanLayouts(options);

        // 生成虚拟模块
        virtualModules.writeModule(layoutsModuleId, generateLayoutsModule(layouts));
        virtualModules.writeModule('@x-library/vue-router/layouts', generateLayoutsExport());
        virtualModules.writeModule('~route-options', `export default ${JSON.stringify(options)}`);
      });

      // 监听布局文件变化
      if (options.enableLayouts && options.layoutsDir) {
        const layoutWatcher = chokidar.watch(['**/*.vue'], {
          cwd: options.layoutsDir,
          ignored: options.exclude
        });

        layoutWatcher.on(
          'all',
          debounce(async () => {
            // 重新扫描和生成
            const layouts = await scanLayouts(options);
            virtualModules.writeModule(layoutsModuleId, generateLayoutsModule(layouts));
          }, 300)
        );

        api.onExit(() => {
          layoutWatcher.close();
        });
      }
    }
  };
};
```

## 5. 使用示例

### 5.1 安装和配置

```typescript
// rsbuild.config.ts
import { rsAutoRoutes } from '@x-library/vue-router/rsbuild';

export default {
  plugins: [
    rsAutoRoutes({
      pagesDir: 'src/pages',
      layoutsDir: 'src/layouts',
      enableLayouts: true,
      namespace: 'X' // 可选，默认 'X'
    })
  ]
};
```

### 5.2 创建 App.vue

```vue
<!-- src/App.vue -->
<template>
  <Layout>
    <router-view />
  </Layout>
</template>

<script setup>
import { Layout } from '@x-library/vue-router/layouts';
</script>
```

### 5.3 创建布局

```vue
<!-- src/layouts/default.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow">
      <!-- Navigation -->
    </nav>
    <main class="container mx-auto py-6">
      <slot />
    </main>
  </div>
</template>
```

### 5.4 创建页面

```vue
<!-- src/pages/about.vue -->
<script setup>
import { definePageMeta } from '@x-library/vue-router/layouts';

// 使用默认布局
definePageMeta({
  layout: 'default'
});
</script>

<template>
  <div>
    <h1>About Page</h1>
  </div>
</template>
```

## 6. 高级功能

### 6.1 嵌套布局

```vue
<!-- layouts/admin.vue -->
<template>
  <div class="admin-layout">
    <slot name="sidebar">
      <AdminSidebar />
    </slot>
    <div class="admin-main">
      <slot />
    </div>
  </div>
</template>
```

### 6.2 布局过渡

```vue
<!-- App.vue -->
<template>
  <Layout :transition="{ name: 'fade', mode: 'out-in' }">
    <router-view />
  </Layout>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

### 6.3 条件布局

```vue
<script setup>
import { computed } from 'vue';
import { useAuth } from '@/composables/auth';

const { isAuthenticated } = useAuth();

const layout = computed(() => {
  return isAuthenticated.value ? 'authenticated' : 'guest';
});

definePageMeta({
  layout: layout
});
</script>
```

## 7. TypeScript 支持

```typescript
// types.d.ts
declare module '@x-library/vue-router/layouts' {
  export function definePageMeta(meta: PageMeta): void;
  export function setPageLayout(name: string | false): void;

  export interface PageMeta {
    layout?: string | false;
    [key: string]: any;
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    layout?: string | false;
  }
}
```

## 8. 优势

1. **运行时灵活性**：可以动态切换布局
2. **更好的 DX**：使用 `definePageMeta` 符合 Vue 3 的宏风格
3. **渐进式采用**：不使用布局的页面无需任何改动
4. **类型安全**：完整的 TypeScript 支持
5. **性能优化**：布局组件可以按需加载
6. **可配置命名空间**：避免组件名称冲突
7. **简化设计**：只有单一 Layout 组件，降低学习成本

## 9. 命名空间配置示例

### 9.1 默认配置（使用 X 前缀）

```typescript
// rsbuild.config.ts
export default {
  plugins: [
    rsAutoRoutes({
      // 不指定 namespace，默认使用 'X'
    })
  ]
};
```

```vue
<!-- App.vue -->
<script setup>
// 默认导出不带前缀
import { Layout } from '@x-library/vue-router/layouts';

// 或者使用带前缀的命名导出
import { XLayout } from '@x-library/vue-router/layouts';
</script>
```

### 9.2 自定义命名空间

```typescript
// rsbuild.config.ts
export default {
  plugins: [
    rsAutoRoutes({
      namespace: 'App' // 使用 App 作为前缀
    })
  ]
};
```

```vue
<!-- App.vue -->
<script setup>
// 使用自定义前缀
import { AppLayout } from '@x-library/vue-router/layouts';

// 默认导出始终可用
import { Layout } from '@x-library/vue-router/layouts';
</script>
```

### 9.3 空命名空间

```typescript
// rsbuild.config.ts
export default {
  plugins: [
    rsAutoRoutes({
      namespace: '' // 不使用前缀
    })
  ]
};
```

```vue
<!-- App.vue -->
<script setup>
// 直接使用原始名称
import { Layout } from '@x-library/vue-router/layouts';
</script>
```

这种设计让用户可以：

- 避免与现有组件名称冲突
- 保持代码库的一致性
- 在不同项目中使用不同的命名约定

## 10. 与虚拟路由的整合

布局信息将作为路由 meta 的一部分：

```typescript
// 生成的路由示例
{
  path: '/admin/dashboard',
  name: 'admin-dashboard',
  component: () => import('@/pages/admin/dashboard.vue'),
  meta: {
    layout: 'admin' // 从 definePageMeta 提取
  }
}
```

这样布局系统和路由系统可以无缝配合工作。
