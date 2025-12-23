import { useState, useCallback } from 'react';
import { taskApi } from '../api/tasks';

/**
 * Custom hook for task management
 */
export const useTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        next: null,
        previous: null,
        count: 0,
    });

    /**
     * Fetch tasks from API
     */
    const fetchTasks = useCallback(async (url = 'tasks/') => {
        setLoading(true);
        setError(null);

        try {
            const result = await taskApi.getTasks(url);

            if (result.success) {
                setTasks(result.data.results || []);
                setPagination({
                    next: result.data.next,
                    previous: result.data.previous,
                    count: result.data.count || 0,
                });
                return { success: true, data: result.data };
            }

            throw new Error(result.error?.detail || 'Failed to fetch tasks');

        } catch (err) {
            const errorMessage = err.message || 'An error occurred';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Create new task
     */
    const createTask = async (taskText) => {
        if (!taskText.trim()) {
            setError('Task cannot be empty');
            return { success: false, error: 'Task cannot be empty' };
        }

        setLoading(true);
        setError(null);

        try {
            const result = await taskApi.createTask({ task: taskText });

            if (result.success) {
                await fetchTasks(); // Refresh task list
                return {
                    success: true,
                    message: 'Task created successfully',
                    data: result.data,
                };
            }

            throw new Error(result.error?.task?.[0] || 'Failed to create task');

        } catch (err) {
            const errorMessage = err.message || 'An error occurred';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Update existing task
     */
    const updateTask = async (id, taskData) => {
        setLoading(true);
        setError(null);

        try {
            const result = await taskApi.updateTask(id, taskData);

            if (result.success) {
                await fetchTasks(); // Refresh task list
                return {
                    success: true,
                    message: 'Task updated successfully',
                    data: result.data,
                };
            }

            throw new Error(result.error?.task?.[0] || 'Failed to update task');

        } catch (err) {
            const errorMessage = err.message || 'An error occurred';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Delete task
     */
    const deleteTask = async (id) => {
        setLoading(true);
        setError(null);

        try {
            const result = await taskApi.deleteTask(id);

            if (result.success) {
                await fetchTasks(); // Refresh task list
                return {
                    success: true,
                    message: 'Task deleted successfully',
                };
            }

            throw new Error('Failed to delete task');

        } catch (err) {
            const errorMessage = err.message || 'An error occurred';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Toggle task completion status
     */
    const toggleTaskCompletion = async (task) => {
        setLoading(true);
        setError(null);

        try {
            const result = task.done
                ? await taskApi.markPending(task.id)
                : await taskApi.markComplete(task.id);

            if (result.success) {
                await fetchTasks(); // Refresh task list
                return {
                    success: true,
                    message: `Task marked as ${task.done ? 'pending' : 'complete'}`,
                };
            }

            throw new Error('Failed to update task status');

        } catch (err) {
            const errorMessage = err.message || 'An error occurred';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    return {
        // State
        tasks,
        loading,
        error,
        pagination,

        // Actions
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,

        // Helper functions
        clearError: () => setError(null),
        hasNextPage: !!pagination.next,
        hasPreviousPage: !!pagination.previous,
        totalTasks: pagination.count,
    };
};