# RSBuild Vue Router 插件

RSBuild 的 Vue Router 自动路由生成插件，提供基于文件系统的路由生成和 Nuxt 风格的布局系统。

## 功能特性

- 🚀 **自动路由生成** - 基于文件系统自动生成 Vue Router 路由配置
- 🎨 **布局系统** - 支持 Nuxt 风格的布局系统，可动态切换布局
- 🔧 **definePageMeta 宏** - 在页面组件中定义元数据
- 🔥 **热更新** - 文件变化时自动更新路由和布局
- 📝 **TypeScript 支持** - 完整的类型定义
- 🎯 **可配置命名空间** - 支持自定义组件前缀

## 安装

```bash
pnpm add @x-library/vue-router
```

## 使用方法

在 `rsbuild.config.mjs` 中配置插件：

```js
import { defineConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';
import { rsAutoRoutes } from '@x-library/vue-router/rsbuild';

export default defineConfig({
  plugins: [
    pluginVue(),
    rsAutoRoutes({
      // 页面目录
      pagesDir: 'src/pages',
      // 布局目录
      layoutsDir: 'src/layouts',
      // 启用布局系统
      enableLayouts: true,
      // 组件命名空间
      namespace: 'X'
    })
  ]
});
```

## 文件约定

### 页面文件

- `index.vue` → `/`
- `about.vue` → `/about`
- `users/index.vue` → `/users`
- `users/[id].vue` → `/users/:id`
- `[...all].vue` → `/*` (catch-all)

### 布局文件

在 `src/layouts` 目录下创建布局文件：

```vue
<!-- src/layouts/default.vue -->
<template>
  <div class="default-layout">
    <header>默认布局</header>
    <main>
      <slot />
    </main>
  </div>
</template>
```

### 使用布局

在页面组件中使用 `definePageMeta` 指定布局：

```vue
<script setup>
definePageMeta({
  layout: 'admin'
});
</script>

<template>
  <div>管理后台页面</div>
</template>
```

在 `App.vue` 中使用布局组件：

```vue
<template>
  <XLayout>
    <router-view />
  </XLayout>
</template>

<script setup>
import { XLayout } from '~virtual-layouts-export';
</script>
```

## 配置选项

| 选项            | 类型               | 默认值                   | 描述             |
| --------------- | ------------------ | ------------------------ | ---------------- |
| `pagesDir`      | `string`           | `'src/pages'`            | 页面文件目录     |
| `layoutsDir`    | `string`           | `'src/layouts'`          | 布局文件目录     |
| `enableLayouts` | `boolean`          | `false`                  | 是否启用布局系统 |
| `namespace`     | `string \| object` | `'X'`                    | 组件命名空间配置 |
| `extensions`    | `string[]`         | `['vue']`                | 支持的文件扩展名 |
| `exclude`       | `string[]`         | `['**/node_modules/**']` | 排除的文件模式   |
| `importMode`    | `string`           | `'async'`                | 路由导入模式     |

## 虚拟模块

插件提供以下虚拟模块：

- `~virtual-routes` - 自动生成的路由配置
- `~virtual-layouts` - 布局文件映射
- `~virtual-layouts-export` - 布局组件和工具函数导出

## API

### 布局相关函数

```js
import { useLayouts, setPageLayout, getCurrentLayout } from '~virtual-layouts-export';

// 获取所有可用布局
const layouts = useLayouts();

// 动态设置页面布局
setPageLayout('admin');

// 获取当前布局名称
const currentLayout = getCurrentLayout();
```

## 注意事项

1. `definePageMeta` 是编译时宏，会在构建时被移除
2. 布局名称 `false` 表示不使用布局
3. 支持嵌套路由和动态路由
4. 文件名以 `_` 开头的会被忽略
