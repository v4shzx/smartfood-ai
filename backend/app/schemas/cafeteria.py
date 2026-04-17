from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime, date
from decimal import Decimal

# --- Base Schemas ---

class SchoolUserBase(BaseModel):
    full_name: str
    email: EmailStr
    role: str = "parent"

class StudentBase(BaseModel):
    first_name: str
    last_name: str
    grade: Optional[str] = None
    allergies: Optional[str] = None
    dietary_restrictions: Optional[str] = None

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

class StudentResponse(StudentBase):
    id: str
    
    class Config:
        from_attributes = True

class MealPlanResponse(MealPlanBase):
    id: str
    
    class Config:
        from_attributes = True

class MenuItemResponse(MenuItemBase):
    id: str
    
    class Config:
        from_attributes = True

class SubscriptionResponse(BaseModel):
    id: str
    student_id: str
    plan_id: str
    start_date: date
    end_date: date
    status: str
    auto_renew: bool

    class Config:
        from_attributes = True

class UserProfileResponse(SchoolUserBase):
    id: str
    students: List[StudentResponse] = []

    class Config:
        from_attributes = True
