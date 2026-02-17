# Expense-Tracker

# 💸 Expense Tracker

A full-stack expense management web app to help users track, visualize, and export their income and expenses. Built with the **MERN stack** (MongoDB, Express, React, Node.js).

---

## 🔗 Live Demo

* **Vercel Link**: [https://your-frontend-url.vercel.app](https://expense-tracker-qsq9.vercel.app/login)


---

## ✨ Features

1. Pagination in Expense and Income pages (5 transactions per page).
2. Overall transaction visualization using a Pie Chart.
3. Last 30 days expenses shown as a Bar Chart.
4. Last 60 days incomes shown as a Pie Chart.
5. Create, delete, view, and **download income/expense data as Excel files**.
6. Logging out clears token from localStorage (forces re-login).
7. JWT token persists for 1 day if not logged out (auto-login within 24h).

---

## dashboard page looks like : 
<p align="center" style="display: flex; gap: 10px; justify-content: center;">
  <img src="https://github.com/user-attachments/assets/df462143-2f56-4ccb-aad8-f1dfff9b6ef1" width="49%" style="border: 1px solid #ccc; padding: 6px; border-radius: 8px;" />
  <img src="https://github.com/user-attachments/assets/00131b46-d174-4444-8cb5-d8da84333863" width="49%" style="border: 1px solid #ccc; padding: 6px; border-radius: 8px;" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/81fb1823-2d7f-4f2e-b871-4a6c3818b953" width="50%" style="border: 1px solid #ccc; padding: 6px; border-radius: 8px;" />
</p>


## 🛠 Tech Stack

### Frontend

* React
* Axios
* React Router DOM
* Tailwind CSS
* Recharts (for charts)
* xlsx + FileSaver.js (for Excel downloads)

### Backend

* Node.js
* Express
* MongoDB + Mongoose
* JSON Web Token (JWT)
* bcrypt
* dotenv
* cors

---

## 📦 Installation & Setup

### 🚀 Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL= your frontend URL
```

Run the backend server:

```bash
npm start          # for production
npm run dev        # with auto-restart using nodemon
```

---

### 🚀 Frontend Setup

```bash
cd frontend
cd expense-tracker
npm install
```

Add server URL to frontend/expense-tracker/scr/utils/apiPaths
```.jsx
BASE_URL=YOUT_SERVER_URL
```

Run the React app:

```bash
npm run dev
```

---

## 🔐 Authentication

* JWT-based login system.
* Token stored in localStorage, valid for 24 hours.
* Protected routes using token in Authorization headers.

---

## 📊 Charts Overview

* **Pie Chart**: Income vs Expense summary.
* **Bar Chart**: Expenses over the last 30 days.
* **Pie Chart**: Incomes over the last 60 days.

---

## 📤 API Endpoints

### 🔒 Auth

* `POST /api/auth/register` — Register a user
* `POST /api/auth/login` — Authenticate user & get token

### 💰 Income

* `GET /api/income/get`
* `POST /api/income/add`
* `DELETE /api/income/:id`
* `GET /api/income/downloadexcel` — Download income as Excel

### 🧾 Expenses

* Same as income routes (`/api/expenses/...`)
* changed `Get /api/income/all`

---

