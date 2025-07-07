<template>
  <div class="card-page">
    <h1>卡片页面</h1>
    <p>这是卡片页面，使用默认布局</p>
    <div class="card-grid">
      <div class="card">卡片 1</div>
      <div class="card">卡片 2</div>
      <div class="card">卡片 3</div>
    </div>
  </div>
</template>

<style scoped>
.card-page {
  max-width: 800px;
  margin: 0 auto;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.card {
  padding: 2rem;
  text-align: center;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}
</style>
