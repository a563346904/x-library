<template>
  <div class="page">
    <h2>用户详情</h2>
    <p>用户 ID: {{ $route.params.id }}</p>
    <p>这是动态路由示例，文件名为 [id].vue</p>
    <router-link to="/users">返回用户列表</router-link>
  </div>
</template>

<style scoped>
.page {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  margin-top: 20px;
}
</style>
