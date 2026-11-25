"""Pydantic schemas for resume analysis requests and responses."""

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class AnalysisResult(BaseModel):
    candidate_skills: List[str]
    required_skills: List[str]
    missing_skills: List[str]
    learning_suggestions: List[str]
    match_score: float = Field(ge=0, le=100, allow_inf_nan=False)


class AnalysisOut(BaseModel):
    id: int
    filename: str
    job_description: str
    candidate_skills: List[str]
    required_skills: List[str]
    missing_skills: List[str]
    learning_suggestions: List[str]
    match_score: float
    created_at: datetime

    class Config:
        from_attributes = True


class AnalysisListOut(BaseModel):
    total: int
    page: int
    page_size: int
    results: List[AnalysisOut]
