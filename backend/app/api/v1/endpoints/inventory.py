from typing import List
from fastapi import APIRouter, Depends
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
async def get_inventory(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product))
    products = result.scalars().all()
    # Mocking SKU and Unit since they are not in the current Product model, 
    # but using real ID, Name and Stock values.
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
async def get_movements(db: AsyncSession = Depends(get_db)):
    # Simulating movements for now as they are not yet fully persisted in a dedicated table with all metadata
    return [
        MovementResponse(id="m1", itemId="p1", type="out", qty=25, ts=datetime.now() - timedelta(hours=1), note="Ventas turno mañana"),
        MovementResponse(id="m2", itemId="p2", type="in", qty=20, ts=datetime.now() - timedelta(hours=2), note="Recepción proveedor")
    ]
