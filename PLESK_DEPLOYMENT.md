# YKS Mentor - Plesk Deployment Rehberi

## Önemli Not

**Plesk genellikle PHP/MySQL tabanlı uygulamalar için optimize edilmiştir.** Python FastAPI uygulaması için Plesk'te bazı sınırlamalar olabilir. Alternatif olarak:

1. **VPS/Dedicated Server** (Önerilen) - Tam kontrol
2. **Heroku/Railway/Render** - Python-friendly PaaS
3. **DigitalOcean App Platform** - Kolay deployment
4. **AWS/Google Cloud** - Enterprise çözüm

Ancak Plesk'te Python uygulaması çalıştırmak mümkündür. İşte adımlar:

## Plesk'te Python FastAPI Deployment

### Ön Gereksinimler

Plesk hesabınızda şunlar olmalı:
- SSH erişimi (gerekli)
- Python 3.11+ desteği
- PostgreSQL veritabanı oluşturma yetkisi
- Subdomain/domain yönetimi

### Adım 1: Plesk'e Giriş ve Domain Ayarları

1. Plesk panel'e giriş yapın
2. **Websites & Domains** > **Add Domain** veya mevcut domain'i seçin
3. Subdomain oluşturun (örn: `api.yourdomain.com`)

### Adım 2: SSH ile Bağlanın

```bash
ssh username@your-server-ip
```

### Adım 3: Proje Dizini Oluşturun

```bash
cd /var/www/vhosts/yourdomain.com
mkdir yks-mentor
cd yks-mentor
```

### Adım 4: Projeyi Yükleyin

**Seçenek A: Git ile (Önerilen)**
```bash
git clone https://github.com/yourusername/yks-mentor.git .
cd backend
```

**Seçenek B: FTP/SFTP ile**
- FileZilla veya benzeri FTP client kullanın
- Tüm backend klasörünü yükleyin

### Adım 5: Python Virtual Environment Oluşturun

```bash
cd /var/www/vhosts/yourdomain.com/yks-mentor/backend

# Python 3.11 kullanın (Plesk'te mevcut olmalı)
python3.11 -m venv venv
source venv/bin/activate

# Bağımlılıkları yükleyin
pip install --upgrade pip
pip install -r requirements.txt
```

### Adım 6: PostgreSQL Veritabanı Oluşturun

Plesk Panel'den:
1. **Databases** > **Add Database**
2. Database name: `yks_mentor`
3. User oluşturun ve şifreyi kaydedin
4. Bağlantı bilgilerini not alın

### Adım 7: Environment Dosyası Oluşturun

```bash
cd /var/www/vhosts/yourdomain.com/yks-mentor/backend
cp .env.example .env
nano .env
```

`.env` dosyasını düzenleyin:
```env
DATABASE_URL=postgresql+asyncpg://dbuser:dbpass@localhost:5432/yks_mentor
DATABASE_URL_SYNC=postgresql://dbuser:dbpass@localhost:5432/yks_mentor
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-very-secure-secret-key-here
OPENAI_API_KEY=your-openai-api-key
DEBUG=False
CORS_ORIGINS=https://yourdomain.com,https://api.yourdomain.com

# Twilio (Opsiyonel)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# SendGrid (Opsiyonel)
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

### Adım 8: Database Migration

```bash
source venv/bin/activate
alembic upgrade head
```

### Adım 9: Gunicorn ile Uygulama Başlatma

**Gunicorn yapılandırma dosyası oluşturun:**

```bash
nano gunicorn_config.py
```

İçeriği:
```python
import multiprocessing

bind = "127.0.0.1:8000"
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "uvicorn.workers.UvicornWorker"
keepalive = 120
timeout = 120
accesslog = "/var/www/vhosts/yourdomain.com/yks-mentor/logs/access.log"
errorlog = "/var/www/vhosts/yourdomain.com/yks-mentor/logs/error.log"
loglevel = "info"
```

**Log klasörü oluşturun:**
```bash
mkdir -p /var/www/vhosts/yourdomain.com/yks-mentor/logs
```

### Adım 10: Systemd Service Oluşturun

```bash
sudo nano /etc/systemd/system/yks-mentor.service
```

İçeriği:
```ini
[Unit]
Description=YKS Mentor FastAPI Application
After=network.target

[Service]
Type=notify
User=your-plesk-user
Group=psacln
WorkingDirectory=/var/www/vhosts/yourdomain.com/yks-mentor/backend
Environment="PATH=/var/www/vhosts/yourdomain.com/yks-mentor/backend/venv/bin"
ExecStart=/var/www/vhosts/yourdomain.com/yks-mentor/backend/venv/bin/gunicorn app.main:app -c gunicorn_config.py
ExecReload=/bin/kill -s HUP $MAINPID
KillMode=mixed
TimeoutStopSec=5
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

**Service'i başlatın:**
```bash
sudo systemctl daemon-reload
sudo systemctl start yks-mentor
sudo systemctl enable yks-mentor
sudo systemctl status yks-mentor
```

### Adım 11: Nginx Reverse Proxy (Plesk'te)

Plesk Panel'de:
1. **Websites & Domains** > domain seçin
2. **Apache & nginx Settings**
3. **Additional nginx directives** bölümüne ekleyin:

```nginx
location /api {
    proxy_pass http://127.0.0.1:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 300s;
    proxy_connect_timeout 75s;
}

location /docs {
    proxy_pass http://127.0.0.1:8000/docs;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}

location /redoc {
    proxy_pass http://127.0.0.1:8000/redoc;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

4. **OK** > **Apply**

### Adım 12: SSL Sertifikası (Let's Encrypt)

Plesk Panel'de:
1. **Websites & Domains** > domain seçin
2. **SSL/TLS Certificates**
3. **Install** (Let's Encrypt)
4. Domain'i seçin ve **Get it free**

### Adım 13: Redis Kurulumu (Opsiyonel)

```bash
# Redis genellikle Plesk'te yüklü değildir
# VPS erişiminiz varsa:
sudo apt-get update
sudo apt-get install redis-server
sudo systemctl start redis
sudo systemctl enable redis
```

Redis yoksa, Celery task'ları devre dışı bırakabilirsiniz.

### Adım 14: Celery Worker (Opsiyonel)

```bash
sudo nano /etc/systemd/system/yks-mentor-celery.service
```

İçeriği:
```ini
[Unit]
Description=YKS Mentor Celery Worker
After=network.target redis.service

[Service]
Type=forking
User=your-plesk-user
Group=psacln
WorkingDirectory=/var/www/vhosts/yourdomain.com/yks-mentor/backend
Environment="PATH=/var/www/vhosts/yourdomain.com/yks-mentor/backend/venv/bin"
ExecStart=/var/www/vhosts/yourdomain.com/yks-mentor/backend/venv/bin/celery -A app.services.celery_app worker --loglevel=info --logfile=/var/www/vhosts/yourdomain.com/yks-mentor/logs/celery.log

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl start yks-mentor-celery
sudo systemctl enable yks-mentor-celery
```

## Test Etme

```bash
# API'yi test edin
curl https://api.yourdomain.com/health

# Docs'u kontrol edin
# Tarayıcıda: https://api.yourdomain.com/api/docs
```

## Güncelleme ve Bakım

### Kod Güncellemesi
```bash
cd /var/www/vhosts/yourdomain.com/yks-mentor/backend
git pull origin main
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
sudo systemctl restart yks-mentor
sudo systemctl restart yks-mentor-celery
```

### Log Kontrolü
```bash
# Application logs
tail -f /var/www/vhosts/yourdomain.com/yks-mentor/logs/error.log

# Systemd logs
sudo journalctl -u yks-mentor -f
```

### Database Backup
```bash
# Plesk panel'den veya:
pg_dump -U dbuser yks_mentor > backup_$(date +%Y%m%d).sql
```

## Sorun Giderme

### Service Başlamıyor
```bash
sudo systemctl status yks-mentor
sudo journalctl -u yks-mentor -n 50
```

### Database Bağlantı Hatası
- `.env` dosyasındaki database credentials'ı kontrol edin
- PostgreSQL'in çalıştığından emin olun: `sudo systemctl status postgresql`

### Permission Hatası
```bash
# Doğru izinleri verin
sudo chown -R your-plesk-user:psacln /var/www/vhosts/yourdomain.com/yks-mentor
sudo chmod -R 755 /var/www/vhosts/yourdomain.com/yks-mentor
```

### Port Zaten Kullanımda
```bash
# Port 8000'i kullanan process'i bulun
sudo lsof -i :8000
sudo kill -9 <PID>
```

## Alternatif: Basit Deployment (Shared Hosting)

Eğer SSH erişiminiz yoksa veya Plesk kısıtlamaları varsa:

### Seçenek 1: Passenger (mod_passenger)
Bazı Plesk sunucularında Python Passenger desteği vardır.

### Seçenek 2: PaaS Platformları (Önerilen)
- **Railway.app** - Ücretsiz tier, kolay deployment
- **Render.com** - Ücretsiz tier, otomatik SSL
- **Fly.io** - Ücretsiz tier, global deployment
- **Heroku** - Ücretli ama güvenilir

Bu platformlarda deployment çok daha kolay:
```bash
# Railway örneği
railway login
railway init
railway up
```

## Güvenlik Önerileri

1. **Firewall Kuralları**
   - Sadece 80, 443 portlarını dışarıya açın
   - 8000 portunu local'de tutun

2. **Environment Variables**
   - `.env` dosyasını asla git'e commit etmeyin
   - Güçlü SECRET_KEY kullanın

3. **Database**
   - Güçlü şifreler
   - Düzenli backup

4. **Rate Limiting**
   - Nginx'te rate limiting ekleyin
   - API endpoint'lerinde throttling

5. **Monitoring**
   - Log rotation ayarlayın
   - Uptime monitoring (UptimeRobot, vb.)

## Maliyet Optimizasyonu

Plesk shared hosting'de Python uygulaması çalıştırmak kaynak yoğun olabilir. Alternatifler:

- **Railway**: $5/ay (hobby plan)
- **Render**: Ücretsiz tier (sınırlı)
- **DigitalOcean**: $6/ay (droplet)
- **Hetzner**: €4/ay (VPS)

Bu platformlar Python uygulamaları için optimize edilmiştir.
