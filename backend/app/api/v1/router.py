from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, assessment, study_plan, exam, progress

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(assessment.router, prefix="/assessment", tags=["Assessment"])
api_router.include_router(study_plan.router, prefix="/study-plan", tags=["Study Plan"])
api_router.include_router(exam.router, prefix="/exam", tags=["Exam"])
api_router.include_router(progress.router, prefix="/progress", tags=["Progress"])
