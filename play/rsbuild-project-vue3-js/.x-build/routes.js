// 自动生成的路由文件
// 生成时间: 2025-06-19T09:24:27.257Z
// 警告: 请勿手动修改此文件，它将被自动覆盖

/** @typedef {import('vue-router').RouteRecordRaw} RouteRecordRaw */

import Home from '@/views/home.vue';
import UserId from '@/views/user/:id.vue';
import UserIndex from '@/views/user/index.vue';

/** @type {RouteRecordRaw[]} */
export const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/user',
    name: 'UserIndex',
    component: UserIndex,
    children: [
      {
        path: ':id',
        name: 'UserId',
        component: UserId
      }
    ]
  }
];

export default routes;
