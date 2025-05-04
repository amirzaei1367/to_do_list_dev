// Task management
class TaskManager {
    constructor() {
        this.tasks = [];
    }

    addTask(text) {
        return fetch('/api/tasks/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': auth.getCookie('csrftoken')
            },
            credentials: 'include',
            body: JSON.stringify({ title: text })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add task');
            }
            return response.json();
        })
        .then(task => {
            this.tasks.push(task);
            return task;
        });
    }

    toggleTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (!task) return Promise.reject(new Error('Task not found'));

        return fetch(`/api/tasks/${id}/toggle_complete/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': auth.getCookie('csrftoken')
            },
            credentials: 'include',
            body: JSON.stringify({ completed: !task.completed })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'Failed to toggle task');
                });
            }
            return response.json();
        })
        .then(updatedTask => {
            const index = this.tasks.findIndex(t => t.id === id);
            if (index !== -1) {
                this.tasks[index] = updatedTask;
            }
            return updatedTask;
        });
    }

    deleteTask(id) {
        return fetch(`/api/tasks/${id}/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': auth.getCookie('csrftoken')
            },
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete task');
            }
            this.tasks = this.tasks.filter(task => task.id !== id);
        });
    }

    getTasks() {
        return fetch('/api/tasks/', {
            headers: {
                'X-CSRFToken': auth.getCookie('csrftoken')
            },
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            return response.json();
        })
        .then(tasks => {
            this.tasks = tasks;
            return tasks;
        });
    }
}

// Create a single instance of TaskManager
const taskManager = new TaskManager(); 