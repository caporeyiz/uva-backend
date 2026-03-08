from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.models.assessment import QuestionDifficulty, SubjectArea


class AssessmentQuestionResponse(BaseModel):
    id: int
    question_text: str
    question_image_url: Optional[str]
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    option_e: Optional[str]
    difficulty: QuestionDifficulty
    topic: str
    subtopic: Optional[str]
    order_number: int

    class Config:
        from_attributes = True


class AssessmentTestResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    subject: SubjectArea
    total_questions: int
    duration_minutes: int
    questions: Optional[List[AssessmentQuestionResponse]] = None

    class Config:
        from_attributes = True


class StudentAssessmentCreate(BaseModel):
    test_id: int


class AssessmentAnswerCreate(BaseModel):
    question_id: int
    selected_answer: Optional[str] = None
    time_spent_seconds: Optional[int] = None


class StudentAssessmentResponse(BaseModel):
    id: int
    test_id: int
    started_at: datetime
    completed_at: Optional[datetime]
    is_completed: bool
    total_questions: int
    correct_answers: int
    wrong_answers: int
    empty_answers: int
    score_percentage: float

    class Config:
        from_attributes = True


class AssessmentResultResponse(BaseModel):
    id: int
    assessment_id: int
    overall_level: str
    strengths: Optional[List[str]]
    weaknesses: Optional[List[str]]
    topic_scores: Optional[Dict[str, Any]]
    recommended_study_hours_per_week: Optional[int]
    estimated_completion_weeks: Optional[int]
    ai_analysis: Optional[str]
    ai_recommendations: Optional[List[str]]
    created_at: datetime

    class Config:
        from_attributes = True
