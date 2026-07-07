# MIRA by Maryam 🦋

Premium AI wellness platform for mood tracking, journaling, habit building, goals, analytics, and personalized coaching.

**Brand:** MIRA · by Maryam 🦋  
**Tagline:** *Your AI-powered wellness companion for growth and transformation.*

## Stack

- **MongoDB** — user-scoped data with indexed queries
- **Express** — JWT auth, validation, rate limiting, helmet
- **React + Vite** — premium wellness SaaS dashboard with React Router
- **Recharts** — advanced analytics visualizations
- **OpenAI** — personalized AI coaching (optional, with local fallback)

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Set MONGODB_URI and JWT_SECRET in .env
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` and register a new MIRA account.

### Or from project root

```bash
npm run install:all
npm run dev:backend   # Terminal 1
npm run dev:frontend  # Terminal 2
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret for signing JWT tokens |
| `JWT_EXPIRES_IN` | No | Token expiry (default: 7d) |
| `FRONTEND_URL` | Prod | Vercel URL for CORS |
| `AI_API_KEY` | No | OpenAI-compatible API key for AI features |
| `AI_API_URL` | No | AI API endpoint |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `VITE_API_URL` | Prod | Backend API URL for frontend |

## Features

- JWT + Google authentication
- Mood journal with AI analysis on every entry
- MIRA AI wellness chat companion with memory
- Daily AI check-in & wellness score
- Habit & goal AI coaches
- Digital Twin, Life Score, Emotional DNA & more
- Mood prediction & semantic journal search
- Weekly/monthly AI wellness reports
- Habits, planner, goals, calendar, analytics
- Light/dark theme (light default)
- Export journal as JSON or CSV

## Brand Guidelines

- Logo: **MIRA** on first line, **by Maryam 🦋** on second line
- Butterfly emoji appears only with Maryam — never before MIRA
- Primary palette: lavender (#A78BFA), soft pink (#F0ABFC), sky blue (#7DD3FC)

## Deployment

- **Frontend:** Vercel (`frontend/` root, set `VITE_API_URL`)
- **Backend:** Render, Railway, Fly.io, etc. (`npm start`)
- **Database:** MongoDB Atlas
