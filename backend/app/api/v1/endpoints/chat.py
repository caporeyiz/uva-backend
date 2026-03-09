from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List
from datetime import datetime
from openai import OpenAI
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.config import settings
from app.core.database import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.models.chat import ChatHistory

router = APIRouter()


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]


class ChatResponse(BaseModel):
    message: str


class ChatHistoryItem(BaseModel):
    id: int
    message: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


class ChatHistoryResponse(BaseModel):
    history: List[ChatHistoryItem]


async def _chat_handler(
    request: ChatRequest,
    current_user: User,
    db: AsyncSession
) -> ChatResponse:
    """
    Shared chat handler logic with chat history saving
    """
    if not settings.OPENAI_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="OpenAI API key not configured"
        )
    
    try:
        # Initialize OpenAI client
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        
        # Convert messages to OpenAI format
        messages = [{"role": msg.role, "content": msg.content} for msg in request.messages]
        
        # Add system message for context
        system_message = {
            "role": "system",
            "content": f"Sen YKS hazırlık sürecinde öğrencilere yardımcı olan bir AI mentörsün. Öğrencinin adı: {current_user.full_name}. Hedef üniversite: {current_user.target_university or 'Belirtilmemiş'}. Öğrenciye motivasyon ver, sorularını yanıtla ve çalışma önerileri sun."
        }
        
        messages.insert(0, system_message)
        
        # Call OpenAI API with new syntax
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=500,
            temperature=0.7
        )
        
        ai_message = response.choices[0].message.content
        
        # Save user's last message to chat history
        if request.messages:
            last_user_message = request.messages[-1]
            user_chat = ChatHistory(
                user_id=current_user.id,
                message=last_user_message.content,
                role="user"
            )
            db.add(user_chat)
        
        # Save AI response to chat history
        ai_chat = ChatHistory(
            user_id=current_user.id,
            message=ai_message,
            role="assistant"
        )
        db.add(ai_chat)
        await db.commit()
        
        return ChatResponse(message=ai_message)
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"AI chat error: {str(e)}"
        )


@router.post("/", response_model=ChatResponse)
async def chat_with_ai_trailing_slash(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Chat with AI mentor using OpenAI API (with trailing slash)
    """
    return await _chat_handler(request, current_user, db)


@router.post("", response_model=ChatResponse)
async def chat_with_ai_no_trailing_slash(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Chat with AI mentor using OpenAI API (without trailing slash)
    """
    return await _chat_handler(request, current_user, db)


@router.get("/history", response_model=ChatHistoryResponse)
async def get_chat_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    limit: int = 50
):
    """
    Get user's chat history (most recent messages)
    """
    result = await db.execute(
        select(ChatHistory)
        .where(ChatHistory.user_id == current_user.id)
        .order_by(ChatHistory.created_at.desc())
        .limit(limit)
    )
    history = result.scalars().all()
    
    # Reverse to get chronological order (oldest first)
    history = list(reversed(history))
    
    return ChatHistoryResponse(history=history)
