import { apiCall } from '../axiosInstance';

/**
 * API service for contact form operations
 */
export const contactApi = {
    /**
     * Send contact form message
     * @param {Object} contactData - Contact form data
     * @returns {Promise} API response
     */
    sendMessage: (contactData) => apiCall('post', 'contact/', contactData),
};