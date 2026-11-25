"""
Configuration management using Pydantic BaseSettings.
Reads all values from environment variables / .env file.
"""

from pydantic_settings import BaseSettings
from typing import List
from secrets import token_urlsafe


class Settings(BaseSettings):
    # ─── Database ──────────────────────────────────────────────────────────
    DATABASE_URL: str = "sqlite:///./skillbridge.db"

    # ─── JWT ───────────────────────────────────────────────────────────────
    SECRET_KEY: str = token_urlsafe(48)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # ─── Ollama ────────────────────────────────────────────────────────────
    AI_PROVIDER: str = "groq"
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.1-8b-instant"
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3"

    # ─── CORS ──────────────────────────────────────────────────────────────
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
    ]

    # ─── Upload ────────────────────────────────────────────────────────────
    MAX_FILE_SIZE_MB: int = 10
    UPLOAD_DIR: str = "uploads"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
