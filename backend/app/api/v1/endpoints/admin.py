from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.models.cafeteria import SchoolUser
from app.schemas.admin import UserAdminResponse, SubscriptionUpdate

router = APIRouter()

@router.get("/users", response_model=List[UserAdminResponse])
async def get_all_users(db: AsyncSession = Depends(get_db)):
    """
    Admin only: Get all users in the system.
    """
    result = await db.execute(select(SchoolUser).order_by(SchoolUser.created_at.desc()))
    return result.scalars().all()

@router.patch("/users/{user_id}/subscription", response_model=UserAdminResponse)
async def update_user_subscription(
    user_id: str, 
    update: SubscriptionUpdate, 
    db: AsyncSession = Depends(get_db)
):
    """
    Admin only: Update a user's subscription tier.
    """
    query = select(SchoolUser).where(SchoolUser.id == user_id)
    result = await db.execute(query)
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.subscription_tier = update.tier.lower()
    await db.commit()
    await db.refresh(user)
    return user
