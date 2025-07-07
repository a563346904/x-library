<template>
  <div class="page">
    <h1>404 - 页面未找到</h1>
    <p>当前路径: {{ $route.params.path }}</p>
    <p>这是通配符路由示例，文件名为 [...path].vue</p>
    <router-link to="/">返回首页</router-link>
  </div>
</template>

<style scoped>
.page {
  padding: 40px;
  text-align: center;
}

h1 {
  color: #e74c3c;
}
</style>
