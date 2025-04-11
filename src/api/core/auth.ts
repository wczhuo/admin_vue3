import request from '@/utils/request';

/**
 * 登录
 */
export async function loginApi(data: any) {
    return request.post('/auth/login', data);
}