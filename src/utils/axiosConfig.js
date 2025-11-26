import axios from 'axios';

// Create axios instance with production-ready configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api',
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Set to true if using cookies
});

// Request interceptor to add token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      // Don't redirect on network errors
      return Promise.reject(error);
    }

    // Only handle 401 errors (Unauthorized)
    if (error.response?.status === 401) {
      console.log('Authentication error detected, token may be expired');
      
      // Check if we're not already on the register/login page to avoid loops
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/register') && !currentPath.includes('/admin/login')) {
        // Clear auth data
        localStorage.removeItem('userToken');
        localStorage.removeItem('userType');
        localStorage.removeItem('isActivated');
        
        // Show user-friendly message
        const errorMessage = error.response?.data?.message || 'Session expired. Please login again.';
        console.log(errorMessage);
        
        // Only redirect if it's truly an auth error
        if (currentPath.includes('/admin')) {
          window.location.href = '/admin/login';
        } else {
          window.location.href = '/register';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
