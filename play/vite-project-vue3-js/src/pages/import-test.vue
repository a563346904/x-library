<template>
  <div>
    <h1>Import Test</h1>
    <p>Testing if we can import from @x-library/vue-router/layouts</p>
  </div>
</template>

<script setup>
// 直接测试导入
try {
  // 这应该会触发 Vite 的模块解析
  console.log('Attempting to import from @x-library/vue-router/layouts...');
} catch (error) {
  console.error('Import error:', error);
}
</script>
