from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.models.sales import Sale
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class TicketItem(BaseModel):
    name: str
    quantity: int
    price: float

class SaleResponse(BaseModel):
    id: str
    ts: datetime
    total: float
    items_count: int
    type: str
    items_detail: List[TicketItem] = []
    subtotal: float = 0.0
    discount: float = 0.0

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
    items_detail = []
    subtotal = sum(i.price * i.quantity for i in request.items)
    
    last_sale = None
    for item in request.items:
        # 1. Update stock
        product_query = select(Product).where(Product.id == item.product_id)
        product_res = await db.execute(product_query)
        product = product_res.scalar_one_or_none()
        
        if product:
            product.on_hand = max(0, product.on_hand - item.quantity)
            db.add(product)
            items_detail.append(TicketItem(name=product.name, quantity=item.quantity, price=item.price))
        
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
    
    return SaleResponse(
        id=sale_id,
        ts=last_sale.timestamp if last_sale else datetime.now(),
        total=subtotal - request.discount,
        items_count=sum(i.quantity for i in request.items),
        type=request.payment_method,
        items_detail=items_detail,
        subtotal=subtotal,
        discount=request.discount
    )

@router.get("/", response_model=List[SaleResponse])
async def get_sales(
    owner_id: Optional[str] = Query("u_demo", description="Owner ID to filter sales"),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Sale).where(Sale.user_id == owner_id).order_by(Sale.timestamp.desc()))
    all_sales = result.scalars().all()
    
    grouped = {}
    for s in all_sales:
        ticket_id = s.id.split('_')[0] if 'sale_' in s.id else s.id
        if ticket_id not in grouped:
            grouped[ticket_id] = {
                "id": ticket_id,
                "ts": s.timestamp,
                "total": 0,
                "items_count": 0,
                "type": s.payment_method,
                "items_detail": []
            }
        grouped[ticket_id]["total"] += s.total_price
        grouped[ticket_id]["items_count"] += s.quantity
    
    return [SaleResponse(**v) for v in grouped.values()]

@router.get("/{ticket_id}", response_model=SaleResponse)
async def get_sale_detail(ticket_id: str, db: AsyncSession = Depends(get_db)):
    from app.models.product import Product
    query = select(Sale, Product.name).join(Product, Sale.product_id == Product.id).where(Sale.id.like(f"{ticket_id}%"))
    result = await db.execute(query)
    rows = result.all()
    
    if not rows:
        raise HTTPException(status_code=404, detail="Sale not found")
    
    items_detail = []
    total = 0
    first_row = rows[0][0]
    
    for sale, prod_name in rows:
        items_detail.append(TicketItem(name=prod_name, quantity=sale.quantity, price=sale.total_price / sale.quantity))
        total += sale.total_price
        
    return SaleResponse(
        id=ticket_id,
        ts=first_row.timestamp,
        total=total,
        items_count=sum(i.quantity for i, _ in rows),
        type=first_row.payment_method,
        items_detail=items_detail,
        subtotal=total,
        discount=0.0
    )
