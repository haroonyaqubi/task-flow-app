import { useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/auth';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check authentication status
    const isAuthenticated = useCallback(() => {
        return authApi.isAuthenticated();
    }, []);

    // Check if user is admin
    const isAdmin = useCallback(() => {
        const storedUser = authApi.getStoredUser();
        return storedUser?.est_admin || false;
    }, []);

    // Login function
    const login = async (username, password) => {
        setLoading(true);
        setError(null);

        try {
            const result = await authApi.login({ username, password });

            if (!result.success) {
                throw new Error(result.error?.detail || 'Login failed');
            }

            const { access, refresh } = result.data;
            localStorage.setItem('access', access);
            localStorage.setItem('refresh', refresh);

            // Get user info
            const userResult = await authApi.getCurrentUser();
            if (userResult.success) {
                const userData = userResult.data;
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('is_staff', userData.est_admin || false);
                setUser(userData);

                return {
                    success: true,
                    user: userData,
                    message: 'Login successful',
                };
            }

            throw new Error('Failed to get user information');

        } catch (err) {
            const errorMessage = err.message || 'An error occurred during login';
            setError(errorMessage);
            return {
                success: false,
                error: errorMessage,
            };
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = useCallback(() => {
        authApi.logout();
        setUser(null);
        setError(null);
        window.location.href = '/login';
    }, []);

    // Register function
    const register = async (userData) => {
        setLoading(true);
        setError(null);

        try {
            const result = await authApi.register(userData);

            if (result.success) {
                return {
                    success: true,
                    message: 'Registration successful. Please login.',
                };
            }

            throw new Error(result.error || 'Registration failed');

        } catch (err) {
            const errorMessage = err.message || 'An error occurred during registration';
            setError(errorMessage);
            return {
                success: false,
                error: errorMessage,
            };
        } finally {
            setLoading(false);
        }
    };

    // Load user on mount
    useEffect(() => {
        const loadUser = async () => {
            if (isAuthenticated()) {
                try {
                    const result = await authApi.getCurrentUser();
                    if (result.success) {
                        const userData = result.data;
                        localStorage.setItem('user', JSON.stringify(userData));
                        setUser(userData);
                    } else {
                        // Token might be invalid, logout
                        logout();
                    }
                } catch (err) {
                    console.error('Failed to load user:', err);
                    logout();
                }
            }
            setLoading(false);
        };

        loadUser();
    }, [isAuthenticated, logout]);

    return {
        // State
        user,
        loading,
        error,

        // Actions
        login,
        logout,
        register,

        // Getters
        isAuthenticated: isAuthenticated(),
        isAdmin: isAdmin(),

        // Setters
        setError,
        clearError: () => setError(null),
    };
};