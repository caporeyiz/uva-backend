# YKS Mentor - Sistem Mimarisi

## Genel Bakış

YKS Mentor, öğrencilere AI destekli kişiselleştirilmiş mentorluk sağlayan bir platformdur. Sistem, seviye tespit sınavları, çalışma planı oluşturma, deneme analizi ve ilerleme takibi gibi özellikleri içerir.

## Teknoloji Stack

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL 15+ (async with asyncpg)
- **ORM**: SQLAlchemy 2.0 (async)
- **Migration**: Alembic
- **Cache/Queue**: Redis 7+
- **Task Queue**: Celery
- **Authentication**: JWT (OAuth2)
- **AI**: OpenAI GPT-4
- **OCR**: Tesseract OCR
- **Notifications**: Twilio (SMS), SendGrid (Email)

### Frontend (Arkadaşınız tarafından geliştirilecek)
- Modern web framework (React/Vue/Next.js önerilir)
- REST API tüketimi
- Responsive design

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Development**: Hot reload, debug mode
- **Production**: Gunicorn + Nginx (önerilir)

## Veritabanı Şeması

### Core Tables

#### users
Öğrenci ve admin kullanıcıları
- Kimlik bilgileri (email, phone, password)
- Profil bilgileri (full_name, target_exam_date, vb.)
- Gamification (points, streak_days)
- Role (student/admin)

#### parent_info
Veli bilgileri ve iletişim tercihleri
- Veli iletişim bilgileri
- Bildirim tercihleri

### Assessment System

#### assessment_tests
Seviye tespit sınavları
- Sınav metadata (name, subject, duration)
- Aktif/pasif durumu

#### assessment_questions
Sınav soruları
- Soru metni ve görseli
- Şıklar (A-E)
- Doğru cevap
- Konu/alt konu bilgisi
- Zorluk seviyesi

#### student_assessments
Öğrenci sınav girişimleri
- Başlangıç/bitiş zamanı
- Skor ve doğru/yanlış sayıları
- Tamamlanma durumu

#### assessment_answers
Öğrenci cevapları
- Seçilen cevap
- Doğru/yanlış durumu
- Harcanan süre

#### assessment_results
AI analiz sonuçları
- Genel seviye
- Güçlü/zayıf konular
- Konu bazlı skorlar
- AI önerileri
- Tahmini tamamlanma süresi

### Study Plan System

#### study_plans
Çalışma planları
- Plan metadata (name, dates, status)
- Haftalık çalışma saati
- İlerleme yüzdesi
- AI tarafından oluşturulma bilgisi

#### study_plan_items
Plan maddeleri
- Konu/ders bilgisi
- Kitap/video kaynakları
- Zamanlama
- Durum (pending/in_progress/completed)

#### daily_routines
Günlük rutinler
- Gün ve saat bilgisi
- Aktivite tipi

#### user_books
Kullanıcı kitapları
- Kitap bilgileri
- İlerleme (current_page)

### Exam System

#### exam_attempts
Deneme sınavları
- Sınav metadata
- Yüklenen görsel/PDF
- Net skorlar (ders bazlı)
- Analiz durumu

#### exam_questions
Deneme sınav soruları
- Soru bilgileri
- Konu/zorluk

#### exam_answers
Deneme cevapları

#### exam_analyses
AI deneme analizleri
- Genel performans
- Güçlü/zayıf dersler
- Konu dağılımı
- İyileştirme alanları

#### question_reviews
Spaced repetition sistemi
- Tekrar sayısı
- Son/sonraki tekrar tarihi
- Öğrenilme durumu
- Aralık günleri

### Progress & Gamification

#### daily_progress
Günlük ilerleme
- Çalışma dakikaları
- Çözülen sorular
- Kazanılan puanlar
- Hedef tamamlama

#### weekly_reports
Haftalık raporlar
- Toplam metrikler
- AI özeti
- Veli gönderim durumu

#### monthly_reports
Aylık raporlar
- Aylık metrikler
- Başarı listesi
- AI planlaması

#### achievements
Başarı tanımları
- Başarı metadata
- Gereksinim tipi/değeri
- Puan ödülü

#### user_achievements
Kullanıcı başarıları
- Kazanılma tarihi
- İlerleme değeri

## API Yapısı

### Authentication (`/api/v1/auth`)
- `POST /register` - Kullanıcı kaydı
- `POST /login` - Giriş (JWT token)

### Users (`/api/v1/users`)
- `GET /me` - Kullanıcı profili
- `PUT /me` - Profil güncelleme
- `POST /me/parent-info` - Veli bilgisi ekleme
- `GET /me/parent-info` - Veli bilgisi görüntüleme

### Assessment (`/api/v1/assessment`)
- `GET /tests` - Mevcut testler
- `GET /tests/{id}` - Test detayı
- `POST /start` - Test başlat
- `POST /assessments/{id}/answer` - Cevap gönder
- `POST /assessments/{id}/complete` - Testi tamamla
- `GET /assessments/{id}/result` - Sonuç görüntüle

### Study Plan (`/api/v1/study-plan`)
- `POST /generate` - AI ile plan oluştur
- `GET /my-plans` - Planlarım
- `GET /routines` - Rutinlerim
- `POST /routines` - Rutin ekle
- `GET /books` - Kitaplarım
- `POST /books` - Kitap ekle

### Exam (`/api/v1/exam`)
- `POST /upload` - Deneme yükle
- `GET /my-exams` - Denemelerim
- `GET /{id}/analysis` - Analiz görüntüle
- `POST /{id}/analyze` - Analiz başlat (background)

### Progress (`/api/v1/progress`)
- `GET /daily` - Günlük ilerleme
- `GET /weekly` - Haftalık raporlar
- `GET /monthly` - Aylık raporlar
- `GET /achievements` - Başarılarım

## Servis Katmanı

### AIService
OpenAI GPT-4 entegrasyonu
- `analyze_assessment_result()` - Seviye tespit analizi
- `generate_study_plan()` - Çalışma planı oluşturma
- `analyze_exam_attempt()` - Deneme analizi
- `generate_video_recommendations()` - Video önerileri

### OCRService
Tesseract OCR entegrasyonu
- `extract_text_from_image()` - Görüntüden metin çıkarma
- `extract_text_from_pdf()` - PDF'den metin çıkarma
- `parse_exam_answers()` - Cevap parse etme
- `parse_exam_sheet()` - Optik form okuma
- `calculate_net_scores()` - Net hesaplama

### SpacedRepetitionService
Aralıklı tekrar algoritması (SM-2 benzeri)
- `calculate_next_review()` - Sonraki tekrar tarihi
- `get_due_questions()` - Bugün tekrar edilecekler
- `prioritize_questions()` - Önceliklendirme
- `calculate_mastery_percentage()` - Öğrenme yüzdesi

### NotificationService
Bildirim gönderimi
- `send_sms()` - SMS gönder (Twilio)
- `send_email()` - Email gönder (SendGrid)
- `send_study_reminder()` - Çalışma hatırlatıcısı
- `send_weekly_report_to_parent()` - Veli raporu
- `send_achievement_notification()` - Başarı bildirimi

### GamificationService
Oyunlaştırma sistemi
- `award_points()` - Puan ver
- `update_streak()` - Streak güncelle
- `check_and_award_achievements()` - Başarı kontrol
- `get_leaderboard()` - Lider tablosu
- `calculate_level()` - Seviye hesapla

## Background Tasks (Celery)

### Tasks
- `analyze_assessment_result_task` - Seviye tespit analizi (async)
- `analyze_exam_attempt_task` - Deneme analizi (async)
- `send_daily_reminders_task` - Günlük hatırlatıcılar
- `generate_weekly_reports_task` - Haftalık raporlar
- `process_exam_ocr_task` - OCR işleme

### Scheduling
Celery Beat ile zamanlanmış görevler:
- Günlük hatırlatıcılar (her gün 09:00)
- Haftalık raporlar (her Pazar 20:00)
- Streak kontrolü (her gün 00:00)

## Güvenlik

### Authentication
- JWT token tabanlı
- Access token (30 dakika)
- Refresh token (7 gün)
- Password hashing (bcrypt)

### Authorization
- Role-based access control (Student/Admin)
- Endpoint-level permissions
- User-specific data filtering

### Data Protection
- Environment variables (.env)
- Sensitive data encryption
- SQL injection prevention (ORM)
- CORS configuration

## Ölçeklenebilirlik

### Database
- Connection pooling (10-20 connections)
- Async queries
- Indexes on frequently queried fields
- Pagination for large datasets

### Caching
- Redis for session storage
- API response caching (future)
- Celery result backend

### Background Processing
- Celery workers (horizontal scaling)
- Task queues for heavy operations
- Async/await pattern

## Monitoring & Logging

### Logging
- Python logging module
- Log levels (DEBUG, INFO, WARNING, ERROR)
- Structured logging

### Health Checks
- `/health` endpoint
- Database connectivity
- Redis connectivity

## Deployment

### Development
```bash
docker-compose up
```

### Production
- Gunicorn workers
- Nginx reverse proxy
- SSL/TLS certificates
- Environment-based configuration
- Database backups
- Log aggregation

## Gelecek Geliştirmeler

### Phase 2
- Telegram/WhatsApp grup entegrasyonu
- Gerçek zamanlı sohbet
- Video konferans
- Mobil uygulama

### Phase 3
- Makine öğrenmesi modelleri (custom)
- Daha gelişmiş OCR (handwriting recognition)
- Sesli asistan
- AR/VR çalışma ortamları

### Optimizasyonlar
- GraphQL API
- WebSocket real-time updates
- CDN for static assets
- Database sharding
- Microservices architecture
