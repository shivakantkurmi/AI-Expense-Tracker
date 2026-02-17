<p align="center">
  <img src="https://github.com/user-attachments/assets/c8561d24-7053-41f1-bb55-423e3b620c14" width="100" height="100" alt="AI Expense Tracker Logo">
  <h1 align="center">AI Expense Tracker</h1>
</p>
A full-stack expense management web app to help users track, visualize, and export their income and expenses. Built with the **MERN stack** (MongoDB, Express, React, Node.js).

---

## 🔗 Live Demo

* **Vercel Link**: [https://your-frontend-url.vercel.app](https://ai-expense-tracker-frontend.vercel.app)


---

## ✨ Features

1. Pagination in Expense and Income pages (5 transactions per page).
2. Overall transaction visualization using a Pie Chart.
3. Last 30 days expenses shown as a Bar Chart.
4. Last 60 days incomes shown as a Pie Chart.
5. Create, delete, view, and **download income/expense data as Excel files**.
6. Logging out clears token from localStorage (forces re-login).
7. JWT token persists for 1 day if not logged out (auto-login within 24h).
8. **🤖 AI Financial Advisor** - Intelligent chatbot powered by Google Generative AI that:
   - Analyzes your expense and income patterns
   - Provides personalized financial advice
   - Understands time period queries ("last month", "2 months", etc.)
   - Calculates savings rates and spending insights
   - Available as a floating chat widget in the bottom-right corner
9. User profile management - Edit profile information and track account details.
10. Cookie-based authentication - Secure JWT token storage.

---

## dashboard page looks like : 
<p align="center" style="display: flex; gap: 10px; justify-content: center;">

  <img src="https://github.com/user-attachments/assets/1d1c74ed-6ec5-4044-9c8a-fc93e1d3270a" width="49%" style="border: 1px solid #ccc; padding: 6px; border-radius: 8px;" />
  <img src="https://github.com/user-attachments/assets/6a7cc4e6-06e2-487d-b5af-48b12d3c85af" " width="49%" style="border: 1px solid #ccc; padding: 6px; border-radius: 8px;" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/e28f4c5a-d855-49dc-ad7b-f52137dd1536" width="50%" style="border: 1px solid #ccc; padding: 6px; border-radius: 8px;" />
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
* Google Generative AI SDK (for AI Advisor feature)

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
CLIENT_URL=your_frontend_url
GOOGLE_API_KEY=your_google_generative_ai_api_key
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
* Token stored in cookies, valid for 24 hours.
* Protected routes using token in Authorization headers.

---

## 🤖 AI Financial Advisor

The app includes an intelligent AI Financial Advisor powered by Google Generative AI (Gemini 2.5 Flash model):

**Features:**
- **Smart Data Analysis**: Analyzes your recent transactions to provide personalized insights
- **Time Period Understanding**: Asks about "last month", "2 months", "3 weeks", etc., and automatically adjusts the analysis
- **Savings Insights**: Calculates savings rate and highlights top spending categories
- **Easy Access**: Available as a floating chat widget in the bottom-right corner of any authenticated page
- **Markdown Formatting**: Responses include formatted text, emojis, and structured advice

**How to Use:**
1. Navigate to any dashboard page after logging in
2. Look for the floating chat button in the bottom-right corner
3. Click to open the advisor
4. Ask questions like:
   - "How are my expenses trending?"
   - "What's my savings rate this month?"
   - "Where am I overspending?"
   - "How did I do in the last 3 months?"

**Setup:**
Add `GOOGLE_API_KEY` to your `.env` file:
```env
GOOGLE_API_KEY=your_google_generative_ai_key
```

Get your API key from [Google AI Studio](https://aistudio.google.com/apikey)

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

### � User Profile

* `GET /api/user/profile` — Get user profile information
* `PUT /api/user/profile` — Update user profile (name, etc.)

### 💰 Income

* `GET /api/income/get`
* `POST /api/income/add`
* `DELETE /api/income/:id`
* `GET /api/income/downloadexcel` — Download income as Excel

### 🧾 Expenses

* Same as income routes (`/api/expenses/...`)
* `GET /api/expenses/all`

### 🤖 AI Advisor

* `POST /api/user/advisor` — Get AI financial advice based on user's financial data

---

