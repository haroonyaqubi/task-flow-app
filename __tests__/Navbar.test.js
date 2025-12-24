// Navbar.test.js
// Task Flow - Presentation Tests
// Demonstrates testing setup and application logic

describe('Task Flow Application - Presentation Tests', () => {

    test('1. Core Application Logic - Task Operations', () => {
        // Simulate task operations
        const tasks = [];

        const addTask = (text) => {
            tasks.push({
                id: Date.now(),
                text: text,
                completed: false,
                createdAt: new Date()
            });
            return tasks[tasks.length - 1];
        };

        const completeTask = (taskId) => {
            const task = tasks.find(t => t.id === taskId);
            if (task) task.completed = true;
            return task;
        };

        // Test adding tasks
        const task1 = addTask('Learn React');
        const task2 = addTask('Build Task Flow');

        expect(tasks).toHaveLength(2);
        expect(task1.text).toBe('Learn React');
        expect(task2.completed).toBe(false);

        // Test completing a task
        const completedTask = completeTask(task1.id);
        expect(completedTask.completed).toBe(true);
    });

    test('2. User Authentication Simulation', () => {
        // Simulate user database
        const users = [
            { username: 'alice', password: 'alice123', role: 'user' },
            { username: 'bob', password: 'bob456', role: 'admin' }
        ];

        const authenticate = (username, password) => {
            const user = users.find(u =>
                u.username === username && u.password === password
            );
            return user ? { success: true, user } : { success: false, error: 'Invalid credentials' };
        };

        // Test valid login
        const validLogin = authenticate('alice', 'alice123');
        expect(validLogin.success).toBe(true);
        expect(validLogin.user.username).toBe('alice');

        // Test invalid login
        const invalidLogin = authenticate('alice', 'wrongpass');
        expect(invalidLogin.success).toBe(false);
        expect(invalidLogin.error).toBe('Invalid credentials');

        // Test non-existent user
        const nonExistent = authenticate('charlie', 'pass123');
        expect(nonExistent.success).toBe(false);
    });

    // ... (keep the rest of your test code exactly as you had it)
    // Just make sure this is in a separate .test.js file, NOT in Navbar.js
});