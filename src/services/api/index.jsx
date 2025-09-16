// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('role');
      sessionStorage.removeItem('id');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  // Login user
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Register new user
  register: (userData) => api.post('/auth/register', userData),
  
  // Get current user data
  getMe: () => api.get('/auth/me'),
  
  // Logout user
  logout: () => api.post('/auth/logout'),
  
  // Google authentication
  googleAuth: () => {
    window.open(`${API_BASE_URL}/auth/google`, '_self');
  },
  
  // Forgot password
  forgotPassword: (email) => api.post('/auth/forgotpassword', email),
  
  // Reset password
  resetPassword: (data) => api.put('/auth/resetpassword', data),
};

// Student API endpoints
export const studentAPI = {
  getProfile: (id) => api.get(`/students/${id}`),
  updateProfile: (id, data) => api.put(`/students/${id}`, data),
  getEnrolledEvents: (id) => api.get(`/students/${id}/events`),
};

// Event API endpoints
export const eventAPI = {
  getAll: () => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  register: (eventId) => api.post(`/events/${eventId}/register`),
  unregister: (eventId) => api.delete(`/events/${eventId}/register`),
};

export default api;