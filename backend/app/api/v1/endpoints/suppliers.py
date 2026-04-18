from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.models.supplier import Supplier
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class SupplierResponse(BaseModel):
    id: str
    name: str
    contact: Optional[str]
    phone: Optional[str]
    email: Optional[str]
    leadDays: int
    rating: float
    notes: Optional[str]
    lastPurchaseAt: Optional[datetime] = None

    class Config:
        from_attributes = True

@router.get("/", response_model=List[SupplierResponse])
async def get_suppliers(
    owner_id: Optional[str] = Query("u_demo", description="Owner ID to filter suppliers"),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Supplier).where(Supplier.owner_id == owner_id))
    suppliers = result.scalars().all()
    return [
        SupplierResponse(
            id=s.id,
            name=s.name,
            contact=s.contact,
            phone=s.phone,
            email=s.email,
            leadDays=s.lead_days,
            rating=s.rating,
            notes=s.notes,
            lastPurchaseAt=None
        ) for s in suppliers
    ]
