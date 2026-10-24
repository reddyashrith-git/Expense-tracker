# 💰 Expense Tracker Application

A full-stack Expense Tracker application built with **React.js, Vite, Node.js, Express.js, and MongoDB**. It helps users manage income and expenses, track their financial balance, and visualize spending patterns through interactive charts and summaries.

## 🚀 Features

* **Transaction Management:** Add, view, and delete income and expense transactions.
* **Income and Expense Categorization:** Organize transactions by type and category.
* **Financial Dashboard:** View total income, total expenses, and current balance.
* **Monthly Summaries:** Retrieve financial summaries for a selected month and year.
* **Yearly Summaries:** Analyze total income, expenses, and financial activity for a selected year.
* **Interactive Charts:** Visualize expenses by category, compare income and expenses, and analyze monthly spending.
* **RESTful APIs:** Create, retrieve, update, and delete transactions through backend APIs.
* **Database Integration:** Store transaction data persistently in MongoDB.
* **Health Check API:** Check the backend's status and MongoDB connection.
* **Environment Configuration:** Keep configuration values in environment variables rather than hardcoding them into application code.

## 🛠️ Technology Stack

| Component          | Technologies                          |
| ------------------ | ------------------------------------- |
| Frontend           | React.js, Vite, HTML, CSS, JavaScript |
| Backend            | Node.js, Express.js                   |
| Database           | MongoDB                               |
| ODM                | Mongoose                              |
| API Communication  | Fetch API, REST APIs                  |
| Data Visualization | Recharts                              |
| Development Tools  | npm, VS Code, Postman                 |

## 📁 Project Structure

```text
Expense-Tracker/
├── .gitignore
├── README.md
│
├── backend/
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── src/
│       ├── models/
│       │   └── Transaction.js
│       ├── routes/
│       │   └── transactionRoutes.js
│       └── server.js
│
└── frontend/
    ├── .env.example
    ├── package.json
    ├── index.html
    ├── vite.config.js
    ├── public/
    └── src/
        ├── App.jsx
        ├── App.css
        ├── index.css
        └── main.jsx
```

*Note: This structure represents the main application files. Keep it synchronized with the files actually present in your project.*

## ⚙️ Prerequisites

Install the following before running the application:

1. **Node.js:** Version 18 or newer.
2. **npm:** Installed with Node.js.
3. **MongoDB:** A local MongoDB server or a MongoDB Atlas database.
4. **Git:** Required if you want to clone and manage the project using Git.

Check your Node.js and npm versions:

```bash
node -v
npm -v
```

## 📥 Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd Expense-Tracker
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

If you already have the project on your computer, open its folder in VS Code instead.

### 2. Configure the Backend

Open a terminal in VS Code and run:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder. Use the following configuration for a local MongoDB installation:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/expense_tracker
CLIENT_URL=http://localhost:5173
```

If you use MongoDB Atlas, replace the `MONGO_URI` value with your own Atlas connection string.

**Important:** Keep your actual `.env` file private. Do not commit database credentials or secrets to GitHub.

### 3. Configure the Frontend

Open a second terminal in VS Code and run:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` folder with:

```env
VITE_API_URL=http://localhost:5000/api
```

If the frontend already has a working `.env` file, keep its correct configuration.

## ▶️ Running the Application

Start MongoDB first if you are using a local MongoDB server. If you use Atlas, make sure your database connection is configured correctly.

### Start the Backend

In the first terminal:

```bash
cd backend
npm run dev
```

If your backend does not have a `dev` script, use the start command defined in `backend/package.json`, for example:

```bash
npm start
```

The backend should run on:

```text
http://localhost:5000
```

### Start the Frontend

In a second terminal:

```bash
cd frontend
npm run dev
```

Open the Vite URL in your browser:

```text
http://localhost:5173
```

You should now be able to use the Expense Tracker application.

## 🔌 API Endpoints

The backend provides REST APIs for managing transactions and retrieving financial summaries.

### Transaction APIs

| Method | Endpoint                | Description           |
| ------ | ----------------------- | --------------------- |
| GET    | `/api/transactions`     | Retrieve transactions |
| POST   | `/api/transactions`     | Create a transaction  |
| PUT    | `/api/transactions/:id` | Update a transaction  |
| DELETE | `/api/transactions/:id` | Delete a transaction  |

### Summary and Analytics APIs

| Method | Endpoint                                               | Description                          |
| ------ | ------------------------------------------------------ | ------------------------------------ |
| GET    | `/api/transactions/summary/monthly?year=2026&month=10` | Retrieve a monthly summary           |
| GET    | `/api/transactions/summary/yearly?year=2026`           | Retrieve a yearly summary            |
| GET    | `/api/transactions/summary/categories`                 | Retrieve category-based summary data |

### Health Check API

| Method | Endpoint      | Description                                      |
| ------ | ------------- | ------------------------------------------------ |
| GET    | `/api/health` | Check backend and database status, if configured |

**Note:** The health-check endpoint is available only if it is implemented in your current backend. API responses depend on your implementation and database contents.

## 📊 Data Visualization

The dashboard uses Recharts to display financial information through interactive charts, including:

* **Expenses by Category:** Understand how expenses are distributed across categories.
* **Income vs. Expenses:** Compare money received with money spent.
* **Monthly Spending:** Visualize spending patterns over time.

These charts help users understand their financial activity more easily.

## 🧪 Testing

The backend APIs can be tested using Postman or a web browser, depending on the endpoint.

Recommended checks:

* Retrieve existing transactions.
* Create an income transaction.
* Create an expense transaction.
* Update an existing transaction.
* Delete a transaction.
* Verify monthly and yearly summary responses.
* Verify category summary data.
* Check the dashboard charts.
* Refresh the page and confirm that saved transactions remain available.

## 🔒 Security and Configuration

* Environment-specific settings are stored in `.env` files.
* `.env` files and other sensitive configuration files should be excluded from Git using `.gitignore`.
* `.env.example` files should contain placeholder values only.
* CORS should be configured to allow requests from the intended frontend origin.
* Validate incoming API data and handle errors appropriately.

**Security note:** This project uses environment variables for configuration. This alone does not mean the application has comprehensive production-level security.

## 🔮 Future Improvements

* Add transaction editing directly from the dashboard.
* Add user authentication and individual accounts.
* Add date-range and category filters.
* Export financial reports to CSV or PDF.
* Add budgeting and spending-limit alerts.
* Deploy the frontend, backend, and database for online access.

## 👨‍💻 Project Information

Project: Expense Tracker Application
Type: Full-Stack Web Development Project
Purpose: Track income and expenses, calculate financial summaries, and visualize spending patterns.

---

Built using React.js, Node.js, Express.js, MongoDB, and Recharts.
