from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.dependencies import get_current_user
from app.models.user import User, ParentInfo
from app.schemas.user import UserResponse, UserUpdate, ParentInfoCreate, ParentInfoResponse

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    return current_user


@router.put("/me", response_model=UserResponse)
async def update_current_user(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    update_data = user_update.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    await db.commit()
    await db.refresh(current_user)
    
    return current_user


@router.post("/me/parent-info", response_model=ParentInfoResponse, status_code=status.HTTP_201_CREATED)
async def add_parent_info(
    parent_data: ParentInfoCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.parent_info:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Parent info already exists"
        )
    
    parent_info = ParentInfo(
        student_id=current_user.id,
        **parent_data.model_dump()
    )
    
    db.add(parent_info)
    await db.commit()
    await db.refresh(parent_info)
    
    return parent_info


@router.get("/me/parent-info", response_model=ParentInfoResponse)
async def get_parent_info(
    current_user: User = Depends(get_current_user)
):
    if not current_user.parent_info:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Parent info not found"
        )
    
    return current_user.parent_info
