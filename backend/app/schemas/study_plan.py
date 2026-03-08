from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime, time
from app.models.study_plan import PlanStatus, ItemStatus


class StudyPlanItemResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    subject: str
    topic: str
    book_name: Optional[str]
    video_url: Optional[str]
    video_instructor: Optional[str]
    scheduled_date: datetime
    estimated_duration_minutes: int
    status: ItemStatus
    order_number: int

    class Config:
        from_attributes = True


class StudyPlanResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    start_date: datetime
    end_date: datetime
    status: PlanStatus
    total_study_hours: int
    weekly_study_hours: int
    progress_percentage: int
    is_on_track: bool
    items: Optional[List[StudyPlanItemResponse]] = None

    class Config:
        from_attributes = True


class StudyPlanCreate(BaseModel):
    assessment_result_id: int
    weekly_study_hours: int
    preferred_subjects: Optional[List[str]] = None


class DailyRoutineCreate(BaseModel):
    name: str
    description: Optional[str]
    day_of_week: int
    start_time: time
    end_time: time
    activity_type: str


class DailyRoutineResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    day_of_week: int
    start_time: time
    end_time: time
    activity_type: str
    is_active: bool

    class Config:
        from_attributes = True


class UserBookCreate(BaseModel):
    book_name: str
    subject: str
    publisher: Optional[str]
    total_pages: Optional[int]
    is_primary: bool = False


class UserBookResponse(BaseModel):
    id: int
    book_name: str
    subject: str
    publisher: Optional[str]
    total_pages: Optional[int]
    current_page: int
    is_primary: bool

    class Config:
        from_attributes = True
