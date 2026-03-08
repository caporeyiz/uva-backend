from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class DailyProgress(Base):
    __tablename__ = "daily_progress"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    date = Column(Date, nullable=False)
    
    study_minutes = Column(Integer, default=0)
    questions_solved = Column(Integer, default=0)
    correct_answers = Column(Integer, default=0)
    
    videos_watched = Column(Integer, default=0)
    pages_read = Column(Integer, default=0)
    
    subjects_studied = Column(JSON, nullable=True)
    
    points_earned = Column(Integer, default=0)
    
    goals_completed = Column(Integer, default=0)
    goals_total = Column(Integer, default=0)
    
    notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    student = relationship("User", back_populates="daily_progress")


class WeeklyReport(Base):
    __tablename__ = "weekly_reports"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    week_start_date = Column(Date, nullable=False)
    week_end_date = Column(Date, nullable=False)
    
    total_study_minutes = Column(Integer, default=0)
    total_questions_solved = Column(Integer, default=0)
    total_correct_answers = Column(Integer, default=0)
    
    accuracy_percentage = Column(Integer, default=0)
    
    subjects_breakdown = Column(JSON, nullable=True)
    
    goals_achieved = Column(Integer, default=0)
    streak_maintained = Column(Boolean, default=False)
    
    points_earned = Column(Integer, default=0)
    
    ai_summary = Column(Text, nullable=True)
    ai_suggestions = Column(JSON, nullable=True)
    
    sent_to_parent = Column(Boolean, default=False)
    sent_at = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class MonthlyReport(Base):
    __tablename__ = "monthly_reports"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    month = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    
    total_study_hours = Column(Integer, default=0)
    total_questions_solved = Column(Integer, default=0)
    
    average_daily_study_minutes = Column(Integer, default=0)
    
    exam_attempts = Column(Integer, default=0)
    average_net_score = Column(Integer, default=0)
    
    improvement_percentage = Column(Integer, default=0)
    
    subjects_mastery = Column(JSON, nullable=True)
    
    achievements_unlocked = Column(JSON, nullable=True)
    
    ai_monthly_summary = Column(Text, nullable=True)
    ai_next_month_plan = Column(JSON, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    
    name = Column(String(255), nullable=False, unique=True)
    description = Column(Text, nullable=False)
    
    icon_url = Column(String(500), nullable=True)
    
    category = Column(String(100), nullable=False)
    
    points_reward = Column(Integer, default=0)
    
    requirement_type = Column(String(100), nullable=False)
    requirement_value = Column(Integer, nullable=False)
    
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user_achievements = relationship("UserAchievement", back_populates="achievement", cascade="all, delete-orphan")


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    achievement_id = Column(Integer, ForeignKey("achievements.id", ondelete="CASCADE"), nullable=False)
    
    unlocked_at = Column(DateTime(timezone=True), server_default=func.now())
    
    progress_value = Column(Integer, default=0)
    
    user = relationship("User", back_populates="achievements")
    achievement = relationship("Achievement", back_populates="user_achievements")
