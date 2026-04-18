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

class SaleItem(BaseModel):
    product_id: str
    quantity: int
    price: float

class CheckoutRequest(BaseModel):
    user_id: str
    items: List[SaleItem]
    payment_method: str
    discount: float

@router.post("/checkout", response_model=SaleResponse)
async def checkout(request: CheckoutRequest, db: AsyncSession = Depends(get_db)):
    from app.models.product import Product
    import uuid
    
    sale_id = f"sale_{uuid.uuid4().hex[:8]}"
    total_qty = 0
    total_price = 0
    
    # In a real multi-item system, we might need a SalesItems table.
    # For now, following the existing single-product-per-sale record structure 
    # but aggregating or creating multiple records.
    
    last_sale = None
    
    for item in request.items:
        # 1. Update stock
        product_query = select(Product).where(Product.id == item.product_id)
        product_res = await db.execute(product_query)
        product = product_res.scalar_one_or_none()
        
        if product:
            product.on_hand = max(0, product.on_hand - item.quantity)
            db.add(product)
        
        # 2. Create Sale record
        new_sale = Sale(
            id=f"{sale_id}_{item.product_id}",
            user_id=request.user_id,
            product_id=item.product_id,
            quantity=item.quantity,
            total_price=item.price * item.quantity,
            payment_method=request.payment_method,
            timestamp=datetime.now()
        )
        db.add(new_sale)
        last_sale = new_sale
    
    await db.commit()
    
    # Return a summary (using the last item's timestamp for simplicity)
    return SaleResponse(
        id=sale_id,
        ts=last_sale.timestamp,
        total=sum(i.price * i.quantity for i in request.items) - request.discount,
        items=sum(i.quantity for i in request.items),
        type=request.payment_method
    )

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
