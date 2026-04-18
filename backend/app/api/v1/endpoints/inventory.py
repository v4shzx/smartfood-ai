from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.models.product import Product
from pydantic import BaseModel
from datetime import datetime, timedelta

router = APIRouter()

class InventoryItemResponse(BaseModel):
    id: str
    name: str
    sku: str
    onHand: int
    min: int
    unit: str
    updatedAt: datetime

    class Config:
        from_attributes = True

@router.get("/", response_model=List[InventoryItemResponse])
async def get_inventory(
    owner_id: Optional[str] = Query("u_demo", description="Owner ID to filter inventory"),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Product).where(Product.owner_id == owner_id))
    products = result.scalars().all()
    return [
        InventoryItemResponse(
            id=p.id,
            name=p.name,
            sku=f"SKU-{p.id}",
            onHand=p.on_hand,
            min=p.min_stock,
            unit="pcs",
            updatedAt=p.updated_at or datetime.now()
        ) for p in products
    ]

class MovementResponse(BaseModel):
    id: str
    itemId: str
    type: str
    qty: int
    ts: datetime
    note: str

@router.get("/movements", response_model=List[MovementResponse])
async def get_movements(
    owner_id: Optional[str] = Query("u_demo", description="Owner ID to filter movements"),
    db: AsyncSession = Depends(get_db)
):
    # Simulating movements for now
    return [
        MovementResponse(id="m1", itemId="p1", type="out", qty=25, ts=datetime.now() - timedelta(hours=1), note="Ventas turno mañana"),
        MovementResponse(id="m2", itemId="p2", type="in", qty=20, ts=datetime.now() - timedelta(hours=2), note="Recepción proveedor")
    ]
