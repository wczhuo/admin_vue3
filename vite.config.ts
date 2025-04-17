import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';

// 在控制台输出
// console.log('__dirname', __dirname);

// https://vite.dev/config/
export default defineConfig(({mode}) => ({
    plugins: [vue()],

    server: {
        port: 3000, // 自己规定的端口号

        proxy: mode === 'production' ? {} : {
            '/api': {
                changeOrigin: true,
                rewrite: (path1: string) => path1.replace(/^\/api/, ''),
                // mock代理目标地址
                target: 'http://localhost:5320/api',
                ws: true,
            },
            '/uploads': {
                changeOrigin: true,
                rewrite: (path1: string) => path1.replace(/^\/uploads/, ''),
                // mock代理目标地址
                target: mode === 'production' ? 'https://back.ebeic.com/uploads' : 'http://shopro.local/uploads',
                ws: true,
            },
        } as any,
    },

    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'), // 精确指向 src 目录
            '#': path.resolve(__dirname, './src'), // 精确指向 src 目录
        }
    },

    css: {
        preprocessorOptions: {
            scss: {
                // additionalData: `@import "@/assets/scss/global.scss";` // 全局注入，无效
            }
        }
    }
}));
