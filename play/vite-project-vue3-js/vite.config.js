import path from 'path';

import vue from '@vitejs/plugin-vue';
import { viteAutoRoutes } from '@x-library/vue-router-vite';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteAutoRoutes({
      enableLayouts: true
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://120.26.120.53:8888',
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            proxyReq.removeHeader('origin');
            proxyReq.removeHeader('referer');
            console.log('Sending Request to the Target:', req.method, req.url);
          });
        }
      }
    }
  }
});
