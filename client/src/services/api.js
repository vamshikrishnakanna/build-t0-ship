/**
 * client/src/services/api.js
 * Axios instance with JWT interceptor.
 * All API requests are routed through this instance.
 */

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout for AI generation
});

/**
 * Request interceptor: Attaches the JWT token from localStorage to every request.
 */
api.interceptors.request.use(
  (config) => {
    try {
      const stored = localStorage.getItem('cropadvisor-auth');
      if (stored) {
        const { state } = JSON.parse(stored);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      }
    } catch {
      // localStorage parse error — ignore, request proceeds without token
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor: Handles 401 by clearing auth state.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cropadvisor-auth');
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// ─── Farms API ────────────────────────────────────────────────────────────────
export const farmsApi = {
  getAll: () => api.get('/farms'),
  getById: (id) => api.get(`/farms/${id}`),
  create: (data) => api.post('/farms', data),
  delete: (id) => api.delete(`/farms/${id}`),
};

// ─── Advisory API ─────────────────────────────────────────────────────────────
export const advisoryApi = {
  generate: (data) => api.post('/advisory/generate', data),
  getAll: () => api.get('/advisory'),
  getById: (id) => api.get(`/advisory/${id}`),
};

export default api;
