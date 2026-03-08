from datetime import datetime, timedelta
from typing import Dict, Any


class SpacedRepetitionService:
    """
    Yanlış yapılan soruların tekrar edilmesi için aralıklı tekrar algoritması.
    SM-2 algoritmasının basitleştirilmiş versiyonu.
    """
    
    INITIAL_INTERVAL = 1
    
    INTERVALS = [1, 3, 7, 14, 30, 60, 120]
    
    @staticmethod
    def calculate_next_review(
        review_count: int,
        last_reviewed_at: datetime,
        is_correct: bool = True
    ) -> Dict[str, Any]:
        """
        Bir sonraki tekrar tarihini hesaplar.
        
        Args:
            review_count: Şu ana kadar kaç kez tekrar edildi
            last_reviewed_at: Son tekrar tarihi
            is_correct: Son tekrarda doğru yapıldı mı
            
        Returns:
            next_review_at: Bir sonraki tekrar tarihi
            interval_days: Aralık (gün)
            is_mastered: Soru öğrenildi mi
        """
        
        if not is_correct:
            interval_days = SpacedRepetitionService.INITIAL_INTERVAL
            new_review_count = 0
        else:
            new_review_count = review_count + 1
            
            if new_review_count >= len(SpacedRepetitionService.INTERVALS):
                interval_days = SpacedRepetitionService.INTERVALS[-1]
                is_mastered = True
            else:
                interval_days = SpacedRepetitionService.INTERVALS[new_review_count]
                is_mastered = False
        
        next_review_at = last_reviewed_at + timedelta(days=interval_days)
        
        return {
            "next_review_at": next_review_at,
            "interval_days": interval_days,
            "review_count": new_review_count,
            "is_mastered": is_mastered if is_correct else False
        }
    
    @staticmethod
    def get_due_questions(
        question_reviews: list,
        current_date: datetime = None
    ) -> list:
        """
        Bugün tekrar edilmesi gereken soruları getirir.
        """
        if current_date is None:
            current_date = datetime.utcnow()
        
        due_questions = []
        
        for review in question_reviews:
            if review.is_mastered:
                continue
            
            if review.next_review_at is None or review.next_review_at <= current_date:
                due_questions.append(review)
        
        return due_questions
    
    @staticmethod
    def prioritize_questions(question_reviews: list) -> list:
        """
        Soruları öncelik sırasına göre sıralar.
        
        Öncelik kriterleri:
        1. Vadesi geçmiş sorular
        2. Daha az tekrar edilmiş sorular
        3. Daha zor sorular
        """
        current_date = datetime.utcnow()
        
        def priority_score(review):
            overdue_days = (current_date - review.next_review_at).days if review.next_review_at else 0
            overdue_score = max(0, overdue_days) * 10
            
            review_score = (10 - review.review_count) * 5
            
            return overdue_score + review_score
        
        return sorted(question_reviews, key=priority_score, reverse=True)
    
    @staticmethod
    def get_daily_review_quota(student_level: str = "orta") -> int:
        """
        Öğrenci seviyesine göre günlük tekrar kotası.
        """
        quotas = {
            "başlangıç": 10,
            "orta": 15,
            "ileri": 20
        }
        
        return quotas.get(student_level.lower(), 15)
    
    @staticmethod
    def calculate_mastery_percentage(question_reviews: list) -> float:
        """
        Öğrenilmiş soru yüzdesini hesaplar.
        """
        if not question_reviews:
            return 0.0
        
        mastered_count = sum(1 for review in question_reviews if review.is_mastered)
        
        return (mastered_count / len(question_reviews)) * 100
