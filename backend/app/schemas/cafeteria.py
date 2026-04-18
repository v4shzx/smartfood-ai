from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime, date
from decimal import Decimal

# --- Base Schemas ---

class SchoolUserBase(BaseModel):
    full_name: str
    email: EmailStr
    role: str = "parent"

class MealPlanBase(BaseModel):
    name: str
    description: Optional[str] = None
    price_mxn: Decimal
    days_per_week: int = 5
    is_active: bool = True

class MenuItemBase(BaseModel):
    day_of_week: str
    dish_name: str
    description: Optional[str] = None
    calories: Optional[int] = None
    is_vegetarian: bool = False
    date_served: Optional[date] = None

# --- Response Schemas ---

class MealPlanResponse(MealPlanBase):
    id: str
    
    class Config:
        from_attributes = True

class MenuItemResponse(MenuItemBase):
    id: str
    
    class Config:
        from_attributes = True

class UserProfileResponse(SchoolUserBase):
    id: str
    subscription_tier: Optional[str] = "basico"

    class Config:
        from_attributes = True
