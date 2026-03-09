from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List
import openai
from app.core.config import settings
from app.api.dependencies import get_current_user
from app.models.user import User

router = APIRouter()

# Set OpenAI API key
openai.api_key = settings.OPENAI_API_KEY


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]


class ChatResponse(BaseModel):
    message: str


@router.post("/", response_model=ChatResponse)
async def chat_with_ai(
    request: ChatRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Chat with AI mentor using OpenAI API
    """
    if not settings.OPENAI_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="OpenAI API key not configured"
        )
    
    try:
        # Convert messages to OpenAI format
        messages = [{"role": msg.role, "content": msg.content} for msg in request.messages]
        
        # Add system message for context
        system_message = {
            "role": "system",
            "content": f"Sen YKS hazırlık sürecinde öğrencilere yardımcı olan bir AI mentörsün. Öğrencinin adı: {current_user.full_name}. Hedef üniversite: {current_user.target_university or 'Belirtilmemiş'}. Öğrenciye motivasyon ver, sorularını yanıtla ve çalışma önerileri sun."
        }
        
        messages.insert(0, system_message)
        
        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=500,
            temperature=0.7
        )
        
        ai_message = response.choices[0].message.content
        
        return ChatResponse(message=ai_message)
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI chat error: {str(e)}"
        )
