// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',  // ← adjust if your backend is different
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');  // or 'jwt', 'authToken' — match your key
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Handle 401 globally (logout + redirect)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('401 Unauthorized → logging out');
      localStorage.removeItem('token');
      // Optional: window.location.href = '/login'; or use navigate from react-router
      alert('Session expired. Please log in again.');
    }
    return Promise.reject(error);
  }
);

export default api;