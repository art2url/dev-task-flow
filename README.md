# DevTaskFlow

DevTaskFlow is a task management application built with Angular and Node.js, featuring user authentication, task filtering, sorting, and management capabilities. The app includes login, registration, password recovery, and authentication guards for secured access.

## Features

### ✅ Task Management

- Add, edit, delete, and complete tasks
- Task priority system (Low, Medium, High)
- Task filtering by completion status, priority, and overdue deadlines
- Task sorting by date and priority
- Task searching
- Pinned tasks feature
- Pagination for tasks

### ✅ Authentication

- User registration and login using MongoDB
- Password hashing with bcrypt
- JWT-based authentication with token storage
- Forgot password feature (sends a new password via email)
- Route guard to protect task management routes
- Logout functionality

### ✅ UI & UX

- Angular Material design
- Responsive UI with dynamic theme switching
- Dark/White mode toggle
- Form validation with proper error handling
- Preloaders for login, registration, and password recovery
- Confirmation dialogs for critical actions (e.g., deleting all tasks)
- Navigation Menu for better usability

### ✅ Automated Testing & CI/CD

- **Unit Testing:** Jasmine & Karma for frontend unit tests
- **Continuous Integration:** GitHub Actions runs automated unit tests
- **Deployment Checks:** Vercel deploys only if tests pass
- **Test Reports:** JUnit reports uploaded to GitHub Actions

## Tech Stack

- **Frontend:** Angular 16, Angular Material
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Authentication:** JWT, bcrypt.js
- **Email Service:** Nodemailer with AOL SMTP
- **Hosting:** Vercel (Frontend), Render (Backend)
- **Testing & CI/CD:** Jasmine, Karma, GitHub Actions

## Installation & Setup

### Backend Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/art2url/dev-task-flow-auth-server.git
   cd dev-task-flow-auth-server
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root directory and add:
   ```env
   MONGO_URI=your-mongodb-connection-string
   JWT_SECRET=your-secret-key
   EMAIL_USER=your-email@example.com
   EMAIL_PASS=your-email-password
   PORT=3000
   ```
4. Start the server:
   ```sh
   npm start
   ```
   The server will run at `http://localhost:3000`.

### Frontend Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/art2url/dev-task-flow.git
   cd dev-task-flow
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the application:
   ```sh
   ng serve
   ```
   The app will run at `http://localhost:4200`.

## Deployment

- **Frontend:** Hosted on Vercel at [https://dev-task-flow.vercel.app](https://dev-task-flow.vercel.app)
- **Backend:** Hosted on Render at [https://dev-task-flow-auth-server.onrender.com](https://dev-task-flow-auth-server.onrender.com)
- **GitHub Actions:** Runs unit tests before deployment

## Routes

### Backend API Endpoints

| Method | Endpoint           | Description                       |
| ------ | ------------------ | --------------------------------- |
| `POST` | `/register`        | Register a new user               |
| `POST` | `/login`           | Login user & return JWT           |
| `POST` | `/forgot-password` | Send a new password to user email |
| `GET`  | `/tasks`           | Fetch all tasks for the user      |
| `POST` | `/tasks`           | Create a new task                 |
| `PUT`  | `/tasks/:taskId`   | Update a task by ID               |
| `DELETE` | `/tasks/:taskId` | Delete a task by ID               |
| `DELETE` | `/tasks`         | Delete all tasks for the user     |

### Frontend Routes

| Path               | Component               | Description                   |
| ------------------ | ----------------------- | ----------------------------- |
| `/tasks`           | TaskListComponent       | Main task manager (protected) |
| `/login`           | LoginComponent          | User login page               |
| `/register`        | RegisterComponent       | User registration page        |
| `/forgot-password` | ForgotPasswordComponent | Password reset page           |

## Contributing

Pull requests are welcome! Please ensure your changes align with the existing architecture and maintain code quality.

## License

This project is licensed under the MIT License.
