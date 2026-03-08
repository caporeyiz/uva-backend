from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List

from app.core.database import get_db
from app.api.dependencies import get_current_active_student
from app.models.user import User
from app.models.study_plan import StudyPlan, DailyRoutine, UserBook
from app.schemas.study_plan import (
    StudyPlanCreate,
    StudyPlanResponse,
    DailyRoutineCreate,
    DailyRoutineResponse,
    UserBookCreate,
    UserBookResponse,
)

router = APIRouter()


@router.post("/generate", response_model=StudyPlanResponse, status_code=status.HTTP_201_CREATED)
async def generate_study_plan(
    plan_data: StudyPlanCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_student)
):
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="AI study plan generation will be implemented"
    )


@router.get("/my-plans", response_model=List[StudyPlanResponse])
async def get_my_study_plans(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_student)
):
    result = await db.execute(
        select(StudyPlan)
        .options(selectinload(StudyPlan.items))
        .where(StudyPlan.student_id == current_user.id)
        .order_by(StudyPlan.created_at.desc())
    )
    plans = result.scalars().all()
    return plans


@router.get("/routines", response_model=List[DailyRoutineResponse])
async def get_my_routines(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_student)
):
    result = await db.execute(
        select(DailyRoutine)
        .where(DailyRoutine.student_id == current_user.id)
        .order_by(DailyRoutine.day_of_week, DailyRoutine.start_time)
    )
    routines = result.scalars().all()
    return routines


@router.post("/routines", response_model=DailyRoutineResponse, status_code=status.HTTP_201_CREATED)
async def create_routine(
    routine_data: DailyRoutineCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_student)
):
    routine = DailyRoutine(
        student_id=current_user.id,
        **routine_data.model_dump()
    )
    
    db.add(routine)
    await db.commit()
    await db.refresh(routine)
    
    return routine


@router.get("/books", response_model=List[UserBookResponse])
async def get_my_books(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_student)
):
    result = await db.execute(
        select(UserBook)
        .where(UserBook.student_id == current_user.id)
        .order_by(UserBook.subject, UserBook.book_name)
    )
    books = result.scalars().all()
    return books


@router.post("/books", response_model=UserBookResponse, status_code=status.HTTP_201_CREATED)
async def add_book(
    book_data: UserBookCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_student)
):
    book = UserBook(
        student_id=current_user.id,
        **book_data.model_dump()
    )
    
    db.add(book)
    await db.commit()
    await db.refresh(book)
    
    return book
