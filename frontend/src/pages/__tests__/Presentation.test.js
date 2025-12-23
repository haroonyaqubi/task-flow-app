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

    test('3. Task Filtering and Statistics', () => {
        const tasks = [
            { id: 1, text: 'Task 1', completed: true },
            { id: 2, text: 'Task 2', completed: false },
            { id: 3, text: 'Task 3', completed: false },
            { id: 4, text: 'Task 4', completed: true },
            { id: 5, text: 'Task 5', completed: false }
        ];

        // Filter functions
        const getCompletedTasks = () => tasks.filter(t => t.completed);
        const getPendingTasks = () => tasks.filter(t => !t.completed);
        const getCompletionRate = () => {
            const completed = getCompletedTasks().length;
            return Math.round((completed / tasks.length) * 100);
        };

        const completed = getCompletedTasks();
        const pending = getPendingTasks();
        const rate = getCompletionRate();

        expect(completed).toHaveLength(2);
        expect(pending).toHaveLength(3);
        expect(rate).toBe(40); // 2 out of 5 = 40%
        expect(completed[0].text).toBe('Task 1');
        expect(pending[1].text).toBe('Task 3');
    });

    test('4. Form Validation Logic', () => {
        const validateTaskForm = (taskData) => {
            const errors = {};

            if (!taskData.title || taskData.title.trim().length === 0) {
                errors.title = 'Task title is required';
            } else if (taskData.title.length < 3) {
                errors.title = 'Task title must be at least 3 characters';
            }

            if (taskData.title && taskData.title.length > 200) {
                errors.title = 'Task title cannot exceed 200 characters';
            }

            return {
                isValid: Object.keys(errors).length === 0,
                errors: errors
            };
        };

        // Test cases
        const emptyTitle = validateTaskForm({ title: '' });
        const shortTitle = validateTaskForm({ title: 'ab' });
        const validTitle = validateTaskForm({ title: 'Complete project documentation' });
        const longTitle = validateTaskForm({ title: 'a'.repeat(201) });

        expect(emptyTitle.isValid).toBe(false);
        expect(emptyTitle.errors.title).toBe('Task title is required');

        expect(shortTitle.isValid).toBe(false);
        expect(shortTitle.errors.title).toBe('Task title must be at least 3 characters');

        expect(validTitle.isValid).toBe(true);
        expect(validTitle.errors).toEqual({});

        expect(longTitle.isValid).toBe(false);
        expect(longTitle.errors.title).toBe('Task title cannot exceed 200 characters');
    });

    test('5. Search Functionality', () => {
        const tasks = [
            { id: 1, text: 'Buy groceries', category: 'personal' },
            { id: 2, text: 'Finish React project', category: 'work' },
            { id: 3, text: 'Call dentist', category: 'personal' },
            { id: 4, text: 'Prepare presentation', category: 'work' }
        ];

        const searchTasks = (query, category = null) => {
            let results = tasks.filter(task =>
                task.text.toLowerCase().includes(query.toLowerCase())
            );

            if (category) {
                results = results.filter(task => task.category === category);
            }

            return results;
        };

        // Test search
        const workTasks = searchTasks('', 'work');
        const reactTasks = searchTasks('react');
        const personalGroceries = searchTasks('groceries', 'personal');
        const noResults = searchTasks('nonexistent');

        expect(workTasks).toHaveLength(2);
        expect(workTasks[0].text).toBe('Finish React project');

        expect(reactTasks).toHaveLength(1);
        expect(reactTasks[0].category).toBe('work');

        expect(personalGroceries).toHaveLength(1);
        expect(personalGroceries[0].id).toBe(1);

        expect(noResults).toHaveLength(0);
    });
});