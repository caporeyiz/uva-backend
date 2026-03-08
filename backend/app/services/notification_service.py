from typing import Dict, List, Any, Optional
from twilio.rest import Client
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class NotificationService:
    
    def __init__(self):
        if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN:
            self.twilio_client = Client(
                settings.TWILIO_ACCOUNT_SID,
                settings.TWILIO_AUTH_TOKEN
            )
        else:
            self.twilio_client = None
            
        if settings.SENDGRID_API_KEY:
            self.sendgrid_client = SendGridAPIClient(settings.SENDGRID_API_KEY)
        else:
            self.sendgrid_client = None
    
    async def send_sms(self, to_phone: str, message: str) -> bool:
        """
        SMS gönderir.
        """
        if not self.twilio_client:
            logger.warning("Twilio not configured. SMS not sent.")
            return False
        
        try:
            message = self.twilio_client.messages.create(
                body=message,
                from_=settings.TWILIO_PHONE_NUMBER,
                to=to_phone
            )
            logger.info(f"SMS sent to {to_phone}: {message.sid}")
            return True
            
        except Exception as e:
            logger.error(f"SMS send error: {str(e)}")
            return False
    
    async def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        plain_content: Optional[str] = None
    ) -> bool:
        """
        Email gönderir.
        """
        if not self.sendgrid_client:
            logger.warning("SendGrid not configured. Email not sent.")
            return False
        
        try:
            message = Mail(
                from_email=settings.SENDGRID_FROM_EMAIL,
                to_emails=to_email,
                subject=subject,
                html_content=html_content,
                plain_text_content=plain_content or ""
            )
            
            response = self.sendgrid_client.send(message)
            logger.info(f"Email sent to {to_email}: {response.status_code}")
            return True
            
        except Exception as e:
            logger.error(f"Email send error: {str(e)}")
            return False
    
    async def send_study_reminder(self, user_data: Dict[str, Any]) -> bool:
        """
        Çalışma hatırlatıcısı gönderir.
        """
        message = f"""
Merhaba {user_data['full_name']},

Bugünkü çalışma planınızı tamamlamayı unutmayın! 🎯

Hedeflerinize ulaşmak için her gün düzenli çalışmak önemli.

YKS Mentor
"""
        
        if user_data.get('phone'):
            await self.send_sms(user_data['phone'], message)
        
        if user_data.get('email'):
            html = f"""
<html>
<body>
    <h2>Çalışma Hatırlatıcısı</h2>
    <p>Merhaba {user_data['full_name']},</p>
    <p>Bugünkü çalışma planınızı tamamlamayı unutmayın! 🎯</p>
    <p>Hedeflerinize ulaşmak için her gün düzenli çalışmak önemli.</p>
    <br>
    <p>YKS Mentor</p>
</body>
</html>
"""
            await self.send_email(
                user_data['email'],
                "Çalışma Hatırlatıcısı",
                html,
                message
            )
        
        return True
    
    async def send_weekly_report_to_parent(
        self,
        parent_data: Dict[str, Any],
        student_data: Dict[str, Any],
        report_data: Dict[str, Any]
    ) -> bool:
        """
        Veliye haftalık rapor gönderir.
        """
        html = f"""
<html>
<body>
    <h2>Haftalık İlerleme Raporu</h2>
    <p>Sayın {parent_data['parent_name']},</p>
    
    <p><strong>{student_data['full_name']}</strong> adlı öğrencinizin bu haftaki performansı:</p>
    
    <ul>
        <li>Toplam Çalışma Süresi: {report_data.get('total_study_minutes', 0) // 60} saat</li>
        <li>Çözülen Soru Sayısı: {report_data.get('total_questions_solved', 0)}</li>
        <li>Doğruluk Oranı: %{report_data.get('accuracy_percentage', 0)}</li>
        <li>Kazanılan Puan: {report_data.get('points_earned', 0)}</li>
    </ul>
    
    <h3>AI Değerlendirmesi:</h3>
    <p>{report_data.get('ai_summary', 'Değerlendirme yapılmadı.')}</p>
    
    <br>
    <p>YKS Mentor</p>
</body>
</html>
"""
        
        plain = f"""
Haftalık İlerleme Raporu

Sayın {parent_data['parent_name']},

{student_data['full_name']} adlı öğrencinizin bu haftaki performansı:

- Toplam Çalışma Süresi: {report_data.get('total_study_minutes', 0) // 60} saat
- Çözülen Soru Sayısı: {report_data.get('total_questions_solved', 0)}
- Doğruluk Oranı: %{report_data.get('accuracy_percentage', 0)}
- Kazanılan Puan: {report_data.get('points_earned', 0)}

YKS Mentor
"""
        
        if parent_data.get('parent_email'):
            await self.send_email(
                parent_data['parent_email'],
                f"{student_data['full_name']} - Haftalık Rapor",
                html,
                plain
            )
        
        if parent_data.get('parent_phone'):
            sms_message = f"{student_data['full_name']} bu hafta {report_data.get('total_study_minutes', 0) // 60} saat çalıştı ve {report_data.get('total_questions_solved', 0)} soru çözdü. Detaylı rapor email'inize gönderildi."
            await self.send_sms(parent_data['parent_phone'], sms_message)
        
        return True
    
    async def send_achievement_notification(
        self,
        user_data: Dict[str, Any],
        achievement_data: Dict[str, Any]
    ) -> bool:
        """
        Başarı bildirimi gönderir.
        """
        message = f"""
Tebrikler {user_data['full_name']}! 🎉

"{achievement_data['name']}" başarısını kazandınız!

{achievement_data['description']}

+{achievement_data['points_reward']} puan kazandınız!

YKS Mentor
"""
        
        if user_data.get('phone'):
            await self.send_sms(user_data['phone'], message)
        
        return True
