<script setup>
// 使用 admin 布局
definePageMeta({
  layout: 'admin'
});
</script>

<template>
  <div class="admin-dashboard">
    <h1>管理后台仪表盘</h1>
    <div class="stats">
      <div class="stat-card">
        <h3>用户总数</h3>
        <p class="stat-value">1,234</p>
      </div>
      <div class="stat-card">
        <h3>活跃用户</h3>
        <p class="stat-value">567</p>
      </div>
      <div class="stat-card">
        <h3>今日访问</h3>
        <p class="stat-value">890</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 2rem;
  color: #2c3e50;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
}

.stat-card h3 {
  margin: 0 0 1rem;
  color: #666;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.stat-value {
  margin: 0;
  color: #42b883;
  font-weight: bold;
  font-size: 2rem;
}
</style>
