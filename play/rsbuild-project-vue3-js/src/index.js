import './index.css';

import axios from 'axios';
import { createApp } from 'vue';

import App from './App.vue';

// 使用正确的认证信息和格式
axios
  .post('/api/authenticate', {
    username: 'admin',
    password: 'admin',
    rememberMe: true
  })
  .then(response => {
    console.log('✅ 认证成功!', response.data);
    console.log('JWT Token:', response.data.id_token);
  })
  .catch(error => {
    console.error('❌ 认证失败:', error.response?.data || error.message);
  });

createApp(App).mount('#root');
