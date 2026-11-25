"""
Database setup using SQLAlchemy.
  - Engine creation from DATABASE_URL
  - Session factory
  - Base declarative class for all ORM models
  - create_tables() called on startup
  - get_db() dependency injected into every route that needs DB access
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,        # reconnect on stale connections
    pool_size=10,
    max_overflow=20,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def create_tables():
    """Import all models so SQLAlchemy registers them, then create tables."""
    from app.models import user, resume  # noqa: F401
    Base.metadata.create_all(bind=engine)


def get_db():
    """FastAPI dependency that yields a DB session and closes it after use."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
