import axios from 'axios';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api',
});

// Request interceptor to add token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Use appropriate token based on the request URL
    const isAdminRoute = config.url?.includes('/admin');
    const adminToken = localStorage.getItem('adminToken');
    const userToken = localStorage.getItem('userToken');
    
    // For admin routes, use admin token; for user routes, use user token
    const token = isAdminRoute ? adminToken : userToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Only handle 401 errors (Unauthorized)
    if (error.response?.status === 401) {
      console.log('Authentication error detected, token may be expired');
      
      // Check if we're not already on the register/login page to avoid loops
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/register') && !currentPath.includes('/admin/login')) {
        // Clear auth data based on user type
        if (currentPath.includes('/admin')) {
          localStorage.removeItem('adminAuth');
          localStorage.removeItem('adminToken');
          window.location.href = '/admin/login';
        } else {
          localStorage.removeItem('userToken');
          localStorage.removeItem('userType');
          localStorage.removeItem('isActivated');
          window.location.href = '/register';
        }
        
        // Show user-friendly message
        const errorMessage = error.response?.data?.message || 'Session expired. Please login again.';
        console.log(errorMessage);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
