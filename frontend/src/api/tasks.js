import { apiCall } from '../axiosInstance';

export const taskApi = {
    // Get tasks with pagination
    getTasks: (url = 'tasks/') => apiCall('get', url),

    // Get single task
    getTask: (id) => apiCall('get', `tasks/${id}/`),

    // Create new task
    createTask: (taskData) => apiCall('post', 'tasks/', taskData),

    // Update task
    updateTask: (id, taskData) => apiCall('put', `tasks/${id}/`, taskData),

    // Partially update task
    patchTask: (id, taskData) => apiCall('patch', `tasks/${id}/`, taskData),

    // Delete task
    deleteTask: (id) => apiCall('delete', `tasks/${id}/`),

    // Mark task as complete
    markComplete: (id) => apiCall('post', `tasks/${id}/mark_complete/`),

    // Mark task as pending
    markPending: (id) => apiCall('post', `tasks/${id}/mark_pending/`),
};