from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    owner_id: str

class Category(CategoryBase):
    id: str
    owner_id: str
    created_at: datetime

    class Config:
        from_attributes = True
