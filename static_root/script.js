document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const authContainer = document.getElementById('auth-container');
    const taskContainer = document.getElementById('task-container');
    const authForm = document.getElementById('auth-form');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Event Listeners
    authForm.addEventListener('submit', handleAuth);
    signupBtn.addEventListener('click', toggleAuthMode);
    logoutBtn.addEventListener('click', handleLogout);
    taskForm.addEventListener('submit', handleAddTask);

    // Check if user is already logged in
    if (auth.getCurrentUser()) {
        showTaskInterface();
    }

    function handleAuth(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const endpoint = loginBtn.textContent === 'Login' ? '/users/login/' : '/users/register/';
        const data = {
            username: email, // Using email as username
            email: email,
            password: password
        };

        console.log('Sending request to:', endpoint, 'with data:', data);

        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            credentials: 'include',
            body: JSON.stringify(data)
        })
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                return response.json().then(err => { 
                    console.error('Error response:', err);
                    throw new Error(err.error || 'Authentication failed'); 
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Success response:', data);
            showTaskInterface();
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.message);
        });
    }

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function toggleAuthMode() {
        if (loginBtn.textContent === 'Login') {
            loginBtn.textContent = 'Sign Up';
            signupBtn.textContent = 'Back to Login';
        } else {
            loginBtn.textContent = 'Login';
            signupBtn.textContent = 'Sign Up';
        }
    }

    function handleLogout() {
        fetch('/users/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Logout failed');
            }
            showAuthInterface();
        })
        .catch(error => {
            alert(error.message);
        });
    }

    function handleAddTask(e) {
        e.preventDefault();
        const text = taskInput.value.trim();
        if (text) {
            taskManager.addTask(text)
                .then(() => {
                    taskInput.value = '';
                    return taskManager.getTasks();
                })
                .then(() => renderTasks())
                .catch(error => alert(error.message));
        }
    }

    function showAuthInterface() {
        authContainer.classList.remove('d-none');
        taskContainer.classList.add('d-none');
    }

    function showTaskInterface() {
        authContainer.classList.add('d-none');
        taskContainer.classList.remove('d-none');
        taskManager.getTasks()
            .then(() => renderTasks())
            .catch(error => alert(error.message));
    }

    function renderTasks() {
        taskList.innerHTML = '';
        taskManager.tasks.forEach(task => {
            const taskElement = renderTask(task);
            taskList.appendChild(taskElement);
        });
    }

    function renderTask(task) {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" ${task.completed ? 'checked' : ''}>
                <label class="form-check-label ${task.completed ? 'text-decoration-line-through' : ''}">
                    ${task.title}
                </label>
            </div>
            <button class="btn btn-danger btn-sm">Delete</button>
        `;

        const checkbox = li.querySelector('.form-check-input');
        const deleteBtn = li.querySelector('.btn-danger');

        checkbox.addEventListener('change', () => {
            taskManager.toggleTask(task.id)
                .then(() => renderTasks())
                .catch(error => alert(error.message));
        });

        deleteBtn.addEventListener('click', () => {
            taskManager.deleteTask(task.id)
                .then(() => renderTasks())
                .catch(error => alert(error.message));
        });

        return li;
    }
}); 