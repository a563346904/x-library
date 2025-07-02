import path from 'path';

import { defineConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';

import { rsAutoRoutes } from '../../packages/vue-router';

// 从我们的包中获取自动路由插件
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src')
    }
  },
  plugins: [
    pluginVue(),
    // 添加我们的自动路由插件
    rsAutoRoutes({
      pagesDir: 'src/pages',
      extensions: ['vue']
    })
  ]
});
