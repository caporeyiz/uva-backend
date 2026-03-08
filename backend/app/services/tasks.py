from app.services.celery_app import celery_app
from app.services.ai_service import AIService
from app.services.ocr_service import OCRService
from app.services.notification_service import NotificationService
from app.core.database import AsyncSessionLocal
from sqlalchemy import select
from app.models.assessment import StudentAssessment, AssessmentResult
from app.models.exam import ExamAttempt, ExamAnalysis
from app.models.user import User
import logging

logger = logging.getLogger(__name__)


@celery_app.task(name="analyze_assessment_result")
def analyze_assessment_result_task(assessment_id: int):
    """
    Seviye tespit sınavı sonucunu AI ile analiz eder (background task).
    """
    import asyncio
    
    async def _analyze():
        async with AsyncSessionLocal() as db:
            result = await db.execute(
                select(StudentAssessment).where(StudentAssessment.id == assessment_id)
            )
            assessment = result.scalar_one_or_none()
            
            if not assessment or not assessment.is_completed:
                logger.error(f"Assessment {assessment_id} not found or not completed")
                return
            
            existing_result = await db.execute(
                select(AssessmentResult).where(AssessmentResult.assessment_id == assessment_id)
            )
            if existing_result.scalar_one_or_none():
                logger.info(f"Assessment {assessment_id} already analyzed")
                return
            
            assessment_data = {
                "correct_answers": assessment.correct_answers,
                "wrong_answers": assessment.wrong_answers,
                "total_questions": assessment.total_questions,
                "score_percentage": assessment.score_percentage
            }
            
            answers = [
                {
                    "question_id": a.question_id,
                    "is_correct": a.is_correct,
                    "selected_answer": a.selected_answer
                }
                for a in assessment.answers
            ]
            
            questions = [
                {
                    "id": q.id,
                    "topic": q.topic,
                    "subtopic": q.subtopic,
                    "difficulty": q.difficulty
                }
                for q in assessment.test.questions
            ]
            
            ai_result = await AIService.analyze_assessment_result(
                assessment_data, answers, questions
            )
            
            assessment_result = AssessmentResult(
                assessment_id=assessment_id,
                overall_level=ai_result["overall_level"],
                strengths=ai_result["strengths"],
                weaknesses=ai_result["weaknesses"],
                topic_scores=ai_result["topic_scores"],
                recommended_study_hours_per_week=ai_result["recommended_study_hours_per_week"],
                estimated_completion_weeks=ai_result["estimated_completion_weeks"],
                ai_analysis=ai_result["ai_analysis"],
                ai_recommendations=ai_result["ai_recommendations"]
            )
            
            db.add(assessment_result)
            await db.commit()
            
            logger.info(f"Assessment {assessment_id} analyzed successfully")
    
    asyncio.run(_analyze())


@celery_app.task(name="analyze_exam_attempt")
def analyze_exam_attempt_task(exam_id: int):
    """
    Deneme sınavını AI ile analiz eder (background task).
    """
    import asyncio
    
    async def _analyze():
        async with AsyncSessionLocal() as db:
            result = await db.execute(
                select(ExamAttempt).where(ExamAttempt.id == exam_id)
            )
            exam = result.scalar_one_or_none()
            
            if not exam:
                logger.error(f"Exam {exam_id} not found")
                return
            
            exam_data = {
                "net_score": exam.net_score,
                "matematik_net": exam.matematik_net,
                "fizik_net": exam.fizik_net,
                "kimya_net": exam.kimya_net,
                "biyoloji_net": exam.biyoloji_net,
                "turkce_net": exam.turkce_net
            }
            
            questions = [
                {
                    "id": q.id,
                    "subject": q.subject,
                    "topic": q.topic
                }
                for q in exam.questions
            ]
            
            answers = [
                {
                    "question_id": a.question_id,
                    "is_correct": a.is_correct
                }
                for a in exam.answers
            ]
            
            ai_result = await AIService.analyze_exam_attempt(
                exam_data, questions, answers
            )
            
            exam_analysis = ExamAnalysis(
                exam_attempt_id=exam_id,
                overall_performance=ai_result["overall_performance"],
                strong_subjects=ai_result["strong_subjects"],
                weak_subjects=ai_result["weak_subjects"],
                topic_breakdown=ai_result["topic_breakdown"],
                improvement_areas=ai_result["improvement_areas"],
                ai_feedback=ai_result["ai_feedback"],
                ai_recommendations=ai_result["ai_recommendations"],
                estimated_study_hours_needed=ai_result["estimated_study_hours_needed"]
            )
            
            db.add(exam_analysis)
            exam.is_analyzed = True
            await db.commit()
            
            logger.info(f"Exam {exam_id} analyzed successfully")
    
    asyncio.run(_analyze())


@celery_app.task(name="send_daily_reminders")
def send_daily_reminders_task():
    """
    Günlük hatırlatıcıları gönderir.
    """
    import asyncio
    
    async def _send():
        async with AsyncSessionLocal() as db:
            result = await db.execute(
                select(User).where(User.is_active == True)
            )
            users = result.scalars().all()
            
            notification_service = NotificationService()
            
            for user in users:
                user_data = {
                    "full_name": user.full_name,
                    "email": user.email,
                    "phone": user.phone
                }
                
                await notification_service.send_study_reminder(user_data)
            
            logger.info(f"Daily reminders sent to {len(users)} users")
    
    asyncio.run(_send())


@celery_app.task(name="generate_weekly_reports")
def generate_weekly_reports_task():
    """
    Haftalık raporları oluşturur ve velilere gönderir.
    """
    logger.info("Weekly report generation task - to be implemented")


@celery_app.task(name="process_exam_ocr")
def process_exam_ocr_task(exam_id: int, image_path: str):
    """
    Sınav görüntüsünü OCR ile işler.
    """
    import asyncio
    
    async def _process():
        try:
            ocr_service = OCRService()
            
            exam_data = ocr_service.parse_exam_sheet(image_path)
            
            logger.info(f"OCR processed for exam {exam_id}: {exam_data['total_questions']} questions found")
            
        except Exception as e:
            logger.error(f"OCR processing error for exam {exam_id}: {str(e)}")
    
    asyncio.run(_process())
