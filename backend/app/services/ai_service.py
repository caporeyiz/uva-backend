from typing import Dict, List, Any, Optional
from openai import AsyncOpenAI
from app.core.config import settings
import json

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)


class AIService:
    
    @staticmethod
    async def analyze_assessment_result(
        assessment_data: Dict[str, Any],
        answers: List[Dict[str, Any]],
        questions: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Seviye tespit sınavı sonuçlarını analiz eder ve öğrenci profili oluşturur.
        """
        
        correct_count = assessment_data.get("correct_answers", 0)
        total_count = assessment_data.get("total_questions", 1)
        score_percentage = (correct_count / total_count) * 100
        
        topic_performance = {}
        for answer in answers:
            question = next((q for q in questions if q["id"] == answer["question_id"]), None)
            if question:
                topic = question.get("topic", "Unknown")
                if topic not in topic_performance:
                    topic_performance[topic] = {"correct": 0, "total": 0}
                topic_performance[topic]["total"] += 1
                if answer.get("is_correct"):
                    topic_performance[topic]["correct"] += 1
        
        topic_scores = {
            topic: (data["correct"] / data["total"] * 100) if data["total"] > 0 else 0
            for topic, data in topic_performance.items()
        }
        
        strengths = [topic for topic, score in topic_scores.items() if score >= 70]
        weaknesses = [topic for topic, score in topic_scores.items() if score < 50]
        
        prompt = f"""
Bir YKS öğrencisinin seviye tespit sınavı sonuçlarını analiz et:

Genel Başarı: {score_percentage:.1f}%
Doğru: {correct_count}/{total_count}

Konu Bazlı Performans:
{json.dumps(topic_scores, indent=2, ensure_ascii=False)}

Güçlü Konular: {', '.join(strengths) if strengths else 'Yok'}
Zayıf Konular: {', '.join(weaknesses) if weaknesses else 'Yok'}

Lütfen şunları sağla:
1. Öğrencinin genel seviyesi (Başlangıç/Orta/İleri)
2. Detaylı analiz ve gözlemler
3. Öğrenciye özel öneriler (en az 5 madde)
4. Haftalık önerilen çalışma saati
5. Tahmini tamamlanma süresi (hafta cinsinden)

JSON formatında yanıt ver:
{{
  "overall_level": "string",
  "ai_analysis": "string",
  "ai_recommendations": ["string"],
  "recommended_study_hours_per_week": number,
  "estimated_completion_weeks": number
}}
"""
        
        try:
            response = await client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": "Sen YKS öğrencilerine mentorluk yapan bir eğitim danışmanısın. Türkçe yanıt ver."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            
            return {
                "overall_level": result.get("overall_level", "Orta"),
                "strengths": strengths,
                "weaknesses": weaknesses,
                "topic_scores": topic_scores,
                "recommended_study_hours_per_week": result.get("recommended_study_hours_per_week", 20),
                "estimated_completion_weeks": result.get("estimated_completion_weeks", 12),
                "ai_analysis": result.get("ai_analysis", ""),
                "ai_recommendations": result.get("ai_recommendations", [])
            }
            
        except Exception as e:
            return {
                "overall_level": "Orta" if score_percentage >= 50 else "Başlangıç",
                "strengths": strengths,
                "weaknesses": weaknesses,
                "topic_scores": topic_scores,
                "recommended_study_hours_per_week": 20,
                "estimated_completion_weeks": 12,
                "ai_analysis": f"Analiz sırasında hata oluştu: {str(e)}",
                "ai_recommendations": ["Düzenli çalışma yapın", "Zayıf konulara odaklanın"]
            }
    
    @staticmethod
    async def generate_study_plan(
        student_profile: Dict[str, Any],
        assessment_result: Dict[str, Any],
        available_hours_per_week: int,
        target_exam_date: Optional[str] = None,
        user_books: List[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Öğrenci profiline göre kişiselleştirilmiş çalışma planı oluşturur.
        """
        
        prompt = f"""
YKS öğrencisi için kişiselleştirilmiş çalışma planı oluştur:

Öğrenci Profili:
- Seviye: {assessment_result.get('overall_level', 'Orta')}
- Güçlü Konular: {', '.join(assessment_result.get('strengths', []))}
- Zayıf Konular: {', '.join(assessment_result.get('weaknesses', []))}
- Haftalık Çalışma Saati: {available_hours_per_week}
- Hedef Sınav Tarihi: {target_exam_date or 'Belirtilmemiş'}

Konu Performansları:
{json.dumps(assessment_result.get('topic_scores', {}), indent=2, ensure_ascii=False)}

Lütfen 4 haftalık detaylı çalışma planı oluştur. Her hafta için:
- Odaklanılacak konular (zayıf konulara öncelik ver)
- Günlük çalışma programı
- Video kaynak önerileri
- Soru çözüm hedefleri

JSON formatında yanıt ver:
{{
  "plan_name": "string",
  "plan_description": "string",
  "total_weeks": number,
  "weekly_breakdown": [
    {{
      "week_number": number,
      "focus_topics": ["string"],
      "daily_tasks": [
        {{
          "day": number,
          "subject": "string",
          "topic": "string",
          "duration_minutes": number,
          "task_type": "string",
          "description": "string"
        }}
      ]
    }}
  ]
}}
"""
        
        try:
            response = await client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": "Sen YKS öğrencileri için çalışma planı hazırlayan bir eğitim danışmanısın. Türkçe yanıt ver."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            return result
            
        except Exception as e:
            return {
                "plan_name": "Temel Çalışma Planı",
                "plan_description": f"Plan oluşturma hatası: {str(e)}",
                "total_weeks": 4,
                "weekly_breakdown": []
            }
    
    @staticmethod
    async def analyze_exam_attempt(
        exam_data: Dict[str, Any],
        questions: List[Dict[str, Any]],
        answers: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Deneme sınavı sonuçlarını analiz eder ve detaylı geri bildirim sağlar.
        """
        
        net_score = exam_data.get("net_score", 0)
        subject_nets = {
            "Matematik": exam_data.get("matematik_net", 0),
            "Fizik": exam_data.get("fizik_net", 0),
            "Kimya": exam_data.get("kimya_net", 0),
            "Biyoloji": exam_data.get("biyoloji_net", 0),
            "Türkçe": exam_data.get("turkce_net", 0),
        }
        
        strong_subjects = [subj for subj, net in subject_nets.items() if net >= 15]
        weak_subjects = [subj for subj, net in subject_nets.items() if net < 10]
        
        prompt = f"""
YKS deneme sınavı sonucunu analiz et:

Toplam Net: {net_score}

Ders Bazlı Netler:
{json.dumps(subject_nets, indent=2, ensure_ascii=False)}

Güçlü Dersler: {', '.join(strong_subjects) if strong_subjects else 'Yok'}
Zayıf Dersler: {', '.join(weak_subjects) if weak_subjects else 'Yok'}

Lütfen şunları sağla:
1. Genel performans değerlendirmesi
2. Her ders için detaylı analiz
3. Gelişim alanları (en az 5 madde)
4. Bir sonraki deneme için stratejiler
5. Tahmini ihtiyaç duyulan çalışma saati

JSON formatında yanıt ver:
{{
  "overall_performance": "string",
  "strong_subjects": ["string"],
  "weak_subjects": ["string"],
  "topic_breakdown": {{}},
  "improvement_areas": ["string"],
  "ai_feedback": "string",
  "ai_recommendations": ["string"],
  "estimated_study_hours_needed": number
}}
"""
        
        try:
            response = await client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": "Sen YKS deneme sınavlarını analiz eden bir eğitim danışmanısın. Türkçe yanıt ver."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            return result
            
        except Exception as e:
            return {
                "overall_performance": "Orta",
                "strong_subjects": strong_subjects,
                "weak_subjects": weak_subjects,
                "topic_breakdown": {},
                "improvement_areas": ["Düzenli çalışma yapın"],
                "ai_feedback": f"Analiz hatası: {str(e)}",
                "ai_recommendations": [],
                "estimated_study_hours_needed": 20
            }
    
    @staticmethod
    async def generate_video_recommendations(
        topic: str,
        student_level: str,
        learning_style: Optional[str] = None
    ) -> List[Dict[str, str]]:
        """
        Belirli bir konu için video kaynak önerileri oluşturur.
        """
        
        prompt = f"""
YKS öğrencisi için "{topic}" konusunda video kaynak öner.

Öğrenci Seviyesi: {student_level}
Öğrenme Stili: {learning_style or 'Belirtilmemiş'}

Popüler YKS hocalarından (Aydın Yayınları, Tonguç Akademi, vb.) 5 video önerisi yap.

JSON formatında yanıt ver:
{{
  "recommendations": [
    {{
      "instructor": "string",
      "video_title": "string",
      "platform": "string",
      "difficulty": "string",
      "duration_estimate": "string",
      "tags": ["string"]
    }}
  ]
}}
"""
        
        try:
            response = await client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": "Sen YKS öğrencilerine video kaynak öneren bir danışmansın. Türkçe yanıt ver."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            return result.get("recommendations", [])
            
        except Exception as e:
            return []
