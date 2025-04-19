import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
// import Components from 'unplugin-vue-components/vite';
// import RadixVueResolver from 'radix-vue/resolver';

// 在控制台输出
// console.log('__dirname', __dirname);

// https://vite.dev/config/
export default defineConfig(({mode}) => ({
    plugins: [
        vue(),
        // Components({
        //     resolvers: [RadixVueResolver()], // 自动解析 Radix Vue 组件
        // }),
    ],

    server: {
        hmr: {
            // 当 HTML 文件变化时强制刷新页面
            overlay: false,
        },

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
