import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://api.edzurelegal.com/api';
const BASE_URL = process.env.REACT_APP_BASE_URL || 'https://api.edzurelegal.com';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout')
};

// Insights API calls
export const insightsAPI = {
  getAll: (params) => api.get('/insights', { params }),
  getBySlug: (slug) => api.get(`/insights/${slug}`),
  getRecent: (limit = 5) => api.get(`/insights/recent/${limit}`),
  search: (term, params) => api.get(`/insights/search/${term}`, { params }),
  create: (data) => api.post('/insights', data),
  update: (id, data) => api.put(`/insights/${id}`, data),
  delete: (id) => api.delete(`/insights/${id}`)
};

// Upload API calls
export const uploadAPI = {
  uploadImage: (formData) => {
    return api.post('/upload/insight', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  deleteImage: (filename) => api.delete(`/upload/insight/${filename}`)
};

// Helper function to get full image URL
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '/placeholder.jpg';
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${BASE_URL}${imageUrl}`;
};

export default api;