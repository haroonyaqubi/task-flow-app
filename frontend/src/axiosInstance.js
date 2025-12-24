import axios from 'axios';

// === DEBUG SECTION - REMOVE AFTER FIX ===
// This will show in the browser for EVERY visitor
window.API_DEBUG = process.env;
console.log('=== ALL ENVIRONMENT VARIABLES (process.env) ===', process.env);
console.log('=== REACT_APP_API_BASE_URL SPECIFICALLY ===', process.env.REACT_APP_API_BASE_URL);

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://task-flow-app-ibcu.onrender.com/api/';
console.log('FINAL API_BASE_URL being used:', API_BASE_URL);
// === END DEBUG SECTION ===

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Log request for debugging
      console.log(`API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);

      return config;
    },
    (error) => {
      console.error('Request error:', error);
      return Promise.reject(error);
    }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response) => {
      // Log successful responses for debugging
      console.log(`API Success: ${response.status} ${response.config.url}`);
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Log error for debugging
      console.error('API Error:', {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      // Handle 401 Unauthorized (token expired)
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem('refresh');
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          // IMPORTANT: Use the correct base URL for refresh
          const refreshURL = API_BASE_URL.replace(/\/api\/?$/, '') + '/api/token/refresh/';
          console.log('Refreshing token at:', refreshURL);

          // Attempt to refresh token
          const response = await axios.post(
              refreshURL,
              { refresh: refreshToken }
          );

          const { access } = response.data;
          localStorage.setItem('access', access);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return axiosInstance(originalRequest);

        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);

          // Clear tokens and redirect to login
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          localStorage.removeItem('is_staff');

          // Redirect to login page if we're not already there
          if (window.location.pathname !== '/login') {
            window.location.href = '/login?session=expired';
          }

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
);

// Helper function for API calls with better error handling
export const apiCall = async (method, url, data = null, config = {}) => {
  try {
    console.log(`Making API call: ${method.toUpperCase()} ${url}`);

    const response = await axiosInstance({
      method,
      url,
      data,
      ...config,
    });

    return { success: true, data: response.data };

  } catch (error) {
    console.error('apiCall error:', {
      url,
      method,
      error: error.response?.data || error.message
    });

    return {
      success: false,
      error: error.response?.data || { message: error.message || 'Network error' },
      status: error.response?.status,
    };
  }
};

// Export both the instance and the helper function
export default axiosInstance;