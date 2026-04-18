from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class StaffResponse(BaseModel):
    id: str
    name: str
    role: str
    active: bool = True
    lastActiveAt: Optional[datetime] = None

    class Config:
        from_attributes = True
