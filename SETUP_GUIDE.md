# YKS Mentor - Kurulum Rehberi

## Gereksinimler

- Python 3.11+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (opsiyonel ama önerilen)

## Hızlı Başlangıç (Docker ile)

### 1. Projeyi Klonlayın

```bash
cd yks-mentor
```

### 2. Environment Dosyasını Oluşturun

```bash
cd backend
cp .env.example .env
```

`.env` dosyasını düzenleyin ve gerekli API anahtarlarını ekleyin:
- `OPENAI_API_KEY` - OpenAI API anahtarınız
- `SECRET_KEY` - Güvenli bir secret key (rastgele string)
- Diğer opsiyonel servisler (Twilio, SendGrid, vb.)

### 3. Docker Container'ları Başlatın

```bash
cd ..
docker-compose up -d
```

Bu komut şunları başlatır:
- PostgreSQL veritabanı (port 5432)
- Redis (port 6379)
- FastAPI backend (port 8000)
- Celery worker (background tasks için)

### 4. Veritabanı Migration'ları Çalıştırın

```bash
docker-compose exec backend alembic upgrade head
```

### 5. API'yi Test Edin

Tarayıcınızda açın: http://localhost:8000/api/docs

Swagger UI üzerinden API endpoint'lerini test edebilirsiniz.

## Manuel Kurulum (Docker olmadan)

### 1. PostgreSQL ve Redis Kurun

PostgreSQL ve Redis'i sisteminize kurun ve çalıştırın.

### 2. Python Virtual Environment Oluşturun

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 3. Bağımlılıkları Yükleyin

```bash
pip install -r requirements.txt
```

### 4. Tesseract OCR Kurun

**Windows:**
- https://github.com/UB-Mannheim/tesseract/wiki adresinden indirin
- Türkçe dil paketini de yükleyin

**Linux:**
```bash
sudo apt-get install tesseract-ocr tesseract-ocr-tur
```

**Mac:**
```bash
brew install tesseract tesseract-lang
```

### 5. Environment Dosyasını Ayarlayın

```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin:
```env
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/yks_mentor
DATABASE_URL_SYNC=postgresql://postgres:password@localhost:5432/yks_mentor
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-secret-key-here
OPENAI_API_KEY=your-openai-api-key
```

### 6. Veritabanını Oluşturun

```bash
# PostgreSQL'e bağlanın
psql -U postgres

# Veritabanını oluşturun
CREATE DATABASE yks_mentor;
\q
```

### 7. Migration'ları Çalıştırın

```bash
alembic upgrade head
```

### 8. Backend'i Başlatın

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 9. Celery Worker'ı Başlatın (Ayrı Terminal)

```bash
celery -A app.services.celery_app worker --loglevel=info
```

## İlk Migration Oluşturma

Eğer veritabanı şemasında değişiklik yaparsanız:

```bash
alembic revision --autogenerate -m "Description of changes"
alembic upgrade head
```

## Test Kullanıcısı Oluşturma

API docs üzerinden (http://localhost:8000/api/docs) veya curl ile:

```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123",
    "full_name": "Test Öğrenci",
    "phone": "+905551234567"
  }'
```

## Önemli Endpoint'ler

- **API Docs**: http://localhost:8000/api/docs
- **Health Check**: http://localhost:8000/health
- **Authentication**: http://localhost:8000/api/v1/auth/login
- **Assessment**: http://localhost:8000/api/v1/assessment/tests
- **Study Plan**: http://localhost:8000/api/v1/study-plan/my-plans
- **Progress**: http://localhost:8000/api/v1/progress/daily

## Geliştirme İpuçları

### Hot Reload
Backend `--reload` flag'i ile çalıştırıldığında kod değişikliklerinde otomatik yeniden başlar.

### Database Reset
```bash
# Tüm tabloları sil
alembic downgrade base

# Yeniden oluştur
alembic upgrade head
```

### Logs
```bash
# Docker logs
docker-compose logs -f backend
docker-compose logs -f celery_worker

# Manuel kurulumda logs terminal'de görünür
```

## Sorun Giderme

### Port Zaten Kullanımda
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

### Database Connection Error
- PostgreSQL'in çalıştığından emin olun
- `.env` dosyasındaki connection string'i kontrol edin
- Firewall ayarlarını kontrol edin

### OCR Çalışmıyor
- Tesseract'ın yüklü olduğundan emin olun
- Türkçe dil paketinin kurulu olduğunu kontrol edin
- PATH'e eklendiğinden emin olun

## Üretim Ortamına Deployment

Üretim ortamı için:
1. `DEBUG=False` yapın
2. Güçlü `SECRET_KEY` kullanın
3. HTTPS kullanın
4. Gunicorn veya benzer production server kullanın
5. Nginx reverse proxy kurun
6. SSL sertifikası ekleyin
7. Database backup stratejisi oluşturun

## Destek

Sorularınız için:
- GitHub Issues
- Email: support@yksmentor.com
