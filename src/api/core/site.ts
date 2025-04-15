import request from '@/utils/request';

/**
 * 获取用户所有菜单
 */
export async function getInitData() {
    return request.get('/init');
}