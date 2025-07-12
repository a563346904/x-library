import { createApp } from 'vue';

import './style.css';
import App from './App.vue';
import router from './router';

createApp(App).use(router).mount('#app');

// 调用认证接口
fetch('/api/authenticate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'admin',
    rememberMe: true
  })
})
  .then(response => {
    console.log('响应状态:', response.status);
    console.log('响应头:', response.headers);
    return response.json();
  })
  .then(data => {
    console.log('认证成功:', data);
  })
  .catch(error => {
    console.error('认证失败:', error);
  });
