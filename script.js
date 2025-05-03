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

        try {
            if (loginBtn.textContent === 'Login') {
                auth.login(email, password);
            } else {
                auth.signup(email, password);
            }
            showTaskInterface();
        } catch (error) {
            alert(error.message);
        }
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
        auth.logout();
        showAuthInterface();
    }

    function handleAddTask(e) {
        e.preventDefault();
        const text = taskInput.value.trim();
        if (text) {
            const task = taskManager.addTask(text);
            renderTask(task);
            taskInput.value = '';
        }
    }

    function showAuthInterface() {
        authContainer.classList.remove('d-none');
        taskContainer.classList.add('d-none');
        authForm.reset();
    }

    function showTaskInterface() {
        authContainer.classList.add('d-none');
        taskContainer.classList.remove('d-none');
        taskManager.loadTasks();
        renderTasks();
    }

    function renderTasks() {
        taskList.innerHTML = '';
        taskManager.getTasks().forEach(task => renderTask(task));
    }

    function renderTask(task) {
        const li = document.createElement('li');
        li.className = 'list-group-item task-item';
        if (task.completed) {
            li.classList.add('completed');
        }

        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <p class="task-text">${task.text}</p>
            <button class="btn btn-sm btn-danger delete-btn">Delete</button>
        `;

        const checkbox = li.querySelector('.task-checkbox');
        const deleteBtn = li.querySelector('.delete-btn');

        checkbox.addEventListener('change', () => {
            taskManager.toggleTask(task.id);
            li.classList.toggle('completed');
        });

        deleteBtn.addEventListener('click', () => {
            taskManager.deleteTask(task.id);
            li.remove();
        });

        taskList.appendChild(li);
    }
}); 