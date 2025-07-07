<template>
  <div class="default-layout">
    <header class="header">
      <h1>X-Library Vue Router Demo</h1>
      <nav>
        <router-link to="/">首页</router-link>
        <router-link to="/card">卡片</router-link>
        <router-link to="/user">用户</router-link>
        <router-link to="/admin">管理后台</router-link>
      </nav>
    </header>
    <main class="main">
      <slot />
    </main>
    <footer class="footer">
      <p>© 2024 X-Library - 默认布局</p>
    </footer>
  </div>
</template>

<style scoped>
.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  padding: 1rem;
  color: white;
  background: #42b883;
}

.header h1 {
  margin: 0 0 1rem;
}

.header nav {
  display: flex;
  gap: 1rem;
}

.header nav a {
  padding: 0.5rem 1rem;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.3s;
}

.header nav a:hover,
.header nav a.router-link-active {
  background: rgb(255 255 255 / 20%);
}

.main {
  flex: 1;
  padding: 2rem;
  background: #f5f5f5;
}

.footer {
  padding: 1rem;
  color: white;
  text-align: center;
  background: #35495e;
}
</style>
