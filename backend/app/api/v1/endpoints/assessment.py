from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List

from app.core.database import get_db
from app.api.dependencies import get_current_active_student
from app.models.user import User
from app.models.assessment import (
    AssessmentTest,
    AssessmentQuestion,
    StudentAssessment,
    AssessmentAnswer,
    AssessmentResult,
)
from app.schemas.assessment import (
    AssessmentTestResponse,
    StudentAssessmentCreate,
    StudentAssessmentResponse,
    AssessmentAnswerCreate,
    AssessmentResultResponse,
)

router = APIRouter()


@router.get("/tests", response_model=List[AssessmentTestResponse])
async def get_available_tests(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_student)
):
    result = await db.execute(
        select(AssessmentTest).where(AssessmentTest.is_active == True)
    )
    tests = result.scalars().all()
    return tests


@router.get("/tests/{test_id}", response_model=AssessmentTestResponse)
async def get_test_details(
    test_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_student)
):
    result = await db.execute(
        select(AssessmentTest)
        .options(selectinload(AssessmentTest.questions))
        .where(AssessmentTest.id == test_id)
    )
    test = result.scalar_one_or_none()
    
    if not test:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Test not found"
        )
    
    return test


@router.post("/start", response_model=StudentAssessmentResponse, status_code=status.HTTP_201_CREATED)
async def start_assessment(
    assessment_data: StudentAssessmentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_student)
):
    result = await db.execute(
        select(AssessmentTest).where(AssessmentTest.id == assessment_data.test_id)
    )
    test = result.scalar_one_or_none()
    
    if not test:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Test not found"
        )
    
    new_assessment = StudentAssessment(
        student_id=current_user.id,
        test_id=test.id,
        total_questions=test.total_questions,
    )
    
    db.add(new_assessment)
    await db.commit()
    await db.refresh(new_assessment)
    
    return new_assessment


@router.post("/assessments/{assessment_id}/answer", status_code=status.HTTP_201_CREATED)
async def submit_answer(
    assessment_id: int,
    answer_data: AssessmentAnswerCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_student)
):
    result = await db.execute(
        select(StudentAssessment)
        .where(
            StudentAssessment.id == assessment_id,
            StudentAssessment.student_id == current_user.id
        )
    )
    assessment = result.scalar_one_or_none()
    
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )
    
    if assessment.is_completed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Assessment already completed"
        )
    
    result = await db.execute(
        select(AssessmentQuestion).where(AssessmentQuestion.id == answer_data.question_id)
    )
    question = result.scalar_one_or_none()
    
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    is_correct = answer_data.selected_answer == question.correct_answer if answer_data.selected_answer else None
    
    answer = AssessmentAnswer(
        assessment_id=assessment_id,
        question_id=answer_data.question_id,
        selected_answer=answer_data.selected_answer,
        is_correct=is_correct,
        time_spent_seconds=answer_data.time_spent_seconds,
    )
    
    db.add(answer)
    await db.commit()
    
    return {"message": "Answer submitted successfully"}


@router.post("/assessments/{assessment_id}/complete", response_model=StudentAssessmentResponse)
async def complete_assessment(
    assessment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_student)
):
    result = await db.execute(
        select(StudentAssessment)
        .options(selectinload(StudentAssessment.answers))
        .where(
            StudentAssessment.id == assessment_id,
            StudentAssessment.student_id == current_user.id
        )
    )
    assessment = result.scalar_one_or_none()
    
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )
    
    if assessment.is_completed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Assessment already completed"
        )
    
    correct = sum(1 for a in assessment.answers if a.is_correct == True)
    wrong = sum(1 for a in assessment.answers if a.is_correct == False)
    empty = assessment.total_questions - len(assessment.answers)
    
    assessment.correct_answers = correct
    assessment.wrong_answers = wrong
    assessment.empty_answers = empty
    assessment.score_percentage = (correct / assessment.total_questions) * 100 if assessment.total_questions > 0 else 0
    assessment.is_completed = True
    
    from datetime import datetime
    assessment.completed_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(assessment)
    
    return assessment


@router.get("/assessments/{assessment_id}/result", response_model=AssessmentResultResponse)
async def get_assessment_result(
    assessment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_student)
):
    result = await db.execute(
        select(AssessmentResult)
        .join(StudentAssessment)
        .where(
            AssessmentResult.assessment_id == assessment_id,
            StudentAssessment.student_id == current_user.id
        )
    )
    assessment_result = result.scalar_one_or_none()
    
    if not assessment_result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment result not found"
        )
    
    return assessment_result
