import axios from 'axios';
import router from "@/router";

const request = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // 环境变量配置后端地址
    timeout: 10000, // 超时时间
    headers: {'Content-Type': 'application/json'}
});

// 请求拦截器（添加 Token）
request.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// 响应拦截器（统一错误处理）
request.interceptors.response.use(
    response => response.data, // 直接返回核心数据
    error => {
        if (error.response?.status === 401) {
            router.push('/login'); // 未授权跳转登录
        }
        return Promise.reject(error);
    }
);

export default request;