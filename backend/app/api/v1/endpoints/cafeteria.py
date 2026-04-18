from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.models.cafeteria import SchoolUser, MenuItem, MealPlan
from app.schemas.cafeteria import (
    MenuItemResponse, 
    MealPlanResponse, 
    UserProfileResponse
)

router = APIRouter()

@router.get("/menu", response_model=List[MenuItemResponse])
async def get_menu(
    owner_id: Optional[str] = Query("u_demo", description="Owner ID to filter menu"),
    db: AsyncSession = Depends(get_db)
):
    """
    Fetch the weekly menu items for a specific owner.
    """
    query = select(MenuItem).where(MenuItem.owner_id == owner_id).order_by(MenuItem.day_of_week)
    result = await db.execute(query)
    menu_items = result.scalars().all()
    return menu_items

@router.get("/plans", response_model=List[MealPlanResponse])
async def get_plans(
    owner_id: Optional[str] = Query("u_demo", description="Owner ID to filter plans"),
    db: AsyncSession = Depends(get_db)
):
    """
    Fetch available subscription tiers (meal plans) for a specific owner.
    """
    query = select(MealPlan).where(MealPlan.owner_id == owner_id, MealPlan.is_active == True)
    result = await db.execute(query)
    plans = result.scalars().all()
    return plans

@router.get("/profile/{user_id}", response_model=UserProfileResponse)
async def get_user_profile(user_id: str, db: AsyncSession = Depends(get_db)):
    """
    Fetch a single user profile.
    """
    query = select(SchoolUser).where(SchoolUser.id == user_id)
    result = await db.execute(query)
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return user
