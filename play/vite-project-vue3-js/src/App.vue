<script setup>
import { generateId, isEmpty } from '@x-library/utils';
import { ref } from 'vue';

import HelloWorld from './components/HelloWorld.vue';

const a = 1;

console.log(a);

// 测试数据
const testValues = ref(['', null, undefined, 'hello', 0, false]);

const randomId = ref('');

// 生成新的随机ID
const generateNewId = () => {
  randomId.value = generateId();
};

// 初始化时生成一个ID
generateNewId();
</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>

  <!-- 测试 @x-library/utils -->
  <div class="utils-test">
    <h2>@x-library/utils 测试</h2>

    <div class="test-section">
      <h3>isEmpty() 函数测试</h3>
      <ul>
        <li v-for="(value, index) in testValues" :key="index">
          <code>{{
            value === null ? 'null' : value === undefined ? 'undefined' : JSON.stringify(value)
          }}</code>
          → isEmpty: <strong>{{ isEmpty(value) }}</strong>
        </li>
      </ul>
    </div>

    <div class="test-section">
      <h3>generateId() 函数测试</h3>
      <p>
        当前随机ID: <code>{{ randomId }}</code>
      </p>
      <button @click="generateNewId">生成新ID</button>
    </div>
  </div>

  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.utils-test {
  margin: 2rem 0;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;
}

.test-section {
  margin: 1rem 0;
}

.test-section h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.test-section ul {
  list-style: none;
  padding: 0;
}

.test-section li {
  margin: 0.5rem 0;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
}

.test-section code {
  background: #e8e8e8;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: monospace;
}

.test-section button {
  padding: 0.5rem 1rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.5rem;
}

.test-section button:hover {
  background: #369870;
}
</style>
