import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://localhost:44359',

});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aureo_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLogin = error.config?.url?.includes('/api/usuarios/login');
    if (error.response?.status === 401 && !isLogin) {
      localStorage.removeItem('aureo_token');
      localStorage.removeItem('aureo_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
