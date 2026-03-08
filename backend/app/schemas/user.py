from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from app.models.user import UserRole


class UserCreate(BaseModel):
    email: EmailStr
    phone: Optional[str] = None
    password: str = Field(..., min_length=8)
    full_name: str
    target_exam_date: Optional[datetime] = None
    target_university: Optional[str] = None
    target_department: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    phone: Optional[str]
    full_name: str
    role: UserRole
    is_active: bool
    is_verified: bool
    target_exam_date: Optional[datetime]
    target_university: Optional[str]
    target_department: Optional[str]
    points: int
    streak_days: int
    created_at: datetime

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    target_exam_date: Optional[datetime] = None
    target_university: Optional[str] = None
    target_department: Optional[str] = None


class ParentInfoCreate(BaseModel):
    parent_name: str
    parent_email: Optional[EmailStr] = None
    parent_phone: str
    send_weekly_report: bool = True
    send_notifications: bool = True


class ParentInfoResponse(BaseModel):
    id: int
    parent_name: str
    parent_email: Optional[str]
    parent_phone: str
    send_weekly_report: bool
    send_notifications: bool

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[int] = None
