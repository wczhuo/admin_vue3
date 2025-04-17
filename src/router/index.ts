// src/router/index.ts
import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'
import {getAllMenusApi} from "@/api/core/menu.ts";
import {isLogin} from "@/api/core/auth.ts";
import {ConfigProvider, message} from 'ant-design-vue';
// import HomeView from '@/views/HomeView.vue'

import {theme} from 'ant-design-vue';

const {darkAlgorithm} = theme;
// 设置message样式
ConfigProvider.config({
    theme: {algorithm: darkAlgorithm} as any,
    // theme: defaultAlgorithm,
});

let menus: any;
console.log('isLogin()', isLogin());
if (isLogin()) {
    const hide = message.loading('加载菜单中...', 0);
    menus = (await getAllMenusApi() as any)?.result;
    console.log('menus 1', menus);
    hide();
}

const getAllMenus = async () => {
    // if (menus) {
    //     generateItems(menus);
    //     return menus;
    // }
    if (isLogin()) {
        const hide = message.loading('加载菜单中...', 0);
        menus = (await getAllMenusApi() as any)?.result;
        console.log('menus 2', menus);
        hide();
        generateItems(menus);
        return menus;
    }
    return [];
}

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
if (menus) {
    generateItems(menus);
}

export const addDynamicRoutes = (routes: any) => {
    routes.forEach((route: any) => {
        router.addRoute('Index123', {
            path: route.path,
            name: route.name,
            component: () => import(`@/views/${route.component}.vue`),
            meta: {requiresAuth: true},
            children: route.children || [] // 支持嵌套路由
        });
    });

    // 添加404兜底路由（需放在最后）
    router.addRoute({
        path: '/:pathMatch(.*)*',
        component: () => import('@/views/404.vue')
    });
};

const generateRoutes = async () => {
    menus = await getAllMenus();
    console.log('generateRoutes menus', menus);
    generateItems(menus);

    addDynamicRoutes(routesApi);
}

// 定义路由类型增强安全性
const routes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue') // 懒加载
    },
    {
        path: '/',
        name: 'Index123',
        component: () => import('@/views/Index.vue'), // 懒加载
        meta: {requiresAuth: true}, // 添加路由元信息
        children: [...routesApi],
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

// const router = await generateRoutes();

export {menus, getAllMenus, generateRoutes};
export default router