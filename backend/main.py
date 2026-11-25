"""
SkillBridge - AI Resume Analyzer
Main application entry point. Bootstraps FastAPI app, registers routers,
configures CORS, and initializes the database on startup.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.db.database import create_tables
from app.api.routes import auth, resume, user


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown lifecycle handler."""
    pass  # Schema managed by Alembic; run alembic upgrade head first.
    yield


app = FastAPI(
    title="SkillBridge API",
    description="AI-powered Resume Analyzer SaaS Platform",
    version="1.0.0",
    lifespan=lifespan,
)

# ─── CORS ────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ─────────────────────────────────────────────────────────────────
app.include_router(auth.router,   prefix="/api/auth",   tags=["Authentication"])
app.include_router(resume.router, prefix="/api/resume", tags=["Resume Analysis"])
app.include_router(user.router,   prefix="/api/user",   tags=["User"])


@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "SkillBridge API", "version": "1.0.0"}
