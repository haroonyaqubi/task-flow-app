import axios from 'axios';

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://task-flow-app-ibcu.onrender.com/api/',
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
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Handle 401 Unauthorized (token expired)
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem('refresh');
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          // Use the correct base URL for refresh
          const baseURL = process.env.REACT_APP_API_BASE_URL || 'https://task-flow-app-ibcu.onrender.com/api/';
          const refreshURL = baseURL.replace(/\/api\/?$/, '') + '/api/token/refresh/';

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
    const response = await axiosInstance({
      method,
      url,
      data,
      ...config,
    });

    return { success: true, data: response.data };

  } catch (error) {
    return {
      success: false,
      error: error.response?.data || { message: error.message || 'Network error' },
      status: error.response?.status,
    };
  }
};

// Export both the instance and the helper function
export default axiosInstance;