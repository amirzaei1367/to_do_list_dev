// User management
class Auth {
    constructor() {
        this.currentUser = null;
    }

    getCookie(name) {
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

    signup(username, email, password) {
        return fetch('/api/users/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': this.getCookie('csrftoken')
            },
            credentials: 'include',
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'Failed to sign up');
                });
            }
            return response.json();
        })
        .then(user => {
            this.currentUser = user;
            return user;
        });
    }

    login(username, password) {
        return fetch('/api/users/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': this.getCookie('csrftoken')
            },
            credentials: 'include',
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'Invalid credentials');
                });
            }
            return response.json();
        })
        .then(user => {
            this.currentUser = user;
            return user;
        });
    }

    logout() {
        return fetch('/api/users/logout/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': this.getCookie('csrftoken')
            },
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to logout');
            }
            this.currentUser = null;
        });
    }

    getCurrentUser() {
        return this.currentUser;
    }

    checkAuth() {
        return fetch('/api/users/me/', {
            headers: {
                'X-CSRFToken': this.getCookie('csrftoken')
            },
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                this.currentUser = null;
                return null;
            }
            return response.json();
        })
        .then(user => {
            this.currentUser = user;
            return user;
        });
    }
}

// Create a single instance of Auth
const auth = new Auth(); 