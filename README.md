# Perm_IT

Perm_IT is a full-stack web application designed to demonstrate robust Role-Based Access Control (RBAC). It includes a Node.js/Express backend API connected to MongoDB, and a React frontend that dynamically adjusts the UI and layout according to the authenticated user's role.

---

## 🚀 Features

- **JWT Authentication**: Secure login, registration, and session management using tokens and HTTP-only cookies.
- **Role-Based Access Control (RBAC)**: Supports `admin`, `manager`, and `user` roles to restrict and conditionally render features.
- **Dynamic Theming**: 
  - **Admin**: Dark theme
  - **Manager**: Light Green theme
  - **User**: Classic Blue theme
- **User Management System**: Allows admins and managers to seamlessly manage existing users, view audit information, list via paginated tables, and handle soft deletions.

---

## 🛠️ Technology Stack

**Frontend:**
- React (Create React App)
- React Router DOM (v6)
- React Bootstrap / Bootstrap (CSS & Components)
- React Context (Global Auth State Management)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (ODM)
- JSON Web Tokens (JWT) & bcryptjs (Security)

---

## ⚙️ Setup and Installation Instructions

To run this application locally, follow these steps:

### 1. Prerequisites
- [Node.js](https://nodejs.org/en/) installed on your machine.
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas connection URI.

### 2. Clone the Repository
```bash
git clone <repository_url>
cd Perm_It
```

### 3. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory. Include the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   JWT_REFRESH_SECRET=your_refresh_secret_key
   CLIENT_ORIGIN=http://localhost:3000
   NODE_ENV=development
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

### 4. Frontend Setup

1. Open a new terminal instance and navigate to the frontend directory from the root folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```

The frontend will start running at `http://localhost:3000`. It is pre-configured to point to the backend API running on `http://localhost:5000`.

---

## 🔐 Role Definitions & Access

1. **Admin (`admin`)**: Has global privileges. Can view all dashboard elements, manage all users (create, edit limits, delete), and access all system metrics.
2. **Manager (`manager`)**: Has restricted management power. Can view all users and update data for non-admin users. Cannot create or delete accounts.
3. **User (`user`)**: Can only view their own dashboard, access their profile, and modify their own basic information (e.g., name/password updates). 

## 📂 Project Structure

```bash
Perm_IT/
│
├── backend/                  # Express server
│   ├── config/               # Database connection strings/options
│   ├── controllers/          # Request handlers
│   ├── middleware/           # Auth and RBAC middleware
│   ├── model/                # Mongoose Database Models
│   ├── routes/               # API endpoint definitions
│   └── services/             # Business logic layer
│
└── frontend/                 # React Application
    ├── public/
    └── src/
        ├── components/       # Reusable UI & Route Guards (RoleRoute, ProtectedRoute)
        ├── context/          # React Context (AuthContext)
        ├── pages/            # Application Views (Login, Dashboard, UserManagement)
        └── services/         # API abstraction & fetch wrappers
```
## Demo Credentials
Admin:
Email: blastoise@permitums.com
Password: bigmanblastoise23

Manager:
Email: hameeda@permitums.com
Password: hameeda123

User:
Email: joyfranksebastian23@gmail.com
Password: joyfrank123