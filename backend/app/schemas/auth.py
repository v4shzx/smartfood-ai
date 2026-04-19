from pydantic import BaseModel, EmailStr
from typing import Optional

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    user_id: str
    email: str
    full_name: str
    role: str
    subscription_tier: str = "basico"
    status: str = "success"

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
