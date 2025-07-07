<template>
  <div class="page">
    <h1>用户列表</h1>
    <p>嵌套路由示例</p>

    <nav>
      <router-link to="/users/123" class="nav-link">用户 123</router-link>
      <router-link to="/users/456">用户 456</router-link>
    </nav>

    <router-view />
  </div>
</template>

<style scoped>
.page {
  padding: 40px;
}

.nav-link {
  margin-right: 20px;
}
</style>
