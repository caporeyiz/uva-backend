from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime, date


class DailyProgressResponse(BaseModel):
    id: int
    date: date
    study_minutes: int
    questions_solved: int
    correct_answers: int
    videos_watched: int
    pages_read: int
    subjects_studied: Optional[List[str]]
    points_earned: int
    goals_completed: int
    goals_total: int

    class Config:
        from_attributes = True


class WeeklyReportResponse(BaseModel):
    id: int
    week_start_date: date
    week_end_date: date
    total_study_minutes: int
    total_questions_solved: int
    total_correct_answers: int
    accuracy_percentage: int
    subjects_breakdown: Optional[Dict[str, Any]]
    goals_achieved: int
    streak_maintained: bool
    points_earned: int
    ai_summary: Optional[str]
    ai_suggestions: Optional[List[str]]

    class Config:
        from_attributes = True


class MonthlyReportResponse(BaseModel):
    id: int
    month: int
    year: int
    total_study_hours: int
    total_questions_solved: int
    average_daily_study_minutes: int
    exam_attempts: int
    average_net_score: int
    improvement_percentage: int
    subjects_mastery: Optional[Dict[str, Any]]
    achievements_unlocked: Optional[List[str]]
    ai_monthly_summary: Optional[str]

    class Config:
        from_attributes = True


class AchievementResponse(BaseModel):
    id: int
    name: str
    description: str
    icon_url: Optional[str]
    category: str
    points_reward: int

    class Config:
        from_attributes = True
