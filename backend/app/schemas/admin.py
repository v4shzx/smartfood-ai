from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class UserAdminResponse(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    role: str
    subscription_tier: str
    created_at: datetime

    class Config:
        from_attributes = True

class SubscriptionUpdate(BaseModel):
    tier: str
