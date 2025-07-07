<template>
  <div class="page">
    <h1>博客文章</h1>
    <p>年份: {{ $route.params.year }}</p>
    <p>标题: {{ $route.params.slug }}</p>
    <p>多级动态路由示例</p>
    <router-link to="/">返回首页</router-link>
  </div>
</template>

<style scoped>
.page {
  padding: 40px;
}
</style>
