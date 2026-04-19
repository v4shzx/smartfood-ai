from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class SupplierBase(BaseModel):
    name: str
    contact: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    lead_days: int = 3
    notes: Optional[str] = None

class SupplierCreate(SupplierBase):
    owner_id: str

class SupplierUpdate(BaseModel):
    name: Optional[str] = None
    contact: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    lead_days: Optional[int] = None
    notes: Optional[str] = None
    rating: Optional[float] = None

class SupplierResponse(SupplierBase):
    id: str
    owner_id: str
    rating: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
