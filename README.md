# Virtual Hackathon Platform

This repository contains the source code for a full-stack Virtual Hackathon Platform. It provides a comprehensive environment for organizers to host events and for participants to collaborate, code, and compete in real-time.

The platform is built with a React frontend and a Node.js/Express backend, featuring a collaborative code editor, team management, project submissions, and an admin dashboard for event management.

## Features

### User Features
- **Authentication:** Secure user login and registration via Google OAuth.
- **Team Management:** Create new teams with unique invite codes or join existing ones.
- **Real-time Collaboration:**
    - Integrated team chat powered by Socket.IO.
    - Video call functionality to facilitate face-to-face communication.
- **Collaborative IDE:** A feature-rich, in-browser code editor based on Monaco Editor, complete with file tree navigation and a terminal interface.
- **Hackathon Participation:** Browse upcoming and past hackathons, view details, and register for events.
- **Project Submissions:** A dedicated portal for submitting project details, including GitHub repositories and live demo links.
- **Dynamic Dashboards:** Personalized dashboards for users to track their activities, teams, and events.
- **Profiles & Leaderboards:** View user profiles and track rankings on a global leaderboard.

### Admin Features
- **Secure Admin Login:** Separate authentication portal for administrators.
- **Admin Dashboard:** A centralized dashboard to view platform statistics, manage hackathons, and handle customer relations.
- **Hackathon Management:** Full CRUD (Create, Read, Update, Delete) functionality for managing hackathon events, including details, problem statements, and scheduling.
- **Customer Management:** Manage clients or sponsors associated with hackathons.

## Tech Stack

| Area      | Technology                                                                                                    |
| :-------- | :------------------------------------------------------------------------------------------------------------ |
| **Backend** | Node.js, Express, MongoDB, Mongoose, JWT (JSON Web Tokens), Socket.IO, Google OAuth                           |
| **Frontend**| React, Vite, Tailwind CSS, React Router, Framer Motion, Axios, Socket.IO Client, Monaco Editor                |
| **Database**| MongoDB                                                                                                       |

## Project Structure

The repository is a monorepo containing two main packages:

-   `frontend/`: The React-based client application built with Vite.
-   `backend/`: The Express.js server providing the REST API and WebSocket connections.

```
.
├── backend/        # Node.js, Express, MongoDB
│   ├── controllers/  # Request handling logic
│   ├── middleware/   # Custom middleware (e.g., auth)
│   ├── models/       # Mongoose data models
│   ├── routes/       # API route definitions
│   └── index.js      # Server entry point
└── frontend/       # React (Vite)
    ├── public/
    └── src/
        ├── assets/
        ├── components/   # Reusable UI components
        ├── contexts/     # State management (Auth, Toast)
        ├── layouts/      # Main application layout
        ├── pages/        # Route components
        └── utils/        # Utility functions (e.g., axios config)
```

## Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn
- MongoDB instance (local or cloud-based)

### Backend Setup
1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file** in the `backend` root directory. Copy the contents of `.env.example` (if available) or use the following template:
    ```env
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/hackathon_platform
    JWT_SECRET=your_jwt_secret_key
    SESSION_SECRET=your_session_secret_key

    # Google OAuth Credentials
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    GOOGLE_CALLBACK_URL=http://localhost:5000/api/users/auth/google/callback
    ```

4.  **Create an Admin User:** Run the following script to create a default admin user. You can modify the credentials in the script itself.
    ```bash
    node createAdmin.js
    ```

5.  **Start the backend server:**
    ```bash
    npm run dev
    ```
    The server will be running on `http://localhost:5000`.

### Frontend Setup
1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```
    The React application will be available at `http://localhost:5173`.

### Accessing the Application
-   **Frontend:** `http://localhost:5173`
-   **Backend API:** `http://localhost:5000`

## API Endpoints

The backend exposes a RESTful API for managing application data.

-   `POST /api/admin/auth` - Admin login.
-   `GET /api/admin/hackathons` - Get all hackathons (admin).
-   `GET /api/admin/customers` - Manage customers (admin).
-   `GET /api/users/auth/google` - Initiate Google OAuth login.
-   `POST /api/users/register` - Register a new user.
-   `GET /api/hackathons` - Get all hackathons.
-   `POST /api/hackathons/register` - Register a user for a hackathon.
-   `POST /api/teams` - Create a new team.
-   `POST /api/teams/join` - Join an existing team.
-   `POST /api/submissions` - Submit a project.

## License
This project is licensed under the ISC License.