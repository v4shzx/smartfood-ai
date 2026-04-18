from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.models.product import Product
from pydantic import BaseModel

router = APIRouter()

class ProductResponse(BaseModel):
    id: str
    name: str
    category: str
    price: float
    available: bool
    on_hand: int
    min_stock: int

    class Config:
        from_attributes = True

@router.get("/", response_model=List[ProductResponse])
async def get_products(
    owner_id: Optional[str] = Query("u_demo", description="Owner ID to filter products"),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Product).where(Product.owner_id == owner_id))
    return result.scalars().all()
