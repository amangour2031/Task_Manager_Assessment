# Team Task Manager

A full-stack MERN application for collaborative team task management.

This project allows users to create projects, manage team members, assign tasks, track progress, and monitor project analytics through a professional dashboard.

---

# Features

## Authentication

* User Signup
* User Login
* JWT Authentication
* Protected Routes
* Public Route Guards

## Project Management

* Create Projects
* Add Members to Projects
* Remove Members
* Role-Based Access Control
* Admin and Member Roles

## Task Management

* Create Tasks
* Assign Tasks to Team Members
* Update Task Status
* Delete Tasks
* Task Priority Management
* Due Date Tracking

## Dashboard

* Total Tasks
* Tasks by Status
* Tasks Per User
* Overdue Tasks

## User Experience

* Responsive UI
* Sidebar Navigation
* Toast Notifications
* Professional Dashboard Layout

---

# Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* React Router DOM
* React Hot Toast

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs

## Deployment

* Railway

---

# Project Structure

Team_Task_Manager/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
└── README.txt

---

# Installation and Setup

## 1. Clone Repository

git clone <your-github-repository-url>

cd Team_Task_Manager

---

# Backend Setup

## Go to Server Folder

cd server

## Install Dependencies

npm install

## Create .env File

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

## Start Backend Server

npm run dev

Backend will run on:
[http://localhost:5000]

---

# Frontend Setup

## Go to Frontend Folder

cd frontend

## Install Dependencies

npm install

## Create .env File

VITE_API_URL=[http://localhost:5000/api]

## Start Frontend

npm run dev

Frontend will run on:
[http://localhost:5173]

---

# API Endpoints

## Authentication

* POST /api/auth/signup
* POST /api/auth/login

## Projects

* GET /api/projects
* POST /api/projects
* POST /api/projects/:projectId/members
* DELETE /api/projects/:projectId/members/:userId

## Tasks

* GET /api/tasks/project/:projectId
* POST /api/tasks
* PATCH /api/tasks/:taskId/status
* DELETE /api/tasks/:taskId

## Dashboard

* GET /api/dashboard/stats

---

# Role-Based Access

## Admin

* Create Projects
* Add or Remove Members
* Create Tasks
* Delete Tasks
* Manage Team Workflow

## Member

* View Assigned Tasks
* Update Task Status

---

# Deployment

## Backend Deployment

* Deploy backend folder on Railway
* Add environment variables
* Generate Railway domain

## Frontend Deployment

* Deploy frontend folder on Railway
* Add VITE_API_URL environment variable
* Connect frontend with backend URL

---

# Environment Variables

## Backend

PORT=
MONGO_URI=
JWT_SECRET=

## Frontend

VITE_API_URL=

---

# Important Concepts Used

* JWT Authentication
* REST APIs
* Role-Based Access Control
* MongoDB Relationships
* Protected Routes
* React Context API
* Axios Interceptors
* MERN Stack Architecture

---

# Future Improvements

* File Attachments
* Real-Time Notifications
* Team Chat
* Activity Logs
* Calendar Integration
* Drag and Drop Tasks

---

# Author

Developed as a Full-Stack MERN Assignment Project.
