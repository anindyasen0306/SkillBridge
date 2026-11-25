"""
User routes:
  GET    /api/user/profile   - get profile + stats
  PUT    /api/user/profile   - update name / avatar
  DELETE /api/user/account   - soft-delete account
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.database import get_db
from app.models.user import User
from app.models.resume import ResumeAnalysis
from app.schemas.auth import UserOut, UserUpdate
from app.core.security import get_current_user

router = APIRouter()


@router.get("/profile")
def get_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return user profile with aggregated stats."""
    total_analyses = (
        db.query(func.count(ResumeAnalysis.id))
        .filter(ResumeAnalysis.user_id == current_user.id)
        .scalar()
    )
    avg_score = (
        db.query(func.avg(ResumeAnalysis.match_score))
        .filter(ResumeAnalysis.user_id == current_user.id)
        .scalar()
    )

    return {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "avatar_url": current_user.avatar_url,
        "created_at": current_user.created_at,
        "stats": {
            "total_analyses": total_analyses or 0,
            "average_score": round(avg_score or 0, 1),
        },
    }


@router.put("/profile", response_model=UserOut)
def update_profile(
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update user's display name and/or avatar URL."""
    if payload.full_name:
        current_user.full_name = payload.full_name
    if payload.avatar_url is not None:
        current_user.avatar_url = payload.avatar_url

    db.commit()
    db.refresh(current_user)
    return current_user


@router.delete("/account", status_code=204)
def deactivate_account(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Soft-delete: deactivate the user account."""
    current_user.is_active = False
    db.commit()
