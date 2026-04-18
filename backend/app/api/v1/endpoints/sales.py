from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.models.sales import Sale
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class SaleResponse(BaseModel):
    id: str
    ts: datetime
    total: float
    items: int
    type: str

    class Config:
        from_attributes = True

@router.get("/", response_model=List[SaleResponse])
async def get_sales(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Sale).order_by(Sale.timestamp.desc()))
    sales = result.scalars().all()
    return [
        SaleResponse(
            id=s.id,
            ts=s.timestamp,
            total=s.total_price,
            items=s.quantity,
            type=s.payment_method
        ) for s in sales
    ]
