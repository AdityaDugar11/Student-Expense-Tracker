# 💰 Student Expense Tracker

A simple full-stack web app for students to track their daily expenses — coffee ☕, travel 🚗, food 🍕 and more.

Built as a college project using **Node.js, Express, MongoDB Atlas**, and plain **HTML/CSS/JS**.

---

## 🚀 Features

- ➕ **Add Expenses** — Quickly log what you spent with category and date
- 📋 **View Expenses** — See all your expenses in a clean list, sorted by date
- 🗑️ **Delete Expenses** — Remove entries you don't need
- 💸 **Total Tracking** — See your total spending at a glance
- 🎨 **Scrollytelling Landing Page** — Cool 3D animated intro page with Three.js

---

## 🛠️ Tech Stack

| Technology | What it does |
|------------|--------------|
| HTML/CSS/JS | Frontend (no frameworks, just vanilla) |
| Node.js | JavaScript runtime for backend |
| Express.js | Web framework for API routes |
| MongoDB Atlas | Cloud database (free tier) |
| Three.js | 3D graphics on landing page |
| GSAP | Scroll animations |

---

## 📦 How to Set Up

### 1. Clone or download this project

```bash
git clone <your-repo-url>
cd expenses-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up MongoDB Atlas (Free)

1. Go to [mongodb.com](https://www.mongodb.com/atlas) and create a free account
2. Create a **free cluster** (M0 Sandbox)
3. Go to **Database Access** → Add a database user (username + password)
4. Go to **Network Access** → Add `0.0.0.0/0` (allow access from anywhere)
5. Go to **Databases** → Click **Connect** → Choose **Connect your application**
6. Copy the connection string

### 4. Create your `.env` file

Create a file called `.env` in the root folder:

```
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/expensetracker?retryWrites=true&w=majority
PORT=3000
```

Replace `yourusername`, `yourpassword`, and the cluster URL with your actual values.

### 5. Start the server

```bash
npm start
```

Or for development (auto-restart on changes):

```bash
npm run dev
```

### 6. Open in browser

Go to: [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
expenses tracker/
├── public/               # Frontend files
│   ├── index.html        # Scrollytelling landing page
│   ├── app.html          # Expense tracker app
│   ├── css/
│   │   ├── landing.css   # Landing page styles
│   │   └── app.css       # App page styles
│   └── js/
│       ├── landing.js    # 3D scene + scroll animations
│       └── app.js        # Expense CRUD logic
├── server.js             # Express server + API
├── package.json          # Dependencies
├── .env                  # MongoDB connection (not in git)
└── README.md             # This file
```

---

## 🌐 API Endpoints

| Method | Endpoint | What it does |
|--------|----------|--------------|
| GET | `/api/expenses` | Get all expenses |
| POST | `/api/expenses` | Add a new expense |
| DELETE | `/api/expenses/:id` | Delete an expense |

---

## 🚀 Free Deployment Options

- **Backend**: [Render.com](https://render.com) (free tier) or [Railway.app](https://railway.app)
- **Database**: MongoDB Atlas M0 (free forever)
- **Alternative**: [Vercel](https://vercel.com) with serverless functions

---

## 👨‍💻 Made By

A 1st Year Engineering Student — learning full stack development one project at a time 🎓

---
