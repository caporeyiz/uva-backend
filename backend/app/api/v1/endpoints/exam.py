from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List

from app.core.database import get_db
from app.api.dependencies import get_current_active_student
from app.models.user import User
from app.models.exam import ExamAttempt, ExamAnalysis
from app.schemas.exam import ExamAttemptCreate, ExamAttemptResponse, ExamAnalysisResponse

router = APIRouter()


@router.post("/upload", response_model=ExamAttemptResponse, status_code=status.HTTP_201_CREATED)
async def upload_exam(
    exam_data: ExamAttemptCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_student)
):
    exam_attempt = ExamAttempt(
        student_id=current_user.id,
        **exam_data.model_dump()
    )
    
    db.add(exam_attempt)
    await db.commit()
    await db.refresh(exam_attempt)
    
    return exam_attempt


@router.get("/my-exams", response_model=List[ExamAttemptResponse])
async def get_my_exams(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_student)
):
    result = await db.execute(
        select(ExamAttempt)
        .where(ExamAttempt.student_id == current_user.id)
        .order_by(ExamAttempt.exam_date.desc())
    )
    exams = result.scalars().all()
    return exams


@router.get("/{exam_id}/analysis", response_model=ExamAnalysisResponse)
async def get_exam_analysis(
    exam_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_student)
):
    result = await db.execute(
        select(ExamAnalysis)
        .join(ExamAttempt)
        .where(
            ExamAnalysis.exam_attempt_id == exam_id,
            ExamAttempt.student_id == current_user.id
        )
    )
    analysis = result.scalar_one_or_none()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam analysis not found"
        )
    
    return analysis


@router.post("/{exam_id}/analyze", status_code=status.HTTP_202_ACCEPTED)
async def trigger_exam_analysis(
    exam_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_student)
):
    result = await db.execute(
        select(ExamAttempt)
        .where(
            ExamAttempt.id == exam_id,
            ExamAttempt.student_id == current_user.id
        )
    )
    exam = result.scalar_one_or_none()
    
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )
    
    return {"message": "Exam analysis started. This will be processed in background."}
