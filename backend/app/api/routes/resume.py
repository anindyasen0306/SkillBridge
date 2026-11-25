"""
Resume analysis routes:
  POST /api/resume/analyze          - upload PDF + job description, run LLM analysis
  GET  /api/resume/history          - paginated analysis history for current user
  GET  /api/resume/history/{id}     - single analysis detail
  DELETE /api/resume/history/{id}   - delete an analysis record
"""

from fastapi import APIRouter, Depends, File, Form, UploadFile, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.db.database import get_db
from app.models.user import User
from app.models.resume import ResumeAnalysis
from app.schemas.resume import AnalysisOut, AnalysisListOut
from app.core.security import get_current_user
from app.services.pdf_service import extract_text_from_pdf
from app.services.llm_service import analyze_resume_with_llm

router = APIRouter()


@router.post("/analyze", response_model=AnalysisOut, status_code=201)
async def analyze_resume(
    file: UploadFile = File(..., description="PDF resume file"),
    job_description: str = Form(..., min_length=50, max_length=20000, description="Target job description"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Full pipeline:
    1. Extract text from uploaded PDF
    2. Send resume text + JD to LLM
    3. Store result in DB
    4. Return analysis
    """
    # Step 1: Extract PDF text
    resume_text = await extract_text_from_pdf(file)

    # Step 2: LLM analysis
    result = await analyze_resume_with_llm(resume_text, job_description)

    # Step 3: Persist to database
    analysis = ResumeAnalysis(
        user_id=current_user.id,
        filename=(file.filename or "resume.pdf")[:255],
        resume_text=None,
        job_description=job_description,
        candidate_skills=result["candidate_skills"],
        required_skills=result["required_skills"],
        missing_skills=result["missing_skills"],
        learning_suggestions=result["learning_suggestions"],
        match_score=result["match_score"],
        raw_llm_response=result.get("raw_llm_response"),
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return analysis


@router.get("/history", response_model=AnalysisListOut)
def get_history(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Paginated list of all resume analyses for the authenticated user."""
    offset = (page - 1) * page_size

    total = (
        db.query(ResumeAnalysis)
        .filter(ResumeAnalysis.user_id == current_user.id)
        .count()
    )

    analyses = (
        db.query(ResumeAnalysis)
        .filter(ResumeAnalysis.user_id == current_user.id)
        .order_by(ResumeAnalysis.created_at.desc())
        .offset(offset)
        .limit(page_size)
        .all()
    )

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "results": analyses,
    }


@router.get("/history/{analysis_id}", response_model=AnalysisOut)
def get_analysis(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Fetch a single analysis record. Scoped to current user."""
    analysis = (
        db.query(ResumeAnalysis)
        .filter(
            ResumeAnalysis.id == analysis_id,
            ResumeAnalysis.user_id == current_user.id,
        )
        .first()
    )
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found.")
    return analysis


@router.delete("/history/{analysis_id}", status_code=204)
def delete_analysis(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a specific analysis record. Scoped to current user."""
    analysis = (
        db.query(ResumeAnalysis)
        .filter(
            ResumeAnalysis.id == analysis_id,
            ResumeAnalysis.user_id == current_user.id,
        )
        .first()
    )
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found.")
    db.delete(analysis)
    db.commit()
