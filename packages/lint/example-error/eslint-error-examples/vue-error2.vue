<template>
  <div>Vue Error Examples 2</div>
</template>

<script setup>
// 导入Vue的API
import { ref, watch } from 'vue';

// 测试1: 使用ref作为操作数 - 触发 vue/no-ref-as-operand
const count = ref(0);
if (count > 0) {
  console.log('Count is positive');
}

// 测试2: 在await后使用watch - 应触发 vue/no-watch-after-await
const source = ref('data');
const callback = () => {};

onMounted(async () => {
  // 使用明确的await和watch，在组件生命周期函数中
  await new Promise(resolve => setTimeout(resolve, 100));
  watch(source, callback);
});

// 测试3: 属性和事件命名不一致 - 应触发 vue/custom-event-name-casing
const emits = defineEmits(['Update', 'Delete']);
</script>

<style>
.example {
  color: blue;
}
</style>
