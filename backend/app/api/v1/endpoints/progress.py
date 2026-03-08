from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from datetime import date

from app.core.database import get_db
from app.api.dependencies import get_current_active_student
from app.models.user import User
from app.models.progress import DailyProgress, WeeklyReport, MonthlyReport, Achievement, UserAchievement
from app.schemas.progress import (
    DailyProgressResponse,
    WeeklyReportResponse,
    MonthlyReportResponse,
    AchievementResponse,
)

router = APIRouter()


@router.get("/daily", response_model=List[DailyProgressResponse])
async def get_daily_progress(
    start_date: date,
    end_date: date,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_student)
):
    result = await db.execute(
        select(DailyProgress)
        .where(
            DailyProgress.student_id == current_user.id,
            DailyProgress.date >= start_date,
            DailyProgress.date <= end_date
        )
        .order_by(DailyProgress.date)
    )
    progress = result.scalars().all()
    return progress


@router.get("/weekly", response_model=List[WeeklyReportResponse])
async def get_weekly_reports(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_student)
):
    result = await db.execute(
        select(WeeklyReport)
        .where(WeeklyReport.student_id == current_user.id)
        .order_by(WeeklyReport.week_start_date.desc())
        .limit(12)
    )
    reports = result.scalars().all()
    return reports


@router.get("/monthly", response_model=List[MonthlyReportResponse])
async def get_monthly_reports(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_student)
):
    result = await db.execute(
        select(MonthlyReport)
        .where(MonthlyReport.student_id == current_user.id)
        .order_by(MonthlyReport.year.desc(), MonthlyReport.month.desc())
        .limit(12)
    )
    reports = result.scalars().all()
    return reports


@router.get("/achievements", response_model=List[AchievementResponse])
async def get_my_achievements(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_student)
):
    result = await db.execute(
        select(Achievement)
        .join(UserAchievement)
        .where(UserAchievement.user_id == current_user.id)
        .order_by(UserAchievement.unlocked_at.desc())
    )
    achievements = result.scalars().all()
    return achievements
