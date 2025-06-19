import { defineConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';
import { rsAutoRoute } from '@x-library/vue/router';

console.log(rsAutoRoute);

// 从我们的包中获取自动路由插件
export default defineConfig({
  plugins: [
    pluginVue(),
    // 添加我们的自动路由插件
    rsAutoRoute()
  ]
});
