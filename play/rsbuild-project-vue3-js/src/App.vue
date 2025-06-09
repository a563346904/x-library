<template>
  <div class="content">
    <h1>Rsbuild + Vue3 + 代理测试</h1>
    <p>测试通过本地代理服务器访问远程API</p>

    <!-- API测试面板 -->
    <div class="api-test-panel">
      <h2>🔐 API认证测试</h2>
      <div class="auth-section">
        <div class="form-group">
          <label>用户名:</label>
          <input v-model="authForm.username" type="text" placeholder="admin" />
        </div>
        <div class="form-group">
          <label>密码:</label>
          <input v-model="authForm.password" type="password" placeholder="admin" />
        </div>
        <div class="form-group">
          <label>
            <input v-model="authForm.rememberMe" type="checkbox" />
            记住我
          </label>
        </div>
        <button :disabled="loading" class="btn btn-primary" @click="testAuthentication">
          {{ loading && currentAction === 'auth' ? '认证中...' : '测试认证API' }}
        </button>

        <div v-if="authResult" class="result-box" :class="authResult.success ? 'success' : 'error'">
          <h3>{{ authResult.success ? '✅ 认证成功' : '❌ 认证失败' }}</h3>
          <div v-if="authResult.success">
            <p><strong>Token:</strong></p>
            <textarea readonly :value="authResult.token" class="token-display"></textarea>
          </div>
          <div v-if="authResult.error">
            <p><strong>错误信息:</strong> {{ authResult.error }}</p>
          </div>
          <details>
            <summary>查看完整响应</summary>
            <pre>{{ JSON.stringify(authResult.data, null, 2) }}</pre>
          </details>
        </div>
      </div>

      <h2>📊 请求日志</h2>
      <div class="logs-section">
        <button class="btn btn-secondary" @click="clearLogs">清空日志</button>
        <div class="logs-container">
          <div v-for="(log, index) in requestLogs" :key="index" class="log-entry">
            <span class="log-time">{{ log.time }}</span>
            <span class="log-method" :class="log.method.toLowerCase()">{{ log.method }}</span>
            <span class="log-url">{{ log.url }}</span>
            <span class="log-status" :class="getStatusClass(log.status)">{{ log.status }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

// 响应式数据
const loading = ref(false);
const currentAction = ref('');
const authResult = ref(null);
const requestLogs = ref([]);

// 认证表单数据
const authForm = reactive({
  username: 'admin',
  password: 'admin',
  rememberMe: true
});

// 添加请求日志
const addLog = (method, url, status, duration = 0) => {
  requestLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    method,
    url,
    status,
    duration
  });
  // 只保留最近20条日志
  if (requestLogs.value.length > 20) {
    requestLogs.value = requestLogs.value.slice(0, 20);
  }
};

// 获取状态码样式类
const getStatusClass = status => {
  if (status >= 200 && status < 300) return 'status-success';
  if (status >= 400 && status < 500) return 'status-client-error';
  if (status >= 500) return 'status-server-error';
  return 'status-info';
};

// 测试认证API
const testAuthentication = async () => {
  loading.value = true;
  currentAction.value = 'auth';
  const startTime = Date.now();

  try {
    const response = await fetch('/api/authenticate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(authForm)
    });

    const duration = Date.now() - startTime;
    const data = await response.json();

    addLog('POST', '/api/authenticate', response.status, duration);

    if (response.ok) {
      authResult.value = {
        success: true,
        token: data.id_token,
        data
      };
    } else {
      authResult.value = {
        success: false,
        error: data.message || '认证失败',
        data
      };
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    addLog('POST', '/api/authenticate', 'ERROR', duration);

    authResult.value = {
      success: false,
      error: error.message,
      data: { error: error.message }
    };
  } finally {
    loading.value = false;
    currentAction.value = '';
  }
};

// 清空日志
const clearLogs = () => {
  requestLogs.value = [];
};
</script>

<style scoped>
.content {
  display: flex;
  min-height: 100vh;
  line-height: 1.1;
  text-align: center;
  flex-direction: column;
  justify-content: flex-start;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.content h1 {
  font-size: 3.6rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.content > p {
  font-size: 1.2rem;
  font-weight: 400;
  opacity: 0.7;
  margin-bottom: 30px;
}

.api-test-panel {
  text-align: left;
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  margin: 20px 0;
}

.api-test-panel h2 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.status-section,
.auth-section,
.logs-section {
  margin-bottom: 30px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #555;
}

.form-group input[type='text'],
.form-group input[type='password'] {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input[type='checkbox'] {
  margin-right: 8px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  margin-right: 10px;
  margin-bottom: 10px;
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-info {
  background: #17a2b8;
  color: white;
}

.btn-info:hover:not(:disabled) {
  background: #138496;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #545b62;
}

.result-box {
  margin-top: 15px;
  padding: 15px;
  border-radius: 5px;
  border: 1px solid;
}

.result-box.success {
  background: #d4edda;
  border-color: #c3e6cb;
  color: #155724;
}

.result-box.error {
  background: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
}

.result-box pre {
  background: rgba(0, 0, 0, 0.05);
  padding: 10px;
  border-radius: 3px;
  font-size: 12px;
  overflow-x: auto;
  white-space: pre-wrap;
}

.token-display {
  width: 100%;
  height: 80px;
  font-family: monospace;
  font-size: 12px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 3px;
  background: #f9f9f9;
  resize: vertical;
}

.logs-container {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: #fafafa;
}

.log-entry {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #e0e0e0;
  font-size: 13px;
  font-family: monospace;
}

.log-entry:last-child {
  border-bottom: none;
}

.log-time {
  color: #666;
  margin-right: 10px;
  min-width: 80px;
}

.log-method {
  font-weight: bold;
  margin-right: 10px;
  min-width: 50px;
  text-align: center;
  padding: 2px 6px;
  border-radius: 3px;
  color: white;
}

.log-method.get {
  background: #28a745;
}

.log-method.post {
  background: #007bff;
}

.log-method.put {
  background: #ffc107;
  color: #333;
}

.log-method.delete {
  background: #dc3545;
}

.log-url {
  flex: 1;
  margin-right: 10px;
  color: #333;
}

.log-status {
  min-width: 60px;
  text-align: center;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 3px;
}

.status-success {
  background: #d4edda;
  color: #155724;
}

.status-client-error {
  background: #f8d7da;
  color: #721c24;
}

.status-server-error {
  background: #f8d7da;
  color: #721c24;
}

.status-info {
  background: #d1ecf1;
  color: #0c5460;
}

details {
  margin-top: 10px;
}

summary {
  cursor: pointer;
  font-weight: 500;
  padding: 5px 0;
}

summary:hover {
  color: #007bff;
}
</style>
