from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON, Float, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.core.database import Base


class QuestionDifficulty(str, enum.Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class SubjectArea(str, enum.Enum):
    MATEMATIK = "matematik"
    FIZIK = "fizik"
    KIMYA = "kimya"
    BIYOLOJI = "biyoloji"
    TURKCE = "turkce"
    TARIH = "tarih"
    COGRAFYA = "cografya"
    FELSEFE = "felsefe"
    DIN = "din"
    INGILIZCE = "ingilizce"


class AssessmentTest(Base):
    __tablename__ = "assessment_tests"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    subject = Column(SQLEnum(SubjectArea), nullable=False)
    
    total_questions = Column(Integer, nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    questions = relationship("AssessmentQuestion", back_populates="test", cascade="all, delete-orphan")
    student_assessments = relationship("StudentAssessment", back_populates="test", cascade="all, delete-orphan")


class AssessmentQuestion(Base):
    __tablename__ = "assessment_questions"

    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, ForeignKey("assessment_tests.id", ondelete="CASCADE"), nullable=False)
    
    question_text = Column(Text, nullable=False)
    question_image_url = Column(String(500), nullable=True)
    
    option_a = Column(Text, nullable=False)
    option_b = Column(Text, nullable=False)
    option_c = Column(Text, nullable=False)
    option_d = Column(Text, nullable=False)
    option_e = Column(Text, nullable=True)
    
    correct_answer = Column(String(1), nullable=False)
    
    difficulty = Column(SQLEnum(QuestionDifficulty), nullable=False)
    topic = Column(String(255), nullable=False)
    subtopic = Column(String(255), nullable=True)
    
    explanation = Column(Text, nullable=True)
    video_solution_url = Column(String(500), nullable=True)
    
    order_number = Column(Integer, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    test = relationship("AssessmentTest", back_populates="questions")
    answers = relationship("AssessmentAnswer", back_populates="question", cascade="all, delete-orphan")


class StudentAssessment(Base):
    __tablename__ = "student_assessments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    test_id = Column(Integer, ForeignKey("assessment_tests.id", ondelete="CASCADE"), nullable=False)
    
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    is_completed = Column(Boolean, default=False)
    
    total_questions = Column(Integer, nullable=False)
    correct_answers = Column(Integer, default=0)
    wrong_answers = Column(Integer, default=0)
    empty_answers = Column(Integer, default=0)
    
    score_percentage = Column(Float, default=0.0)
    
    student = relationship("User", back_populates="assessments")
    test = relationship("AssessmentTest", back_populates="student_assessments")
    answers = relationship("AssessmentAnswer", back_populates="assessment", cascade="all, delete-orphan")
    result = relationship("AssessmentResult", back_populates="assessment", uselist=False, cascade="all, delete-orphan")


class AssessmentAnswer(Base):
    __tablename__ = "assessment_answers"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("student_assessments.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(Integer, ForeignKey("assessment_questions.id", ondelete="CASCADE"), nullable=False)
    
    selected_answer = Column(String(1), nullable=True)
    is_correct = Column(Boolean, nullable=True)
    
    time_spent_seconds = Column(Integer, nullable=True)
    
    answered_at = Column(DateTime(timezone=True), server_default=func.now())
    
    assessment = relationship("StudentAssessment", back_populates="answers")
    question = relationship("AssessmentQuestion", back_populates="answers")


class AssessmentResult(Base):
    __tablename__ = "assessment_results"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("student_assessments.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    overall_level = Column(String(50), nullable=False)
    
    strengths = Column(JSON, nullable=True)
    weaknesses = Column(JSON, nullable=True)
    
    topic_scores = Column(JSON, nullable=True)
    
    recommended_study_hours_per_week = Column(Integer, nullable=True)
    estimated_completion_weeks = Column(Integer, nullable=True)
    
    ai_analysis = Column(Text, nullable=True)
    ai_recommendations = Column(JSON, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    assessment = relationship("StudentAssessment", back_populates="result")
