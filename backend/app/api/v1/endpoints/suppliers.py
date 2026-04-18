from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from pydantic import BaseModel
from datetime import datetime, timedelta

router = APIRouter()

class SupplierResponse(BaseModel):
    id: str
    name: str
    contact: str
    phone: str
    email: str
    leadDays: int
    rating: float
    notes: str
    lastPurchaseAt: datetime | None

@router.get("/", response_model=List[SupplierResponse])
async def get_suppliers(db: AsyncSession = Depends(get_db)):
    # Mocking for now since there is no supplier model/table yet, 
    # but providing it via API to the frontend.
    return [
        SupplierResponse(
            id="s1", 
            name="Cárnicos Express", 
            contact="Juan Pérez", 
            phone="555-0123", 
            email="ventas@carnicosexp.com", 
            leadDays=1, 
            rating=4.8, 
            notes="Excelente calidad, entrega antes de las 9 AM.", 
            lastPurchaseAt=datetime.now() - timedelta(days=2)
        ),
        SupplierResponse(
            id="s2", 
            name="Tortillería La Abuela", 
            contact="Doña María", 
            phone="555-9876", 
            email="pedidos@laabuela.mx", 
            leadDays=0, 
            rating=5.0, 
            notes="Tortilla recién hecha, pedido diario.", 
            lastPurchaseAt=datetime.now() - timedelta(hours=5)
        )
    ]
