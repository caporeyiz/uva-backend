from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON, Time, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.core.database import Base


class PlanStatus(str, enum.Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    PAUSED = "paused"
    CANCELLED = "cancelled"


class ItemStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    SKIPPED = "skipped"


class StudyPlan(Base):
    __tablename__ = "study_plans"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=False)
    
    status = Column(SQLEnum(PlanStatus), default=PlanStatus.ACTIVE, nullable=False)
    
    total_study_hours = Column(Integer, nullable=False)
    weekly_study_hours = Column(Integer, nullable=False)
    
    progress_percentage = Column(Integer, default=0)
    
    is_on_track = Column(Boolean, default=True)
    
    ai_generated = Column(Boolean, default=True)
    generation_metadata = Column(JSON, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    student = relationship("User", back_populates="study_plans")
    items = relationship("StudyPlanItem", back_populates="plan", cascade="all, delete-orphan")


class StudyPlanItem(Base):
    __tablename__ = "study_plan_items"

    id = Column(Integer, primary_key=True, index=True)
    plan_id = Column(Integer, ForeignKey("study_plans.id", ondelete="CASCADE"), nullable=False)
    
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    subject = Column(String(100), nullable=False)
    topic = Column(String(255), nullable=False)
    
    book_name = Column(String(255), nullable=True)
    chapter = Column(String(255), nullable=True)
    page_range = Column(String(50), nullable=True)
    
    video_url = Column(String(500), nullable=True)
    video_instructor = Column(String(255), nullable=True)
    video_tags = Column(JSON, nullable=True)
    
    scheduled_date = Column(DateTime(timezone=True), nullable=False)
    estimated_duration_minutes = Column(Integer, nullable=False)
    
    status = Column(SQLEnum(ItemStatus), default=ItemStatus.PENDING, nullable=False)
    
    completed_at = Column(DateTime(timezone=True), nullable=True)
    actual_duration_minutes = Column(Integer, nullable=True)
    
    order_number = Column(Integer, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    plan = relationship("StudyPlan", back_populates="items")


class DailyRoutine(Base):
    __tablename__ = "daily_routines"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    day_of_week = Column(Integer, nullable=False)
    
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    
    activity_type = Column(String(100), nullable=False)
    
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    student = relationship("User", back_populates="routines")


class UserBook(Base):
    __tablename__ = "user_books"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    book_name = Column(String(255), nullable=False)
    subject = Column(String(100), nullable=False)
    publisher = Column(String(255), nullable=True)
    
    total_pages = Column(Integer, nullable=True)
    current_page = Column(Integer, default=0)
    
    is_primary = Column(Boolean, default=False)
    
    added_at = Column(DateTime(timezone=True), server_default=func.now())
    
    student = relationship("User", back_populates="books")
