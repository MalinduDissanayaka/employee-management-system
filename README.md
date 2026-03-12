# Employee Management System

A full-stack web application for managing employee records, built with **FastAPI** (Python) for the backend and **React + Vite** for the frontend.

---

## Features

- User registration and login with JWT authentication
- Protected employee routes (only logged-in users can access)
- Add, edit, delete, and view employees
- Persistent data with SQLite database
- Responsive UI styled with Tailwind CSS

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 19, Vite, Tailwind CSS v4, Axios, React Router v7 |
| Backend   | FastAPI, SQLAlchemy, SQLite          |
| Auth      | JWT (python-jose), bcrypt            |

---

## Project Structure

```
employee-management-system/
├── backend/
│   ├── requirements.txt
│   └── app/
│       ├── __init__.py
│       ├── main.py        # FastAPI routes
│       ├── models.py      # SQLAlchemy models
│       ├── schemas.py     # Pydantic schemas
│       ├── crud.py        # Database operations
│       ├── auth.py        # JWT + password hashing
│       └── database.py    # DB connection setup
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── context/
        │   └── AuthContext.jsx
        └── components/
            ├── Login.jsx
            ├── Register.jsx
            ├── Navbar.jsx
            ├── EmployeeTable.jsx
            └── EmployeeForm.jsx
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 20+
- npm

---

### Backend Setup

```bash
# 1. Navigate to the backend folder
cd backend

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Start the FastAPI server
python -m uvicorn app.main:app --reload --port 8000
```

The API will be running at: `http://localhost:8000`  
Interactive API docs: `http://localhost:8000/docs`

---

### Frontend Setup

```bash
# 1. Navigate to the frontend folder
cd frontend

# 2. Install Node dependencies
npm install

# 3. Start the Vite dev server
npm run dev
```

The app will be running at: `http://localhost:5173`

---

## API Endpoints

### Auth

| Method | Endpoint    | Description              | Auth Required |
|--------|-------------|--------------------------|---------------|
| POST   | `/register` | Register a new user      | No            |
| POST   | `/login`    | Login and get JWT token  | No            |

### Employees

| Method | Endpoint              | Description          | Auth Required |
|--------|-----------------------|----------------------|---------------|
| GET    | `/employees/`         | List all employees   | Yes           |
| POST   | `/employees/`         | Create employee      | Yes           |
| PUT    | `/employees/{id}`     | Update employee      | Yes           |
| DELETE | `/employees/{id}`     | Delete employee      | Yes           |

---

## Usage

1. Open `http://localhost:5173` in your browser.
2. Click **Register** to create a new account.
3. Login with your credentials — you will be redirected to the Employees page.
4. Use the form to **add**, **edit**, or **delete** employees.
5. Click **Logout** in the navbar to sign out.

---

## Environment Notes

- The SQLite database file (`employees.db`) is created automatically inside the `backend/` folder on first run.
- The default JWT token expiry is **60 minutes**.
- CORS is configured to allow requests from `http://localhost:5173` (Vite dev server).
