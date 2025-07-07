<template>
  <div class="user-page">
    <h1>用户管理</h1>
    <p>这是用户管理页面，使用默认布局</p>
    <div class="user-list">
      <router-link to="/user/1" class="user-item">用户 1</router-link>
      <router-link to="/user/2" class="user-item">用户 2</router-link>
      <router-link to="/user/3" class="user-item">用户 3</router-link>
    </div>
    <router-view />
  </div>
</template>

<style scoped>
.user-page {
  max-width: 800px;
  margin: 0 auto;
}

.user-list {
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
}

.user-item {
  padding: 0.5rem 1rem;
  background: #42b883;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.user-item:hover {
  background: #35a372;
}
</style>
