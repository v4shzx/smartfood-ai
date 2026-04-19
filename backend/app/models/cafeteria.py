from sqlalchemy import Column, String, DateTime, Integer, Boolean, ForeignKey, Float
from sqlalchemy.sql import func
from app.core.database import Base

class SchoolUser(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    password_hash = Column(String)
    role = Column(String)
    subscription_tier = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class MealPlan(Base):
    __tablename__ = "meal_plans"

    id = Column(String, primary_key=True, index=True)
    owner_id = Column(String, index=True)
    name = Column(String)
    price_mxn = Column(Float)
    days_per_week = Column(Integer)

class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(String, primary_key=True, index=True)
    owner_id = Column(String, index=True)
    day_of_week = Column(String)
    dish_name = Column(String)
    description = Column(String)
    calories = Column(Integer)
    is_vegetarian = Column(Boolean, default=False)
