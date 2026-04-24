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

class ProductBase(BaseModel):
    name: str
    category: str
    price: float
    available: bool = True
    on_hand: int = 0
    min_stock: int = 5
    owner_id: str

class ProductCreate(ProductBase):
    id: Optional[str] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    available: Optional[bool] = None
    on_hand: Optional[int] = None
    min_stock: Optional[int] = None

@router.get("/", response_model=List[ProductResponse])
async def get_products(
    owner_id: Optional[str] = Query("u_demo", description="Owner ID to filter products"),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Product).where(Product.owner_id == owner_id))
    return result.scalars().all()

@router.post("/", response_model=ProductResponse)
async def create_product(product_in: ProductCreate, db: AsyncSession = Depends(get_db)):
    import uuid
    product_data = product_in.model_dump(exclude={"id"})
    db_product = Product(
        id=product_in.id or str(uuid.uuid4()),
        **product_data
    )
    db.add(db_product)
    await db.commit()
    await db.refresh(db_product)
    return db_product

@router.patch("/{product_id}", response_model=ProductResponse)
async def update_product(product_id: str, product_in: ProductUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).where(Product.id == product_id))
    db_product = result.scalar_one_or_none()
    if not db_product:
        return None # Should ideally raise 404
    
    update_data = product_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_product, field, value)
    
    await db.commit()
    await db.refresh(db_product)
    return db_product

@router.delete("/{product_id}")
async def delete_product(product_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).where(Product.id == product_id))
    db_product = result.scalar_one_or_none()
    if db_product:
        await db.delete(db_product)
        await db.commit()
    return {"status": "success"}
