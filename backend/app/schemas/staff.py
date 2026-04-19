from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class StaffBase(BaseModel):
    name: str
    role: str
    active: bool = True

class StaffCreate(StaffBase):
    owner_id: str

class StaffUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    active: Optional[bool] = None

class StaffResponse(BaseModel):
    id: str
    name: str
    role: str
    active: bool = True
    lastActiveAt: Optional[datetime] = None

    class Config:
        from_attributes = True
