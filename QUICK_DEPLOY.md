# YKS Mentor - Hızlı Deployment Rehberi

## En Kolay Yöntem: Railway.app (Önerilen)

Railway, Python uygulamaları için en kolay deployment platformudur.

### 1. Railway Hesabı Oluşturun
- https://railway.app adresine gidin
- GitHub ile giriş yapın (ücretsiz)

### 2. Projeyi GitHub'a Yükleyin

```bash
cd yks-mentor
git init
git add .
git commit -m "Initial commit"

# GitHub'da yeni repo oluşturun, sonra:
git remote add origin https://github.com/yourusername/yks-mentor.git
git push -u origin main
```

### 3. Railway'de Proje Oluşturun

1. Railway dashboard'da **New Project**
2. **Deploy from GitHub repo** seçin
3. `yks-mentor` repo'sunu seçin
4. **Deploy Now**

### 4. PostgreSQL Ekleyin

1. Project'te **New** > **Database** > **Add PostgreSQL**
2. Otomatik olarak `DATABASE_URL` environment variable eklenir

### 5. Redis Ekleyin

1. Project'te **New** > **Database** > **Add Redis**
2. Otomatik olarak `REDIS_URL` environment variable eklenir

### 6. Environment Variables Ekleyin

Project Settings > Variables:

```
OPENAI_API_KEY=your-openai-api-key
SECRET_KEY=your-secret-key-generate-random
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
DEBUG=False
CORS_ORIGINS=https://your-frontend-domain.com
```

### 7. Build Ayarları

Railway otomatik olarak `requirements.txt` algılar.

**Özel ayar gerekirse** `railway.toml` oluşturun:

```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT"
healthcheckPath = "/health"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

### 8. Deploy!

Railway otomatik olarak deploy eder. Domain:
- `your-app.up.railway.app`

### 9. Custom Domain (Opsiyonel)

Settings > Domains > Add Custom Domain

---

## Alternatif: Render.com

### 1. Render Hesabı
- https://render.com
- GitHub ile giriş

### 2. Web Service Oluşturun

1. **New** > **Web Service**
2. GitHub repo'yu bağlayın
3. Ayarlar:
   - **Name**: yks-mentor-api
   - **Environment**: Python 3
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### 3. PostgreSQL Ekleyin

1. **New** > **PostgreSQL**
2. Web Service'e bağlayın

### 4. Redis Ekleyin

1. **New** > **Redis**
2. Web Service'e bağlayın

### 5. Environment Variables

Settings > Environment:
```
OPENAI_API_KEY=...
SECRET_KEY=...
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
```

---

## Alternatif: DigitalOcean App Platform

### 1. DigitalOcean Hesabı
- https://cloud.digitalocean.com
- $200 ücretsiz kredi (yeni kullanıcılar)

### 2. App Oluşturun

1. **Apps** > **Create App**
2. GitHub repo'yu seçin
3. **Backend** component:
   - **Type**: Web Service
   - **Run Command**: `cd backend && alembic upgrade head && gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker`
   - **HTTP Port**: 8000

### 3. Database Ekleyin

1. **Add Resource** > **Database**
2. PostgreSQL seçin
3. Otomatik bağlanır

### 4. Environment Variables

```
OPENAI_API_KEY=...
SECRET_KEY=...
DATABASE_URL=${db.DATABASE_URL}
```

---

## Alternatif: Heroku (Ücretli)

### 1. Heroku CLI Kurun

```bash
# Windows
choco install heroku-cli

# Mac
brew tap heroku/brew && brew install heroku

# Linux
curl https://cli-assets.heroku.com/install.sh | sh
```

### 2. Login ve App Oluşturun

```bash
heroku login
cd yks-mentor/backend
heroku create yks-mentor-api
```

### 3. PostgreSQL Ekleyin

```bash
heroku addons:create heroku-postgresql:mini
```

### 4. Redis Ekleyin

```bash
heroku addons:create heroku-redis:mini
```

### 5. Environment Variables

```bash
heroku config:set OPENAI_API_KEY=your-key
heroku config:set SECRET_KEY=your-secret
```

### 6. Procfile Oluşturun

`backend/Procfile`:
```
web: alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT
worker: celery -A app.services.celery_app worker --loglevel=info
```

### 7. Deploy

```bash
git push heroku main
```

---

## Maliyet Karşılaştırması

| Platform | Ücretsiz Tier | Ücretli (Başlangıç) | Özellikler |
|----------|---------------|---------------------|------------|
| **Railway** | $5 kredi/ay | $5/ay | Kolay, otomatik SSL, logs |
| **Render** | Var (sınırlı) | $7/ay | Otomatik deploy, SSL |
| **DigitalOcean** | $200 kredi | $5/ay | Güçlü, ölçeklenebilir |
| **Heroku** | Yok | $7/ay | Mature, eklentiler |
| **Fly.io** | Var | $5/ay | Global, edge deployment |

## Önerilen: Railway

**Neden Railway?**
- ✅ En kolay setup
- ✅ Otomatik PostgreSQL + Redis
- ✅ GitHub entegrasyonu
- ✅ Ücretsiz $5 kredi/ay
- ✅ Otomatik SSL
- ✅ Logs ve monitoring
- ✅ Kolay environment variables

**Deployment süresi: ~5 dakika**

---

## Frontend Deployment (Arkadaşınız için)

### Vercel (React/Next.js için)
```bash
npm install -g vercel
vercel login
vercel
```

### Netlify (React/Vue için)
```bash
npm install -g netlify-cli
netlify login
netlify deploy
```

### Environment Variables (Frontend)
```
VITE_API_URL=https://your-api.railway.app/api/v1
# veya
NEXT_PUBLIC_API_URL=https://your-api.railway.app/api/v1
```

---

## Deployment Sonrası

### 1. Health Check
```bash
curl https://your-api.railway.app/health
```

### 2. API Docs
```
https://your-api.railway.app/api/docs
```

### 3. Test Kullanıcısı Oluşturun
API docs üzerinden `/api/v1/auth/register` endpoint'ini kullanın

### 4. Monitoring
- Railway dashboard'dan logs kontrol edin
- Uptime monitoring ekleyin (UptimeRobot)

### 5. Custom Domain (Opsiyonel)
Railway/Render settings'den custom domain ekleyin

---

## Sorun Giderme

### Build Hatası
- `requirements.txt` yolunu kontrol edin
- Python versiyonunu kontrol edin (3.11+)

### Database Bağlantı Hatası
- Environment variables kontrol edin
- `DATABASE_URL` formatını kontrol edin

### Import Hatası
- Tüm bağımlılıklar `requirements.txt`'de olmalı
- `alembic` ve `uvicorn` eklenmiş olmalı

### 502 Bad Gateway
- Start command'ı kontrol edin
- Port'u `$PORT` environment variable'dan alın
- Health check endpoint'i ekleyin

---

## İletişim

Deployment sorunları için:
- Railway Discord: https://discord.gg/railway
- Render Community: https://community.render.com
- DigitalOcean Docs: https://docs.digitalocean.com
