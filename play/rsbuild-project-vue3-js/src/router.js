import { createRouter, createWebHistory } from 'vue-router';

import routes from '~virtual-routes';

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 添加根路径重定向
    {
      path: '/',
      redirect: '/home'
    },
    ...routes
  ]
});

export default router;
