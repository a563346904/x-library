# @x-library/vue-router 功能设计与API规范

## 1. 整体架构设计

```
@x-library/vue-router
├── core - 核心功能实现
│   ├── scanner - 文件系统扫描
│   ├── generator - 路由生成逻辑
│   ├── parser - 文件路径解析
│   └── layout - 布局系统
├── rsbuild - RSBuild插件实现
├── vite - Vite插件实现
└── webpack - Webpack插件实现
```

## 2. 自动路由生成功能

### 2.1 核心API设计

```typescript
interface RouteOptions {
  // 页面文件所在目录（相对于项目根目录）
  pagesDir: string;

  // 要排除的文件路径模式
  exclude?: string[];

  // 要包含的文件扩展名
  extensions?: string[];

  // 动态导入路由组件（用于懒加载）
  importMode?: 'sync' | 'async';

  // 路由组件命名规则
  routeNameGenerator?: (filepath: string) => string;

  // 是否启用布局系统
  enableLayouts?: boolean;

  // 布局目录（相对于项目根目录）
  layoutsDir?: string;

  // 默认布局名称
  defaultLayout?: string;

  // 自定义路由元数据处理函数
  extendRoute?: (route: RouteRecord) => RouteRecord | null | undefined | void;

  // 虚拟模块名称前缀
  virtualModulePrefix?: string;
}

interface RouteRecord {
  path: string;
  name?: string;
  component: string | (() => Promise<any>);
  children?: RouteRecord[];
  meta?: Record<string, any>;
  props?: boolean | object | Function;
  redirect?: string | Location | Function;
  alias?: string | string[];
  beforeEnter?: NavigationGuard;
}
```

### 2.2 文件系统路由规则

- **基础路由**：`pages/foo.vue` → `/foo`
- **索引路由**：`pages/index.vue` → `/`，`pages/foo/index.vue` → `/foo`
- **嵌套路由**：`pages/foo/bar.vue` → `/foo/bar`
- **动态路由**：
  - `pages/[id].vue` → `/:id`
  - `pages/user/[id].vue` → `/user/:id`
  - `pages/[...all].vue` → `/:all(.*)`（捕获所有路由）
- **命名索引路由**：`pages/articles/index.vue` → `/articles` + name: 'articles'
- **具有带参数的命名嵌套路由**：`pages/user/[id]/profile.vue` → `/user/:id/profile` + name: 'user-id-profile'

### 2.3 路由名称自动生成规则

路由名称将根据文件路径自动生成，无需手动设置，遵循以下规则：

- **基本转换**：文件路径中的斜杠转换为破折号
- **索引文件**：`pages/index.vue` → name: `index`
- **嵌套路由**：`pages/users/profile.vue` → name: `users-profile`
- **动态参数**：`pages/users/[id].vue` → name: `users-id`
- **嵌套动态路由**：`pages/blog/[slug]/edit.vue` → name: `blog-slug-edit`

### 2.4 虚拟模块导入

用户可以通过导入虚拟模块获取生成的路由配置：

```javascript
// 导入生成的路由
import routes from 'virtual:generated-pages'

// 导入路由类型（TypeScript支持）
import type { RouteRecordRaw } from 'virtual:generated-pages/types'

// 创建路由实例
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
```

提供的虚拟模块包括：

- `virtual:generated-pages` - 导出生成的路由数组
- `virtual:generated-pages/types` - 提供类型定义
- `virtual:generated-pages/client` - 客户端特定的路由处理逻辑
- `virtual:generated-pages/metadata` - 路由元数据（用于调试或扩展）

## 3. 布局系统功能

### 3.1 布局API设计

```typescript
interface LayoutOptions {
  // 布局目录（相对于项目根目录）
  layoutsDir: string;

  // 默认布局文件名
  defaultLayout: string;

  // 处理布局文件命名的方法
  getLayoutName?: (layoutFile: string) => string;

  // 是否在路由meta中添加布局信息
  addLayoutToMeta?: boolean;
}
```

### 3.2 布局使用方式

1. **默认布局**：自动应用于所有页面

2. **指定布局**：通过defineOptions指定特定布局

   ```vue
   <script setup>
   // 指定使用admin布局
   defineOptions({
     meta: {
       layout: 'admin'
     }
   });
   </script>
   ```

3. **无布局**：通过指定layout为false禁用布局
   ```vue
   <script setup>
   // 禁用布局
   defineOptions({
     meta: {
       layout: false
     }
   });
   </script>
   ```

### 3.3 布局系统虚拟模块

提供布局系统相关的虚拟模块：

```javascript
// 导入布局组件
import { setupLayouts } from 'virtual:generated-layouts';
import generatedRoutes from 'virtual:generated-pages';

// 套用布局
const routes = setupLayouts(generatedRoutes);

// 创建路由
const router = createRouter({
  history: createWebHistory(),
  routes
});
```

布局虚拟模块包括：

- `virtual:generated-layouts` - 导出布局处理函数和组件
- `virtual:generated-layouts/types` - 布局相关类型定义

## 4. 构建工具集成API

### 4.1 RSBuild插件

```typescript
import { rsAutoRoutes } from '@x-library/vue-router/rsbuild';

export default {
  plugins: [
    rsAutoRoutes({
      pagesDir: 'src/pages',
      layoutsDir: 'src/layouts',
      defaultLayout: 'default',
      // 虚拟模块前缀，默认为'virtual:'
      virtualModulePrefix: 'virtual:'
    })
  ]
};
```

### 4.2 Vite插件

```typescript
import { viteAutoRoutes } from '@x-library/vue-router/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    viteAutoRoutes({
      pagesDir: 'src/pages',
      layoutsDir: 'src/layouts',
      defaultLayout: 'default'
    })
  ]
});
```

### 4.3 Webpack插件

```typescript
const { webpackAutoRoutes } = require('@x-library/vue-router/webpack');

module.exports = {
  // ... webpack配置
  plugins: [
    new webpackAutoRoutes({
      pagesDir: 'src/pages',
      layoutsDir: 'src/layouts',
      defaultLayout: 'default'
    })
  ]
};
```

## 5. 组件中路由配置方式

路由相关配置通过`defineOptions`在组件中设置，专注于设置布局信息：

```vue
<script setup>
// 只需配置布局信息，路由名称会自动生成
defineOptions({
  meta: {
    layout: 'admin'
    // 可添加其他元数据，但不设置name（会自动生成）
  }
});

// 组件逻辑...
</script>

<template>
  <!-- 组件内容 -->
</template>
```

## 6. 类型定义

提供完整的TypeScript类型支持，确保开发体验良好，包括：

- 所有配置项的类型定义
- 路由生成结果的类型定义
- 布局系统的类型定义
- 各构建工具插件参数的类型定义
- 虚拟模块的类型定义，支持IDE自动补全

## 7. 实现步骤计划

1. 实现核心模块

   - 文件系统扫描功能
   - 路由生成逻辑
   - 路由配置解析
   - 实现 `virtual.ts` - 虚拟模块处理逻辑
   - 布局系统基础功能

2. 实现RSBuild插件

   - 集成核心功能
   - 适配RSBuild构建流程
   - 提供RSBuild特定配置选项
   - 实现虚拟模块系统

3. 实现Vite插件

   - 集成核心功能
   - 适配Vite构建流程
   - 提供Vite特定配置选项
   - 实现虚拟模块系统

4. 实现Webpack插件

   - 集成核心功能
   - 适配Webpack构建流程
   - 提供Webpack特定配置选项
   - 实现虚拟模块系统

5. 测试与优化
   - 在测试项目中验证功能
   - 优化性能与兼容性
   - 完善文档和示例
