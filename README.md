# CropAdvisor AI 🌱

> **Precision Agriculture Platform** powered by Google's Gemini AI (2.5 Flash), React.js, Node.js, Express, and PostgreSQL. Analyzes soil, climate, location, and seasonal parameters to deliver structured, scientifically sound, and actionable crop advisories, fertilizer schedules, and pest mitigation strategies.

---

## 🌟 Key Features

- **🔐 Robust Authentication & RLS**: JWT authentication with bcrypt password hashing and strict Row-Level Security data isolation enforced across all endpoints.
- **🌾 Farm Profile Management**: Multi-farm profiles tracking soil type, pH level, acreage, location, and irrigation methods (Rainfed, Drip, Sprinkler).
- **🧠 Generative AI Agronomist**: Leverages the official `@google/genai` SDK with `gemini-2.5-flash` using structured JSON schema output enforcement (`responseSchema`).
- **📊 Hyper-Personalized Advisory Output**:
  - **Top 3 Recommended Crops** with suitability match %, expected yield per acre, and agronomic reasoning.
  - **Phase-by-Phase Fertilizer Schedule** (Basal, Vegetative, Flowering, Maturity).
  - **Pest & Disease Risk Matrix** with actionable mitigation strategies.
- **📜 Advisory History Log**: Review and inspect historical AI recommendations stored securely in PostgreSQL.
- **✨ Modern AgriTech UI/UX**: Mobile-first design built with Tailwind CSS, Lucide icons, glassmorphism, dynamic animations, and progress indicators.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18 (Vite), Tailwind CSS, Lucide React, Zustand, Axios, Zod |
| **Backend** | Node.js, Express.js, Helmet, CORS, Zod validation middleware |
| **Database** | PostgreSQL (`pg` pool with parameterized SQL queries) |
| **AI Engine** | Google Gemini (`@google/genai` SDK, `gemini-2.5-flash`, JSON responseSchema) |
| **Security** | JWT, bcryptjs, Helmet headers, SQL parameterization, API-level isolation |

---

## 📁 Project Architecture

```
build-t0-ship/
├── package.json              # Monorepo workspaces config
├── .env.example              # Template for environment variables
├── README.md                 # System overview and quickstart
├── server/                   # Express.js REST API Backend
│   ├── config/
│   │   ├── env.js            # Strict environment variable validation
│   │   ├── db.js             # PostgreSQL connection pool & schema migration
│   │   └── ai.js             # Google GenAI client initialization
│   ├── controllers/
│   │   ├── auth.controller.js      # Register & login controllers
│   │   ├── farm.controller.js      # Farm CRUD with user isolation
│   │   └── advisory.controller.js  # Advisory generation & retrieval
│   ├── middlewares/
│   │   ├── auth.middleware.js      # JWT authentication middleware
│   │   └── validate.middleware.js  # Zod schema validation middleware
│   ├── routes/
│   │   ├── auth.routes.js          # /api/auth
│   │   ├── farm.routes.js          # /api/farms
│   │   └── advisory.routes.js      # /api/advisory
│   ├── services/
│   │   └── ai.service.js           # Gemini 2.5 Flash structured advisory service
│   ├── validators/
│   │   ├── auth.validator.js       # Register / login Zod schemas
│   │   ├── farm.validator.js       # Farm input Zod schemas
│   │   └── advisory.validator.js   # Advisory request Zod schemas
│   ├── index.js              # Server entry point
│   ├── package.json          # Backend dependencies
│   └── .env                  # Local server environment config
└── client/                   # React.js (Vite) Frontend
    ├── index.html            # Main HTML with Google Fonts
    ├── vite.config.js        # Vite config with /api proxy to :5000
    ├── tailwind.config.js    # Custom AgriTech color palette & typography
    ├── package.json          # Frontend dependencies
    └── src/
        ├── main.jsx          # React DOM root
        ├── App.jsx           # Routes & route protection
        ├── index.css         # Tailwind directives & custom animations
        ├── context/
        │   └── authStore.js  # Zustand auth state & persistent token management
        ├── services/
        │   ├── api.js        # Axios instance with auth interceptor
        │   ├── auth.service.js     # Auth API calls
        │   ├── farm.service.js     # Farm API calls
        │   └── advisory.service.js # Advisory API calls
        ├── components/
        │   ├── Layout/       # Navbar, Sidebar, PageContainer
        │   ├── UI/           # Modal, Alert, Badge, Card, Spinner
        │   ├── Farm/         # FarmCard, FarmFormModal
        │   └── Advisory/     # AdvisoryResultCard, AdvisorySkeleton
        └── pages/
            ├── LandingPage.jsx         # Marketing & hero overview
            ├── LoginPage.jsx           # User sign-in
            ├── RegisterPage.jsx        # User registration
            ├── DashboardPage.jsx       # Farm statistics & recent advisories
            ├── FarmsPage.jsx           # Farm profile management
            ├── AdvisoryRequestPage.jsx # AI prompt configuration form
            └── AdvisoryDetailPage.jsx  # Detailed advisory report view
```

---

## 🗄️ Database Schema

```sql
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    soil_type VARCHAR(50) NOT NULL,
    ph_level NUMERIC(4,2) NOT NULL,
    irrigation_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS advisories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    season VARCHAR(50) NOT NULL,
    budget_tier VARCHAR(50) NOT NULL,
    ai_recommendation JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ recommended
- **PostgreSQL**: Local instance or remote (e.g. Neon, Supabase, Replit Postgres)
- **Google Gemini API Key**: [Google AI Studio](https://aistudio.google.com/)

### 2. Environment Configuration
Create `server/.env` with your credentials:

```bash
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/cropadvisor
JWT_SECRET=your-32-character-secret-key-at-least
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Installation
Install all dependencies across the monorepo:
```bash
npm install
```

### 4. Running the Application
Run both backend and frontend concurrently:
```bash
npm run dev
```

Or run separately:
```bash
# In one terminal (Backend on http://localhost:5000):
npm run dev --workspace=server

# In another terminal (Frontend on http://localhost:5173):
npm run dev --workspace=client
```

---

## 🔒 Security & Data Isolation
- **Authentication**: JWTs with an expiration, verified via Express middleware on all protected routes.
- **Row-Level Security**: Every farm and advisory query strictly filters by `WHERE user_id = req.user.id`.
- **Generation Ownership Check**: Users cannot generate advisories for `farm_id`s that belong to other users.
- **SQL Injection Prevention**: All queries use parameterized inputs with `$1, $2, ...`.
- **AI Output Guard**: GenAI responses are validated with Zod against strict schemas before persisting.