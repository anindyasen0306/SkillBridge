"""
ResumeAnalysis database model.
Stores every analysis result linked to a user.
JSON fields hold the skill arrays returned by the LLM.
"""

from sqlalchemy import (
    Column, Integer, String, Float, Text,
    DateTime, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base


class ResumeAnalysis(Base):
    __tablename__ = "resume_analyses"

    id                  = Column(Integer, primary_key=True, index=True)
    user_id             = Column(Integer, ForeignKey("users.id"), nullable=False)

    # File metadata
    filename            = Column(String(255), nullable=False)
    resume_text         = Column(Text, nullable=True)     # extracted PDF text
    job_description     = Column(Text, nullable=False)

    # LLM result fields (stored as JSON arrays / scalar)
    candidate_skills    = Column(JSON, default=list)
    required_skills     = Column(JSON, default=list)
    missing_skills      = Column(JSON, default=list)
    learning_suggestions = Column(JSON, default=list)
    match_score         = Column(Float, default=0.0)

    # Raw LLM response for debugging
    raw_llm_response    = Column(Text, nullable=True)

    created_at          = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship back to User
    user = relationship("User", back_populates="analyses")
