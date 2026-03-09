from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum as SQLEnum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum

from app.core.database import Base


class UserRole(str, enum.Enum):
    STUDENT = "student"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(20), unique=True, index=True, nullable=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.STUDENT, nullable=False)
    
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    target_exam_date = Column(DateTime, nullable=True)
    target_university = Column(String(255), nullable=True)
    target_department = Column(String(255), nullable=True)
    
    points = Column(Integer, default=0)
    streak_days = Column(Integer, default=0)
    last_activity_date = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    parent_info = relationship("ParentInfo", back_populates="student", uselist=False, cascade="all, delete-orphan")
    assessments = relationship("StudentAssessment", back_populates="student", cascade="all, delete-orphan")
    study_plans = relationship("StudyPlan", back_populates="student", cascade="all, delete-orphan")
    exam_attempts = relationship("ExamAttempt", back_populates="student", cascade="all, delete-orphan")
    daily_progress = relationship("DailyProgress", back_populates="student", cascade="all, delete-orphan")
    achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")
    books = relationship("UserBook", back_populates="student", cascade="all, delete-orphan")
    routines = relationship("DailyRoutine", back_populates="student", cascade="all, delete-orphan")
    chat_history = relationship("ChatHistory", back_populates="user", cascade="all, delete-orphan")


class ParentInfo(Base):
    __tablename__ = "parent_info"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    parent_name = Column(String(255), nullable=False)
    parent_email = Column(String(255), nullable=True)
    parent_phone = Column(String(20), nullable=False)
    
    send_weekly_report = Column(Boolean, default=True)
    send_notifications = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    student = relationship("User", back_populates="parent_info")
