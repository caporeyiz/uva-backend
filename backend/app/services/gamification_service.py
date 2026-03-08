from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User
from app.models.progress import Achievement, UserAchievement, DailyProgress


class GamificationService:
    """
    Oyunlaştırma sistemi - puan, başarı, streak yönetimi
    """
    
    POINTS = {
        "question_solved": 10,
        "question_correct": 5,
        "daily_goal_completed": 50,
        "weekly_goal_completed": 200,
        "streak_day": 20,
        "assessment_completed": 100,
        "exam_uploaded": 75,
        "study_hour": 15,
    }
    
    @staticmethod
    async def award_points(
        db: AsyncSession,
        user: User,
        action: str,
        amount: Optional[int] = None
    ) -> int:
        """
        Kullanıcıya puan verir.
        """
        points = amount or GamificationService.POINTS.get(action, 0)
        
        user.points += points
        await db.commit()
        
        return points
    
    @staticmethod
    async def update_streak(
        db: AsyncSession,
        user: User,
        activity_date: datetime = None
    ) -> Dict[str, Any]:
        """
        Kullanıcının streak'ini günceller.
        """
        if activity_date is None:
            activity_date = datetime.utcnow()
        
        if user.last_activity_date is None:
            user.streak_days = 1
            user.last_activity_date = activity_date
            await db.commit()
            return {"streak_days": 1, "streak_broken": False}
        
        days_diff = (activity_date.date() - user.last_activity_date.date()).days
        
        if days_diff == 0:
            return {"streak_days": user.streak_days, "streak_broken": False}
        
        elif days_diff == 1:
            user.streak_days += 1
            user.last_activity_date = activity_date
            
            points_awarded = await GamificationService.award_points(
                db, user, "streak_day"
            )
            
            await db.commit()
            return {
                "streak_days": user.streak_days,
                "streak_broken": False,
                "points_awarded": points_awarded
            }
        
        else:
            old_streak = user.streak_days
            user.streak_days = 1
            user.last_activity_date = activity_date
            await db.commit()
            return {
                "streak_days": 1,
                "streak_broken": True,
                "old_streak": old_streak
            }
    
    @staticmethod
    async def check_and_award_achievements(
        db: AsyncSession,
        user: User,
        context: Dict[str, Any]
    ) -> List[Achievement]:
        """
        Kullanıcının yeni başarılar kazanıp kazanmadığını kontrol eder.
        """
        result = await db.execute(select(Achievement).where(Achievement.is_active == True))
        all_achievements = result.scalars().all()
        
        result = await db.execute(
            select(UserAchievement).where(UserAchievement.user_id == user.id)
        )
        user_achievements = result.scalars().all()
        unlocked_achievement_ids = {ua.achievement_id for ua in user_achievements}
        
        newly_unlocked = []
        
        for achievement in all_achievements:
            if achievement.id in unlocked_achievement_ids:
                continue
            
            if GamificationService._check_achievement_requirement(
                achievement, user, context
            ):
                user_achievement = UserAchievement(
                    user_id=user.id,
                    achievement_id=achievement.id,
                    progress_value=achievement.requirement_value
                )
                db.add(user_achievement)
                
                user.points += achievement.points_reward
                
                newly_unlocked.append(achievement)
        
        if newly_unlocked:
            await db.commit()
        
        return newly_unlocked
    
    @staticmethod
    def _check_achievement_requirement(
        achievement: Achievement,
        user: User,
        context: Dict[str, Any]
    ) -> bool:
        """
        Başarı gereksinimini kontrol eder.
        """
        req_type = achievement.requirement_type
        req_value = achievement.requirement_value
        
        if req_type == "total_points":
            return user.points >= req_value
        
        elif req_type == "streak_days":
            return user.streak_days >= req_value
        
        elif req_type == "questions_solved":
            return context.get("total_questions_solved", 0) >= req_value
        
        elif req_type == "exams_completed":
            return context.get("total_exams", 0) >= req_value
        
        elif req_type == "study_hours":
            return context.get("total_study_hours", 0) >= req_value
        
        elif req_type == "assessments_completed":
            return context.get("total_assessments", 0) >= req_value
        
        return False
    
    @staticmethod
    async def get_leaderboard(
        db: AsyncSession,
        limit: int = 10,
        period: str = "all_time"
    ) -> List[Dict[str, Any]]:
        """
        Lider tablosunu getirir.
        """
        query = select(User).where(User.is_active == True)
        
        if period == "weekly":
            week_ago = datetime.utcnow() - timedelta(days=7)
            query = query.where(User.last_activity_date >= week_ago)
        elif period == "monthly":
            month_ago = datetime.utcnow() - timedelta(days=30)
            query = query.where(User.last_activity_date >= month_ago)
        
        query = query.order_by(User.points.desc()).limit(limit)
        
        result = await db.execute(query)
        users = result.scalars().all()
        
        leaderboard = []
        for rank, user in enumerate(users, 1):
            leaderboard.append({
                "rank": rank,
                "user_id": user.id,
                "full_name": user.full_name,
                "points": user.points,
                "streak_days": user.streak_days
            })
        
        return leaderboard
    
    @staticmethod
    def calculate_level(points: int) -> Dict[str, Any]:
        """
        Puana göre seviye hesaplar.
        """
        level = 1
        points_for_next_level = 100
        
        while points >= points_for_next_level:
            level += 1
            points_for_next_level = level * 100
        
        current_level_points = (level - 1) * 100
        progress_percentage = ((points - current_level_points) / (points_for_next_level - current_level_points)) * 100
        
        return {
            "level": level,
            "current_points": points,
            "points_for_next_level": points_for_next_level,
            "progress_percentage": round(progress_percentage, 2)
        }
