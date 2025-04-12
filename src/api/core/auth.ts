import request from '@/utils/request';

/**
 * 登录
 */
export async function loginApi(data: any) {
    return request.post('/auth/login', data);
}

export function isLogin(): boolean {
    return !!localStorage.getItem('token');
}

export function userInfo() {
    const userInfo: string | null = localStorage.getItem('userInfo');
    if (userInfo) {
        return JSON.parse(userInfo);
    } else {
        return null;
    }
}