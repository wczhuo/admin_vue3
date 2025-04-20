// src/router/index.ts
import {createRouter, createWebHistory, createWebHashHistory, type RouteRecordRaw} from 'vue-router'
import {getAllMenusApi} from "@/api/core/menu.ts";
import {isLogin} from "@/api/core/auth.ts";
import {ConfigProvider, message} from 'ant-design-vue';
import {theme} from 'ant-design-vue';
import {ref} from "vue";

const {darkAlgorithm} = theme;
// 设置message样式
ConfigProvider.config({
    theme: {algorithm: darkAlgorithm} as any,
    // theme: defaultAlgorithm,
});

const menus: any = ref([]);

const getAllMenus = async () => {
    if (menus.value?.length > 0) {
        return menus.value;
    }
    if (isLogin()) {
        const hide = message.loading('加载菜单中...', 0);
        const menus = (await getAllMenusApi() as any)?.result;
        hide();
        generateRouterItems(menus);
        return menus;
    }
    return [];
}

let modules = import.meta.glob('../views/**/**/*.vue');

const getViews = (item: any) => {
    return modules[item.component == 'LAYOUT' ? `../views/Index.vue` : `../views${item.component}.vue`];
}
const routesApi = ref(<object[]>[]);

const generateRouterItems = (items?: any[]): any[] => {
    if (!items) return [];

    return items.map((item) => {
        if (item.component !== 'LAYOUT') {
            routesApi.value.push({
                path: item.path.substring(0, 1) == '/' ? item.path.substring(1) : item.path,
                name: item?.name,
                // component: item?.component,
                // component: () => import(`@/views${item.component}.vue`), // 懒加载
                component: getViews(item), // 懒加载
                // children: item?.children?.length > 0 ? generateRouterItems(item.children) : undefined
            });
        }
        if (item?.children?.length > 0) {
            generateRouterItems(item.children);
        }
    });
};

export const addDynamicRoutes = (routes: any) => {
    routes.forEach((route: any) => {
        // console.log('route.path', route.path);
        router.addRoute('Index123', {
            path: route.path,
            name: route.name,
            component: route.component,
            meta: {requiresAuth: true},
            children: route.children || [] // 支持嵌套路由
        });
    });
    // console.log('addDynamicRoutes', router.getRoutes());

    // 添加404兜底路由（需放在最后）
    router.addRoute({
        path: '/:pathMatch(.*)*',
        component: () => import('@/views/404.vue')
    });
};

const generateRoutes = async () => {
    if (router.getRoutes().length > 3) {
        console.log('generateRoutes 123');
        return menus.value;
    }
    // console.log('routesApi.value', routesApi.value);
    if (routesApi.value.length == 0) {
        menus.value = await getAllMenus();
        // console.log('generateRoutes menus', menus);
        generateRouterItems(menus.value);
        // 添加动态路由
        console.log('添加动态路由 1');
        addDynamicRoutes(routesApi.value);

        return menus.value;
    } else {
        // 添加动态路由
        console.log('添加动态路由 2');
        addDynamicRoutes(routesApi.value);

        return menus.value;
    }
    // return menus.value;
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
        // children: [...routesApi.value],
        children: [
            {
                path: '/dashboard/analysis',
                name: 'DashboardAnalysis',
                component: () => import('@/views/dashboard/analytics/index.vue'), // 懒加载
                meta: {requiresAuth: true}, // 添加路由元信息
            }
        ],
    }
]
// console.log('routes', routes);

const router = createRouter({
    history:
        import.meta.env.VITE_ROUTER_HISTORY === 'hash'
            ? createWebHashHistory(import.meta.env.VITE_BASE)
            : createWebHistory(import.meta.env.VITE_BASE),
    // 应该添加到路由的初始路由列表。
    routes
});

router.beforeEach(async (to, __from, next) => {
    const isAuthenticated = isLogin();

    if (isAuthenticated) {
        console.log('添加动态路由 12123');
        await generateRoutes();
    }

    if (to.meta.requiresAuth && !isAuthenticated) {
        // 保存原始路径用于登录后跳转
        localStorage.setItem('redirectPath', to.fullPath)
        next('/login')
    } else {
        next();
    }
})

// const router = await generateRoutes();

export {getAllMenus, generateRoutes};
export default router