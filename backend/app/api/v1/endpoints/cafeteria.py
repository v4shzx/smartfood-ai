from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.models.cafeteria import Student, SchoolUser, MenuItem, MealPlan, Subscription
from app.schemas.cafeteria import (
    StudentResponse, 
    MenuItemResponse, 
    MealPlanResponse, 
    SubscriptionResponse,
    UserProfileResponse
)

router = APIRouter()

@router.get("/students", response_model=List[StudentResponse])
async def get_students(
    parent_id: Optional[str] = Query(None, description="Filter students by parent ID"),
    db: AsyncSession = Depends(get_db)
):
    """
    Fetch a list of students. If parent_id is provided, filters by that parent.
    Example parent_id from seed: 'u1' (Alejandro Balderas)
    """
    query = select(Student)
    if parent_id:
        query = query.where(Student.parent_id == parent_id)
    
    result = await db.execute(query)
    students = result.scalars().all()
    return students

@router.get("/menu", response_model=List[MenuItemResponse])
async def get_menu(db: AsyncSession = Depends(get_db)):
    """
    Fetch the weekly menu items.
    """
    query = select(MenuItem).order_by(MenuItem.day_of_week)
    result = await db.execute(query)
    menu_items = result.scalars().all()
    return menu_items

@router.get("/plans", response_model=List[MealPlanResponse])
async def get_plans(db: AsyncSession = Depends(get_db)):
    """
    Fetch available subscription tiers (meal plans).
    """
    query = select(MealPlan).where(MealPlan.is_active == True)
    result = await db.execute(query)
    plans = result.scalars().all()
    return plans

@router.get("/profile/{user_id}", response_model=UserProfileResponse)
async def get_user_profile(user_id: str, db: AsyncSession = Depends(get_db)):
    """
    Fetch a single user profile with their associated students.
    """
    query = select(SchoolUser).where(SchoolUser.id == user_id)
    result = await db.execute(query)
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Pre-fetching students (In a real app, use joinedload or subqueryload)
    student_query = select(Student).where(Student.parent_id == user_id)
    student_result = await db.execute(student_query)
    user.students = student_result.scalars().all()
    
    return user
