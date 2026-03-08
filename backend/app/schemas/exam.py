from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime


class ExamAttemptCreate(BaseModel):
    exam_name: str
    exam_type: str
    exam_date: datetime
    uploaded_image_url: Optional[str] = None
    uploaded_pdf_url: Optional[str] = None


class ExamAttemptResponse(BaseModel):
    id: int
    exam_name: str
    exam_type: str
    exam_date: datetime
    total_questions: int
    correct_answers: int
    wrong_answers: int
    empty_answers: int
    net_score: float
    matematik_net: float
    fizik_net: float
    kimya_net: float
    biyoloji_net: float
    turkce_net: float
    is_analyzed: bool
    created_at: datetime

    class Config:
        from_attributes = True


class ExamAnalysisResponse(BaseModel):
    id: int
    exam_attempt_id: int
    overall_performance: Optional[str]
    strong_subjects: Optional[List[str]]
    weak_subjects: Optional[List[str]]
    topic_breakdown: Optional[Dict[str, Any]]
    improvement_areas: Optional[List[str]]
    ai_feedback: Optional[str]
    ai_recommendations: Optional[List[str]]
    estimated_study_hours_needed: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True
