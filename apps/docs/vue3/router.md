# @x-library/vue-router

自动化路由生成和 Nuxt 风格布局系统插件，支持 RSBuild、Vite 和 Webpack。

## 功能特性

- 🚀 **文件系统路由** - 基于文件结构自动生成路由
- 📦 **Nuxt 风格布局** - 灵活的布局系统，支持动态切换
- 🔧 **多构建工具支持** - RSBuild、Vite、Webpack
- 🎯 **TypeScript 支持** - 完整的类型定义
- 🔥 **热更新** - 文件变化自动更新路由
- 🎨 **可配置命名空间** - 避免组件名称冲突

## 快速开始

### 安装

```bash
pnpm add @x-library/vue-router
```

### RSBuild 配置

```typescript
// rsbuild.config.ts
import { defineConfig } from '@rsbuild/core';
import { rsAutoRoutes } from '@x-library/vue-router/rsbuild';

export default defineConfig({
  plugins: [
    rsAutoRoutes({
      pagesDir: 'src/pages',
      layoutsDir: 'src/layouts',
      enableLayouts: true,
      namespace: 'X' // 可选，默认 'X'
    })
  ]
});
```

### 基础使用

#### 1. 配置 App.vue

```vue
<!-- src/App.vue -->
<template>
  <XLayout>
    <router-view />
  </XLayout>
</template>

<script setup>
import { XLayout } from '@x-library/vue-router/layouts';
</script>
```

#### 2. 创建布局文件

```vue
<!-- src/layouts/default.vue -->
<template>
  <div class="default-layout">
    <AppHeader />
    <main>
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
```

```vue
<!-- src/layouts/admin.vue -->
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

#### 3. 创建页面文件

```vue
<!-- src/pages/index.vue -->
<template>
  <div>
    <h1>首页</h1>
  </div>
</template>
```

```vue
<!-- src/pages/admin/dashboard.vue -->
<script setup>
// 使用 admin 布局
definePageMeta({
  layout: 'admin'
});
</script>

<template>
  <div>
    <h1>管理面板</h1>
  </div>
</template>
```

## 路由生成规则

### 基础路由

- `src/pages/index.vue` → `/`
- `src/pages/about.vue` → `/about`
- `src/pages/contact.vue` → `/contact`

### 嵌套路由

- `src/pages/user/index.vue` → `/user`
- `src/pages/user/profile.vue` → `/user/profile`
- `src/pages/user/settings.vue` → `/user/settings`

### 动态路由

- `src/pages/blog/[id].vue` → `/blog/:id`
- `src/pages/user/[username]/posts.vue` → `/user/:username/posts`

### 捕获所有路由

- `src/pages/[...path].vue` → `/:path(.*)*`

## 布局系统

### definePageMeta

在页面组件中使用 `definePageMeta` 宏来配置页面元数据：

```vue
<script setup>
definePageMeta({
  layout: 'admin', // 使用的布局
  name: 'user-profile' // 路由名称
});
</script>
```

### 动态切换布局

```vue
<script setup>
import { setPageLayout } from '@x-library/vue-router/layouts';

// 动态切换到 admin 布局
const switchToAdmin = () => {
  setPageLayout('admin');
};

// 禁用布局
const disableLayout = () => {
  setPageLayout(false);
};
</script>
```

### 布局过渡效果

```vue
<!-- App.vue -->
<template>
  <XLayout :transition="{ name: 'fade', mode: 'out-in' }">
    <router-view />
  </XLayout>
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

## 配置选项

```typescript
interface RouteOptions {
  // 页面目录
  pagesDir?: string;
  // 布局目录
  layoutsDir?: string;
  // 启用布局系统
  enableLayouts?: boolean;
  // 默认布局
  defaultLayout?: string;
  // 虚拟模块标识
  virtualModule?: string;
  // 排除的文件
  exclude?: string[];
  // 组件命名空间
  namespace?: string | NamespaceOptions;
}

interface NamespaceOptions {
  // 前缀
  prefix?: string;
  // 分隔符
  separator?: string;
  // 是否使用 PascalCase
  pascalCase?: boolean;
}
```

### 命名空间配置示例

#### 默认配置（X 前缀）

```typescript
rsAutoRoutes({
  // 不指定 namespace，默认使用 'X'
});
```

```vue
<script setup>
import { XLayout } from '@x-library/vue-router/layouts';
// 或使用默认导出
import { Layout } from '@x-library/vue-router/layouts';
</script>
```

#### 自定义前缀

```typescript
rsAutoRoutes({
  namespace: 'App'
});
```

```vue
<script setup>
import { AppLayout } from '@x-library/vue-router/layouts';
</script>
```

#### 自定义分隔符

```typescript
rsAutoRoutes({
  namespace: {
    prefix: 'My',
    separator: '-'
  }
});
```

```vue
<script setup>
import { MyLayout } from '@x-library/vue-router/layouts';
// 组件名实际为 My-Layout
</script>
```

## 高级用法

### 条件布局

```vue
<script setup>
import { computed } from 'vue';
import { useAuth } from '@/composables/auth';
import { definePageMeta } from '@x-library/vue-router/layouts';

const { isAuthenticated } = useAuth();

// 根据认证状态使用不同布局
definePageMeta({
  layout: computed(() => (isAuthenticated.value ? 'authenticated' : 'guest'))
});
</script>
```

### 嵌套布局

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

### 手动指定布局

```vue
<!-- App.vue -->
<template>
  <XLayout :name="customLayout">
    <router-view />
  </XLayout>
</template>

<script setup>
import { ref } from 'vue';
const customLayout = ref('default');
</script>
```

## TypeScript 支持

```typescript
// 添加类型声明
declare module '@x-library/vue-router/layouts' {
  export function definePageMeta(meta: PageMeta): void;
  export function setPageLayout(name: string | false): void;

  export interface PageMeta {
    layout?: string | false;
    name?: string;
    path?: string;
    alias?: string | string[];
    redirect?: string | RouteLocationRaw;
    meta?: Record<string, any>;
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    layout?: string | false;
  }
}
```

## API 参考

### 组件

- `Layout` / `XLayout` - 布局容器组件

### Composables

- `useLayouts()` - 获取布局上下文
- `setPageLayout(name)` - 动态设置页面布局
- `getCurrentLayout()` - 获取当前布局名称

### 宏

- `definePageMeta(meta)` - 定义页面元数据（编译时宏）

## 常见问题

### 如何禁用某个页面的布局？

```vue
<script setup>
definePageMeta({
  layout: false
});
</script>
```

### 如何在路由导航守卫中访问布局信息？

```typescript
router.beforeEach((to, from, next) => {
  const layout = to.meta.layout;
  // 基于布局进行逻辑处理
  next();
});
```

### 如何预加载布局组件？

布局组件默认是懒加载的。如需预加载，可以在入口文件中导入：

```typescript
// main.ts
import '@/layouts/default.vue';
import '@/layouts/admin.vue';
```
