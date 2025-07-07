<script setup>
// 使用 admin 布局
definePageMeta({
  layout: 'admin'
});

console.log('Home page loaded - should use admin layout');
</script>

<template>
  <div class="home">
    <h1>欢迎使用 X-Library Vue Router</h1>
    <p>这是一个展示自动路由生成和布局系统的示例项目</p>

    <div class="features">
      <div class="feature">
        <h3>🚀 自动路由生成</h3>
        <p>基于文件系统自动生成路由配置</p>
      </div>
      <div class="feature">
        <h3>📐 布局系统</h3>
        <p>支持多种布局，可通过 definePageMeta 配置</p>
      </div>
      <div class="feature">
        <h3>🔧 可配置命名空间</h3>
        <p>避免组件名称冲突，支持自定义前缀</p>
      </div>
    </div>

    <p class="note">当前页面使用默认布局</p>
  </div>
</template>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

h1 {
  margin-bottom: 1rem;
  color: #42b883;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
}

.feature {
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
}

.feature h3 {
  margin: 0 0 1rem;
  color: #2c3e50;
}

.feature p {
  margin: 0;
  color: #666;
}

.note {
  margin-top: 2rem;
  color: #999;
  font-style: italic;
}
</style>
