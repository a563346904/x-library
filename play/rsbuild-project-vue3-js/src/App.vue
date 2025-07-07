<template>
  <h1>首页</h1>
  <nav>
    <h2>路由功能演示</h2>
    <ul>
      <li><router-link to="/about">基础路由 - 关于页面</router-link></li>
      <li><router-link to="/users">用户列表（嵌套路由）</router-link></li>
      <li><router-link to="/users/123">用户详情（动态路由）</router-link></li>
      <li><router-link to="/posts/2024/hello-world">文章（多级动态路由）</router-link></li>
      <li><router-link to="/any/random/path">404 页面（通配符路由）</router-link></li>
    </ul>
  </nav>
  <Layout>
    <router-view />
  </Layout>
</template>

<script setup>
import { Layout } from '~virtual-layouts-export';
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#root {
  color: blue;
}
</style>
