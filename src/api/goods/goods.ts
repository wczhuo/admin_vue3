import axios from '@/utils/request';

interface LoginForm {

}

export const login = (data: LoginForm) => axios.post('/auth/login', data);

export const getUserInfo = () => axios.get('/user/profile');