<div align="center">

# MIRA AI by Maryam 🦋

**An AI-powered MERN Stack personal growth platform for mood journaling, habit tracking, goals, analytics, and personalized wellness coaching.**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

*Built for self-growth, reflection, and intelligent daily wellness.*

</div>

---

## ✨ Introduction

**MIRA AI** is a full-stack personal growth assistant that combines modern web development with AI-driven insights. Users can journal moods, build habits, set goals, explore analytics, and interact with a **Digital Twin** — all within a beautiful, responsive interface with **multilingual support** and **dark/light themes**.

Designed as a portfolio-grade MERN application, MIRA AI demonstrates real-world features including JWT authentication, Google OAuth, REST APIs, AI integration, and a polished SaaS-style user experience.

---

## 🚀 Key Features

| Feature | Description |
|---------|-------------|
| 🧠 **AI Personalized Coaching** | Intelligent wellness chat with memory and contextual guidance |
| 📔 **Mood Journaling** | Rich journal entries with mood tracking and AI analysis |
| 🌱 **Habit Tracking** | Build and monitor daily habits with streaks and categories |
| 🎯 **Goal Management** | Set, track, and achieve personal growth goals |
| 📊 **Analytics Dashboard** | Visual insights into mood patterns and progress over time |
| 🤖 **Digital Twin System** | AI-powered digital self for reflection and decision support |
| 🌍 **Multi-language Support** | English, Urdu, Arabic, Hindi, Spanish, and more |
| 🌓 **Dark / Light Theme** | Premium glassmorphism UI with theme switching |
| 🔐 **Authentication System** | JWT auth, Google OAuth, and password reset flow |
| 🦋 **Custom Avatar System** | Personalized avatars with presets and upload support |
| 📱 **Responsive UI** | Optimized for mobile, tablet, and desktop |

---

## 🛠 Tech Stack

### Frontend

![React](https://img.shields.io/badge/React.js-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![CSS](https://img.shields.io/badge/CSS-1572B6?style=flat-square&logo=css3&logoColor=white)

### Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat-square&logo=mongodb&logoColor=white)

### Other

![JWT](https://img.shields.io/badge/JWT_Authentication-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![AI](https://img.shields.io/badge/AI_Integration-412991?style=flat-square&logo=openai&logoColor=white)
![REST](https://img.shields.io/badge/REST_APIs-FF6C37?style=flat-square&logo=postman&logoColor=white)

---

## 🏗 MERN Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (React + Vite)                │
│  Pages · Components · Context · i18n · Theme · API Client   │
└─────────────────────────────┬───────────────────────────────┘
                              │  REST API (JSON)
                              │  JWT Bearer Token
┌─────────────────────────────▼───────────────────────────────┐
│                     SERVER (Node.js + Express)              │
│  Routes · Middleware · Auth · Validation · Rate Limiting    │
└─────────────────────────────┬───────────────────────────────┘
                              │  Mongoose ODM
┌─────────────────────────────▼───────────────────────────────┐
│                      DATABASE (MongoDB)                     │
│  Users · Journal · Habits · Goals · AI Memory · Analytics   │
└─────────────────────────────────────────────────────────────┘
```

**Data flow:** The React frontend sends authenticated HTTP requests to Express REST endpoints. The backend validates input, applies business logic, and persists data in MongoDB. AI features use optional external API integration with a local fallback engine.

---

## 📁 Project Structure

```
MIRA-AI-Personal-Growth-Assistant/
│
├── frontend/                 # React + Vite client application
│   ├── src/
│   │   ├── api/              # API client & service calls
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # Auth, theme, language state
│   │   ├── pages/            # Route-level page components
│   │   ├── i18n/             # Multilingual translations
│   │   └── hooks/            # Custom React hooks
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Node.js + Express API server
│   ├── config/               # Environment configuration
│   ├── middleware/           # Auth, validation, error handling
│   ├── models/               # Mongoose schemas
│   ├── routes/               # REST API route handlers
│   ├── services/             # Business logic & AI engines
│   ├── utils/                # Helpers & utilities
│   ├── server.js             # Application entry point
│   └── package.json
│
├── package.json              # Root scripts (install all, dev)
└── README.md
```

---

## ⚙️ Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the repository

```bash
git clone https://github.com/MaryamAmjad-Dev/MIRA-AI-Personal-Growth-Assistant.git
cd MIRA-AI-Personal-Growth-Assistant
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values (see Environment Variables below)
npm start
```

The API runs at `http://localhost:5000` by default.

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Quick start (from project root)

```bash
npm run install:all
npm run dev:backend    # Terminal 1
npm run dev:frontend   # Terminal 2
```

---

## 🔑 Environment Variables

> **Never commit `.env` files.** Use `.env.example` as a template.

### Backend (`backend/.env`)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/mood-journal
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
AI_API_KEY=
AI_API_URL=https://api.openai.com/v1/chat/completions
GOOGLE_CLIENT_ID=
```

| Variable | Required | Description |
|----------|:--------:|-------------|
| `PORT` | No | Server port (default: `5000`) |
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret key for signing JWT tokens |
| `FRONTEND_URL` | Prod | Frontend URL for CORS and password reset links |
| `AI_API_KEY` | No | OpenAI-compatible API key for AI features |
| `JWT_EXPIRES_IN` | No | Token expiry (default: `7d`) |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=
```

| Variable | Required | Description |
|----------|:--------:|-------------|
| `VITE_API_URL` | ✅ | Backend API base URL |
| `VITE_BACKEND_URL` | No | Backend origin for asset URLs |
| `VITE_GOOGLE_CLIENT_ID` | No | Google OAuth client ID (must match backend) |

---

## 🔮 Future Improvements

- 📧 **Email integration** — transactional emails for password reset and notifications
- 🧠 **More AI features** — deeper personality reports, predictive wellness insights
- 📱 **Mobile application** — native iOS/Android companion app
- 📈 **Advanced analytics** — richer charts, exportable reports, and trend forecasting

---

## 🏷 Recommended GitHub Topics

Add these topics to your repository on GitHub (**Settings → General → Topics**):

```
mern-stack
react
nodejs
express
mongodb
ai
artificial-intelligence
personal-growth
journal-app
full-stack
vite
```

---

## 👩‍💻 Author

**Created by [Maryam Amjad](https://github.com/MaryamAmjad-Dev)**

MIRA AI by Maryam 🦋 — *Your AI-powered personal growth operating system.*

---

<div align="center">

⭐ If you find this project useful, consider giving it a star on GitHub!

</div>
