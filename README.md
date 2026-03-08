# YKS AI Mentorship Platform

## MVP - Phase 1 Features

### Core Systems
1. **Level Assessment Test System** - Foundation of the platform
2. **AI-Powered Study Plan Generator** - Personalized learning paths
3. **Exam Analysis System** - OCR + AI for automatic analysis
4. **Spaced Repetition Engine** - Smart review of wrong answers
5. **Progress Tracking & Analytics** - Detailed performance metrics
6. **Gamification System** - Engagement through rewards
7. **Notification System** - Reminders and parent reports

### Tech Stack
- **Backend**: Python 3.11+ with FastAPI
- **Database**: PostgreSQL 15+
- **AI/ML**: OpenAI GPT-4, Langchain
- **OCR**: Tesseract OCR / Google Vision API
- **Authentication**: JWT + OAuth2
- **Task Queue**: Celery + Redis
- **Notifications**: Twilio (SMS), SendGrid (Email)
- **Deployment**: Docker + Docker Compose

## Project Structure
```
yks-mentor/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── utils/
│   ├── tests/
│   ├── alembic/
│   └── requirements.txt
├── frontend/ (handled by your friend)
├── docker-compose.yml
└── README.md
```

## Getting Started
```bash
cd yks-mentor/backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
