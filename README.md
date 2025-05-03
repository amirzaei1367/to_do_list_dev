# To-Do List Application

A simple to-do list application built with HTML, CSS, and JavaScript. The application uses browser's localStorage to persist user data and tasks.

## Features

- User Authentication (Sign up/Login)
- Create, complete, and delete tasks
- Persistent storage using browser's localStorage
- Responsive design using Bootstrap
- Clean and intuitive user interface

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6)
- Bootstrap 5
- Browser localStorage

## How to Use

1. Open `index.html` in a web browser
2. Sign up with an email and password
3. Start adding tasks
4. Mark tasks as complete by checking the checkbox
5. Delete tasks using the delete button
6. Log out when done

## Project Structure

- `index.html` - Main HTML file
- `styles.css` - Custom styles
- `auth.js` - Authentication related functions
- `tasks.js` - Task management functions
- `script.js` - Main application logic

## Note

This is a client-side only application, so the data is stored in the browser's localStorage. In a production environment, you would want to:

1. Hash passwords before storing them
2. Use a proper backend server for data storage
3. Implement proper security measures
4. Add input validation and sanitization
