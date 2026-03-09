from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1.router import api_router

# Import all models so Base.metadata knows about them
import app.models  # noqa: F401


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create all tables on startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="YKS AI Mentorship Platform - Backend API",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan,
    redirect_slashes=False,  # Disable automatic trailing slash redirects
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {
        "message": "YKS Mentor API",
        "version": settings.APP_VERSION,
        "docs": "/api/docs",
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
