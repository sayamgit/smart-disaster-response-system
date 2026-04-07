import axios from 'axios';

const rawUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const apiUrl = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`;

const api = axios.create({
  baseURL: apiUrl,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor with token refresh
api.interceptors.response.use(
  response => response,
  async error => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const res = await axios.post(
            `${apiUrl}/auth/refresh`,
            { refreshToken }
          );
          const { accessToken } = res.data.data;
          localStorage.setItem('accessToken', accessToken);
          original.headers.Authorization = `Bearer ${accessToken}`;
          return api(original);
        } catch (_) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
