<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <h2>管理后台</h2>
      <nav>
        <router-link to="/admin">仪表盘</router-link>
        <router-link to="/user">用户管理</router-link>
        <router-link to="/">返回首页</router-link>
      </nav>
    </aside>
    <div class="content">
      <header class="admin-header">
        <h3>管理控制台</h3>
        <span>管理员</span>
      </header>
      <main class="admin-main">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  padding: 1rem;
  color: white;
  background: #2c3e50;
}

.sidebar h2 {
  margin: 0 0 2rem;
  font-size: 1.2rem;
}

.sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar nav a {
  padding: 0.75rem 1rem;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.3s;
}

.sidebar nav a:hover {
  background: rgb(255 255 255 / 10%);
}

.content {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: white;
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
}

.admin-main {
  flex: 1;
  padding: 2rem;
  background: #f8f9fa;
}
</style>
