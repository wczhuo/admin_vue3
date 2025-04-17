// src/router/index.ts
import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'
import {getAllMenusApi} from "@/api/core/menu.ts";
import {isLogin} from "@/api/core/auth.ts";
import {ConfigProvider, message} from 'ant-design-vue';
// import HomeView from '@/views/HomeView.vue'

import {theme} from 'ant-design-vue';
const {darkAlgorithm} = theme;

ConfigProvider.config({
    theme: { algorithm: darkAlgorithm } as any,
    // theme: defaultAlgorithm,
});

let menus: any;
try {
    if(isLogin()){
        const hide = message.loading('加载菜单中...', 0);
        menus = await getAllMenusApi();
        // console.log('menus', menus);
        hide();
    }
} catch (e) {

}

export {menus};

let modules = import.meta.glob('../views/**/**/*.vue');
// console.log('modules', modules);

const getViews = (item: any) => {
    return modules[item.component == 'LAYOUT' ? `../views/Index.vue` : `../views${item.component}.vue`];
}
let routesApi: any[] = [];

const generateItems = (items?: any[]): any[] => {
    if (!items) return [];

    return items.map((item) => {
        if (item.component !== 'LAYOUT') {
            routesApi.push({
                path: item.path.substring(0, 1) == '/' ? item.path.substring(1) : item.path,
                name: item?.name,
                component: getViews(item), // 懒加载
                // children: item?.children?.length > 0 ? generateItems(item.children) : undefined
            });
        }
        if (item?.children?.length > 0) {
            generateItems(item.children);
        }
    });
};
if (menus?.result) {
    generateItems(menus.result);
}


// 定义路由类型增强安全性
const routes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login.vue') // 懒加载
    },
    {
        path: '/',
        name: '',
        component: () => import('@/views/Index.vue'), // 懒加载
        meta: {requiresAuth: true}, // 添加路由元信息
        children: [
            ...routesApi,
            {
                path: 'home',
                name: 'home',
                component: () => import('@/views/HomeView.vue'), // 懒加载
                meta: {requiresAuth: true} // 添加路由元信息
            },
            {
                path: '/about',
                name: 'about',
                component: () => import('@/views/AboutView.vue'), // 懒加载
                meta: {requiresAuth: true} // 添加路由元信息
            },
            {
                path: '/index',
                name: 'index',
                component: () => import('@/views/Index.vue'), // 懒加载
                meta: {requiresAuth: true} // 添加路由元信息
            },
        ],
    }
]
// console.log('routes', routes);

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