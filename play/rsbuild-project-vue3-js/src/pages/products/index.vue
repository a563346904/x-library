<template>
  <div class="products-page">
    <h1>产品中心</h1>
    <p>这是嵌套路由的示例页面</p>

    <nav class="product-nav">
      <router-link to="/products" exact-active-class="active"> 全部产品 </router-link>
      <router-link to="/products/electronics" active-class="active"> 电子产品 </router-link>
      <router-link to="/products/books" active-class="active"> 图书 </router-link>
      <router-link to="/products/clothing" active-class="active"> 服装 </router-link>
    </nav>

    <div class="product-content">
      <router-view>
        <!-- 默认内容：当访问 /products 时显示 -->
        <div class="all-products">
          <h2>所有产品分类</h2>
          <div class="category-grid">
            <div class="category-card">
              <h3>📱 电子产品</h3>
              <p>手机、电脑、配件等</p>
            </div>
            <div class="category-card">
              <h3>📚 图书</h3>
              <p>技术书籍、小说、教材等</p>
            </div>
            <div class="category-card">
              <h3>👕 服装</h3>
              <p>男装、女装、运动装等</p>
            </div>
          </div>
        </div>
      </router-view>
    </div>

    <router-link to="/" class="back-link">← 返回首页</router-link>
  </div>
</template>

<style scoped>
.products-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}

.product-nav {
  display: flex;
  gap: 20px;
  margin: 30px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #eee;
}

.product-nav a {
  padding: 10px 20px;
  color: #666;
  text-decoration: none;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
}

.product-nav a:hover {
  color: #42b883;
}

.product-nav a.active {
  color: #42b883;
  border-bottom-color: #42b883;
}

.product-content {
  min-height: 300px;
  margin: 30px 0;
}

.all-products h2 {
  margin-bottom: 20px;
  color: #333;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.category-card {
  padding: 30px;
  text-align: center;
  background: #f8f9fa;
  border-radius: 8px;
}

.category-card h3 {
  margin-bottom: 10px;
  color: #333;
  font-size: 24px;
}

.category-card p {
  color: #666;
}

.back-link {
  display: inline-block;
  margin-top: 30px;
  color: #42b883;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}
</style>
