import request from '@/utils/request';

/**
 * 获取用户所有菜单
 */
export async function getAllMenusApi() {
    return request.get('/menu/all');
}