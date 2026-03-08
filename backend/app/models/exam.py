from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class ExamAttempt(Base):
    __tablename__ = "exam_attempts"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    exam_name = Column(String(255), nullable=False)
    exam_type = Column(String(100), nullable=False)
    exam_date = Column(DateTime(timezone=True), nullable=False)
    
    uploaded_image_url = Column(String(500), nullable=True)
    uploaded_pdf_url = Column(String(500), nullable=True)
    
    total_questions = Column(Integer, nullable=False)
    correct_answers = Column(Integer, default=0)
    wrong_answers = Column(Integer, default=0)
    empty_answers = Column(Integer, default=0)
    
    net_score = Column(Float, default=0.0)
    
    matematik_net = Column(Float, default=0.0)
    fizik_net = Column(Float, default=0.0)
    kimya_net = Column(Float, default=0.0)
    biyoloji_net = Column(Float, default=0.0)
    turkce_net = Column(Float, default=0.0)
    tarih_net = Column(Float, default=0.0)
    cografya_net = Column(Float, default=0.0)
    felsefe_net = Column(Float, default=0.0)
    din_net = Column(Float, default=0.0)
    ingilizce_net = Column(Float, default=0.0)
    
    is_analyzed = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    student = relationship("User", back_populates="exam_attempts")
    questions = relationship("ExamQuestion", back_populates="exam_attempt", cascade="all, delete-orphan")
    answers = relationship("ExamAnswer", back_populates="exam_attempt", cascade="all, delete-orphan")
    analysis = relationship("ExamAnalysis", back_populates="exam_attempt", uselist=False, cascade="all, delete-orphan")


class ExamQuestion(Base):
    __tablename__ = "exam_questions"

    id = Column(Integer, primary_key=True, index=True)
    exam_attempt_id = Column(Integer, ForeignKey("exam_attempts.id", ondelete="CASCADE"), nullable=False)
    
    question_number = Column(Integer, nullable=False)
    subject = Column(String(100), nullable=False)
    topic = Column(String(255), nullable=True)
    
    question_text = Column(Text, nullable=True)
    question_image_url = Column(String(500), nullable=True)
    
    correct_answer = Column(String(1), nullable=True)
    
    difficulty_estimated = Column(String(50), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    exam_attempt = relationship("ExamAttempt", back_populates="questions")
    reviews = relationship("QuestionReview", back_populates="question", cascade="all, delete-orphan")


class ExamAnswer(Base):
    __tablename__ = "exam_answers"

    id = Column(Integer, primary_key=True, index=True)
    exam_attempt_id = Column(Integer, ForeignKey("exam_attempts.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(Integer, ForeignKey("exam_questions.id", ondelete="CASCADE"), nullable=False)
    
    selected_answer = Column(String(1), nullable=True)
    is_correct = Column(Boolean, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    exam_attempt = relationship("ExamAttempt", back_populates="answers")


class ExamAnalysis(Base):
    __tablename__ = "exam_analyses"

    id = Column(Integer, primary_key=True, index=True)
    exam_attempt_id = Column(Integer, ForeignKey("exam_attempts.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    overall_performance = Column(String(100), nullable=True)
    
    strong_subjects = Column(JSON, nullable=True)
    weak_subjects = Column(JSON, nullable=True)
    
    topic_breakdown = Column(JSON, nullable=True)
    
    improvement_areas = Column(JSON, nullable=True)
    
    ai_feedback = Column(Text, nullable=True)
    ai_recommendations = Column(JSON, nullable=True)
    
    estimated_study_hours_needed = Column(Integer, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    exam_attempt = relationship("ExamAttempt", back_populates="analysis")


class QuestionReview(Base):
    __tablename__ = "question_reviews"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("exam_questions.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    review_count = Column(Integer, default=0)
    
    last_reviewed_at = Column(DateTime(timezone=True), nullable=True)
    next_review_at = Column(DateTime(timezone=True), nullable=True)
    
    is_mastered = Column(Boolean, default=False)
    
    interval_days = Column(Integer, default=1)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    question = relationship("ExamQuestion", back_populates="reviews")
