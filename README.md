# Quick start: cloud AI edition

See [START_HERE.md](START_HERE.md) for the easiest local setup with Groq and SQLite. PostgreSQL remains supported for deployment. Older Ollama instructions below are optional.

# SkillBridge — AI Resume Analyzer SaaS

> A production-ready full-stack SaaS platform that uses local LLM (Ollama llama3) to analyze resumes against job descriptions and return match scores, skill gaps, and personalized learning suggestions.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Folder Structure](#folder-structure)
4. [Database Schema](#database-schema)
5. [Installation & Local Setup](#installation--local-setup)
6. [Environment Variables](#environment-variables)
7. [Run Commands](#run-commands)
8. [API Reference](#api-reference)
9. [Deployment Guide](#deployment-guide)
10. [File-by-File Explanation](#file-by-file-explanation)

---

## Project Overview

**SkillBridge** analyzes your resume PDF against any job description using a local Ollama LLM (llama3). It returns:

| Field | Description |
|---|---|
| `candidate_skills` | Skills found in the resume |
| `required_skills` | Skills required by the job |
| `missing_skills` | Gaps between resume and job |
| `learning_suggestions` | Personalized learning paths |
| `match_score` | Percentage match (0–100) |

---

## Tech Stack

### Backend
| Tool | Purpose |
|---|---|
| Python 3.11+ | Runtime |
| FastAPI | REST API framework |
| PostgreSQL | Primary database |
| SQLAlchemy 2.0 | ORM |
| JWT (python-jose) | Authentication tokens |
| bcrypt (passlib) | Password hashing |
| pdfplumber | PDF text extraction |
| httpx | Async HTTP client for Ollama |
| Pydantic v2 | Schema validation |
| Alembic | Database migrations |

### Frontend
| Tool | Purpose |
|---|---|
| React 18 + Vite | UI framework |
| Tailwind CSS v3 | Styling |
| React Router DOM v6 | Client-side routing |
| Axios | HTTP client with interceptors |
| Context API | Auth + theme state |
| react-hot-toast | Toast notifications |
| react-dropzone | Drag-and-drop upload |
| react-circular-progressbar | Score visualization |
| lucide-react | Icons |

---

## Folder Structure

```
skillbridge/
├── backend/
│   ├── main.py                        # FastAPI app bootstrap
│   ├── requirements.txt
│   ├── Procfile                       # Render deployment
│   ├── alembic.ini
│   ├── .env.example
│   └── app/
│       ├── core/
│       │   ├── config.py              # Pydantic settings from .env
│       │   └── security.py            # JWT + bcrypt + auth dependency
│       ├── db/
│       │   └── database.py            # SQLAlchemy engine + session + Base
│       ├── models/
│       │   ├── user.py                # User ORM model
│       │   └── resume.py              # ResumeAnalysis ORM model
│       ├── schemas/
│       │   ├── auth.py                # Request/response Pydantic schemas
│       │   └── resume.py              # Analysis schemas
│       ├── services/
│       │   ├── pdf_service.py         # PDF text extraction
│       │   └── llm_service.py         # Ollama integration
│       └── api/routes/
│           ├── auth.py                # /api/auth/* endpoints
│           ├── resume.py              # /api/resume/* endpoints
│           └── user.py                # /api/user/* endpoints
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── package.json
    ├── .env.example
    └── src/
        ├── main.jsx                   # React entry + providers
        ├── App.jsx                    # Router + protected routes
        ├── index.css                  # Tailwind + custom utilities
        ├── api/
        │   ├── axiosInstance.js       # Axios + JWT interceptors
        │   ├── auth.js
        │   ├── resume.js
        │   └── user.js
        ├── context/
        │   ├── AuthContext.jsx        # Global auth state
        │   └── ThemeContext.jsx       # Dark mode
        ├── components/
        │   ├── layout/
        │   │   ├── DashboardLayout.jsx
        │   │   ├── Sidebar.jsx
        │   │   └── Topbar.jsx
        │   ├── dashboard/
        │   │   ├── ResumeDropzone.jsx
        │   │   └── AnalysisCard.jsx
        │   └── ui/
        │       ├── Spinner.jsx
        │       ├── ScoreCircle.jsx
        │       ├── SkillTag.jsx
        │       ├── StatCard.jsx
        │       ├── EmptyState.jsx
        │       └── Pagination.jsx
        └── pages/
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── DashboardPage.jsx
            ├── AnalyzePage.jsx
            ├── HistoryPage.jsx
            ├── AnalysisDetailPage.jsx
            └── ProfilePage.jsx
```

---

## Database Schema

```sql
-- Users table
CREATE TABLE users (
    id         SERIAL PRIMARY KEY,
    full_name  VARCHAR(120)  NOT NULL,
    email      VARCHAR(255)  UNIQUE NOT NULL,
    password   VARCHAR(255)  NOT NULL,
    is_active  BOOLEAN       DEFAULT TRUE,
    avatar_url VARCHAR(500),
    created_at TIMESTAMPTZ   DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- Resume analyses table
CREATE TABLE resume_analyses (
    id                   SERIAL PRIMARY KEY,
    user_id              INTEGER       REFERENCES users(id) ON DELETE CASCADE,
    filename             VARCHAR(255)  NOT NULL,
    resume_text          TEXT,
    job_description      TEXT          NOT NULL,
    candidate_skills     JSONB         DEFAULT '[]',
    required_skills      JSONB         DEFAULT '[]',
    missing_skills       JSONB         DEFAULT '[]',
    learning_suggestions JSONB         DEFAULT '[]',
    match_score          FLOAT         DEFAULT 0.0,
    raw_llm_response     TEXT,
    created_at           TIMESTAMPTZ   DEFAULT NOW()
);

CREATE INDEX idx_resume_analyses_user_id ON resume_analyses(user_id);
CREATE INDEX idx_resume_analyses_created_at ON resume_analyses(created_at DESC);
```

> **Note:** SQLAlchemy auto-creates these tables on startup via `create_tables()`. You don't need to run the SQL manually.

---

## Installation & Local Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 14+
- [Ollama](https://ollama.com/) installed and running

### Step 1 — Clone and set up Ollama

```bash
# Install Ollama (macOS)
brew install ollama

# Start Ollama service
ollama serve

# Pull llama3 model (first time only, ~4 GB)
ollama pull llama3
```

### Step 2 — PostgreSQL setup

```bash
# Create database and user
psql -U postgres
```

```sql
CREATE USER skillbridge WITH PASSWORD 'your_secure_password';
CREATE DATABASE skillbridge_db OWNER skillbridge;
GRANT ALL PRIVILEGES ON DATABASE skillbridge_db TO skillbridge;
\q
```

### Step 3 — Backend setup

```bash
cd skillbridge/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL and SECRET_KEY
```

### Step 4 — Frontend setup

```bash
cd skillbridge/frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# VITE_API_BASE_URL=http://localhost:8000
```

---

## Environment Variables

### Backend `.env`

```env
DATABASE_URL=postgresql://skillbridge:your_password@localhost:5432/skillbridge_db
SECRET_KEY=your-32-char-random-hex-string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3
ALLOWED_ORIGINS=["http://localhost:5173"]
```

Generate SECRET_KEY:
```bash
openssl rand -hex 32
```

### Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## Run Commands

```bash
# Terminal 1: Ollama
ollama serve

# Terminal 2: Backend
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000

# Terminal 3: Frontend
cd frontend
npm run dev
```

App runs at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/me` | Yes | Get current user |

### Resume Analysis

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/resume/analyze` | Yes | Upload PDF + JD, run LLM analysis |
| GET | `/api/resume/history` | Yes | Paginated analysis history |
| GET | `/api/resume/history/{id}` | Yes | Single analysis detail |
| DELETE | `/api/resume/history/{id}` | Yes | Delete analysis |

### User

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/user/profile` | Yes | Profile + stats |
| PUT | `/api/user/profile` | Yes | Update name/avatar |

---

## Deployment Guide

### Backend → Render

1. Push `backend/` folder to a GitHub repository

2. Create a new **Web Service** on [render.com](https://render.com)

3. Set build and start commands:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. Add PostgreSQL database on Render → copy the Internal Database URL

5. Set environment variables in Render dashboard:
   ```
   DATABASE_URL=<from Render PostgreSQL>
   SECRET_KEY=<your-secret>
   OLLAMA_BASE_URL=<your-ollama-server-url>
   ALLOWED_ORIGINS=["https://your-app.vercel.app"]
   ```

> **Note:** Ollama must be hosted separately (e.g., on a VPS, RunPod, or self-hosted server) since Render's free tier doesn't support GPU workloads.

### Frontend → Vercel

1. Push `frontend/` to GitHub

2. Import project on [vercel.com](https://vercel.com)

3. Set environment variable:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com
   ```

4. Deploy. Vercel auto-detects Vite.

---

## File-by-File Explanation

| File | Role |
|------|------|
| `backend/main.py` | FastAPI app factory. Registers routers, CORS, and startup lifecycle |
| `app/core/config.py` | Centralised settings loaded from `.env` via Pydantic BaseSettings |
| `app/core/security.py` | `hash_password`, `verify_password`, `create_access_token`, `get_current_user` dependency |
| `app/db/database.py` | SQLAlchemy engine, session factory, `get_db` dependency, `create_tables` |
| `app/models/user.py` | `User` SQLAlchemy ORM model |
| `app/models/resume.py` | `ResumeAnalysis` ORM model with JSONB skill fields |
| `app/schemas/auth.py` | Pydantic schemas for register/login request & response validation |
| `app/schemas/resume.py` | Pydantic schemas for analysis result and paginated list |
| `app/services/pdf_service.py` | Extracts text from uploaded PDF using pdfplumber |
| `app/services/llm_service.py` | Sends prompt to Ollama llama3 API, parses JSON response |
| `app/api/routes/auth.py` | `/register`, `/login`, `/me` endpoints |
| `app/api/routes/resume.py` | `/analyze`, `/history`, `/history/{id}` endpoints |
| `app/api/routes/user.py` | `/profile` GET and PUT endpoints |
| `frontend/src/api/axiosInstance.js` | Axios with JWT attach + 401 redirect interceptors |
| `frontend/src/context/AuthContext.jsx` | Global auth state: user, login, register, logout |
| `frontend/src/context/ThemeContext.jsx` | Dark/light mode toggle, persisted to localStorage |
| `frontend/src/App.jsx` | Route definitions, ProtectedRoute and PublicRoute guards |
| `frontend/src/pages/LoginPage.jsx` | Split-panel login with validation |
| `frontend/src/pages/RegisterPage.jsx` | Registration form with confirm password |
| `frontend/src/pages/DashboardPage.jsx` | Greeting, stat cards, recent analyses |
| `frontend/src/pages/AnalyzePage.jsx` | Drag-drop upload form + results view with score circle |
| `frontend/src/pages/HistoryPage.jsx` | Paginated history list with delete |
| `frontend/src/pages/AnalysisDetailPage.jsx` | Full analysis detail with skill breakdown |
| `frontend/src/pages/ProfilePage.jsx` | Editable profile + account stats |
| `frontend/src/components/ui/ScoreCircle.jsx` | Circular progress with dynamic color |
| `frontend/src/components/ui/SkillTag.jsx` | Colored skill badge (green/red/blue) |
| `frontend/src/components/dashboard/ResumeDropzone.jsx` | react-dropzone PDF upload area |
| `frontend/src/components/dashboard/AnalysisCard.jsx` | Summary card for history items |

---

## License

MIT — free to use in your portfolio, projects, and commercial applications.

Built with ❤️ as a production-grade MCA final year project.


## Revised setup
See [DEPLOYMENT.md](DEPLOYMENT.md) for the current Docker setup, migration instructions and verification limitations. Run `alembic upgrade head` before starting the backend.
