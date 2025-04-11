import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';

// 在控制台输出
// console.log('__dirname', __dirname);

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],

  server: {
    port: 3000, // 自己规定的端口号
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 精确指向 src 目录
      '#': path.resolve(__dirname, './src'), // 精确指向 src 目录
    }
  }
})
