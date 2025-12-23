import { apiCall } from '../axiosInstance';

export const authApi = {
    // Login
    login: (credentials) => apiCall('post', 'token/', credentials),

    // Refresh token
    refreshToken: (refreshToken) => apiCall('post', 'token/refresh/', { refresh: refreshToken }),

    // Get current user
    getCurrentUser: () => apiCall('get', 'user/me/'),

    // Register
    register: (userData) => apiCall('post', 'user/register/', userData),

    // Check if authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('access');
    },

    // Logout
    logout: () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('user');
        localStorage.removeItem('is_staff');
    },

    // Get stored user
    getStoredUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },
};