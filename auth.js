// User management
class Auth {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('users')) || [];
    }

    signup(email, password) {
        // Check if user already exists
        if (this.users.some(user => user.email === email)) {
            throw new Error('User already exists');
        }

        // Create new user
        const newUser = {
            email,
            password, // In a real app, this should be hashed
            tasks: []
        };

        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));
        this.currentUser = newUser;
        return newUser;
    }

    login(email, password) {
        const user = this.users.find(user => user.email === email && user.password === password);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        this.currentUser = user;
        return user;
    }

    logout() {
        this.currentUser = null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    updateUser(user) {
        const index = this.users.findIndex(u => u.email === user.email);
        if (index !== -1) {
            this.users[index] = user;
            localStorage.setItem('users', JSON.stringify(this.users));
            if (this.currentUser && this.currentUser.email === user.email) {
                this.currentUser = user;
            }
        }
    }
}

// Create a single instance of Auth
const auth = new Auth(); 