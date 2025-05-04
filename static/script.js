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
    const emailContainer = document.getElementById('email-container');
    const emailInput = document.getElementById('email');

    let isSignupMode = false;

    // Event Listeners
    authForm.addEventListener('submit', handleAuth);
    signupBtn.addEventListener('click', toggleAuthMode);
    logoutBtn.addEventListener('click', handleLogout);
    taskForm.addEventListener('submit', handleAddTask);

    // Check if user is already logged in
    auth.checkAuth()
        .then(user => {
            if (user) {
                showTaskInterface();
            }
        })
        .catch(error => {
            console.error('Auth check error:', error);
        });

    function handleAuth(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (isSignupMode) {
            const email = emailInput.value;
            if (!email) {
                alert('Email is required for signup');
                return;
            }
            auth.signup(username, email, password)
                .then(() => {
                    showTaskInterface();
                })
                .catch(error => {
                    console.error('Signup error:', error);
                    alert(error.message);
                });
        } else {
            auth.login(username, password)
                .then(() => {
                    showTaskInterface();
                })
                .catch(error => {
                    console.error('Login error:', error);
                    alert(error.message);
                });
        }
    }

    function toggleAuthMode() {
        isSignupMode = !isSignupMode;
        if (isSignupMode) {
            loginBtn.textContent = 'Sign Up';
            signupBtn.textContent = 'Back to Login';
            emailContainer.style.display = 'block';
            emailInput.required = true;
        } else {
            loginBtn.textContent = 'Login';
            signupBtn.textContent = 'Sign Up';
            emailContainer.style.display = 'none';
            emailInput.required = false;
        }
    }

    function handleLogout() {
        auth.logout()
            .then(() => {
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
        // Sort tasks: incomplete first, then completed
        const sortedTasks = [...taskManager.tasks].sort((a, b) => {
            if (a.completed === b.completed) return 0;
            return a.completed ? 1 : -1;
        });
        sortedTasks.forEach(task => {
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
                <span class="task-text ${task.completed ? 'text-decoration-line-through' : ''}">
                    ${task.title}
                </span>
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