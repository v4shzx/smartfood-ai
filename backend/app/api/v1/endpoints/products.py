from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.product import Product as ProductModel
from app.schemas.product import Product, ProductCreate

router = APIRouter()

@router.get("/", response_model=List[Product])
async def get_products(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100
) -> Any:
    """
    Retrieve products.
    """
    result = await db.execute(select(ProductModel).offset(skip).limit(limit))
    return result.scalars().all()

@router.post("/", response_model=Product)
async def create_product(
    *,
    db: AsyncSession = Depends(get_db),
    product_in: ProductCreate
) -> Any:
    """
    Create new product.
    """
    # Simple ID generation if not provided
    if not product_in.id:
        import uuid
        product_id = f"p_{str(uuid.uuid4())[:8]}"
    else:
        product_id = product_in.id

    db_obj = ProductModel(
        **product_in.dict(exclude={"id"}),
        id=product_id
    )
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj
