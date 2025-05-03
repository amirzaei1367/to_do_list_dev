// Task management
class TaskManager {
    constructor() {
        this.tasks = [];
    }

    addTask(text) {
        const task = {
            id: Date.now(),
            text,
            completed: false
        };
        this.tasks.push(task);
        this.saveTasks();
        return task;
    }

    toggleTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
        }
        return task;
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
    }

    getTasks() {
        return this.tasks;
    }

    saveTasks() {
        const user = auth.getCurrentUser();
        if (user) {
            user.tasks = this.tasks;
            auth.updateUser(user);
        }
    }

    loadTasks() {
        const user = auth.getCurrentUser();
        if (user) {
            this.tasks = user.tasks || [];
        }
    }
}

// Create a single instance of TaskManager
const taskManager = new TaskManager(); 