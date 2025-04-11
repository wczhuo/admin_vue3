// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
// import HomeView from '@/views/HomeView.vue'

// 定义路由类型增强安全性
const routes: Array<RouteRecordRaw> = [
    {
        path: '/home',
        name: 'home',
        component: () => import('@/views/HomeView.vue'), // 懒加载
        meta: { requiresAuth: true } // 添加路由元信息
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('@/views/AboutView.vue'), // 懒加载
        meta: { requiresAuth: true } // 添加路由元信息
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login.vue') // 懒加载
    },
    {
        path: '/index',
        name: 'about',
        component: () => import('@/views/Index.vue'), // 懒加载
        meta: { requiresAuth: true } // 添加路由元信息
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, __from, next) => {
    const isAuthenticated = localStorage.getItem('token');

    if (to.meta.requiresAuth && !isAuthenticated) {
        // 保存原始路径用于登录后跳转
        localStorage.setItem('redirectPath', to.fullPath)
        next('/login')
    } else {
        next();
    }
})

export default router