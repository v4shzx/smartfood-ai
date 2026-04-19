from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.models.category import Category as CategoryModel
from app.schemas.category import Category, CategoryCreate
import uuid

router = APIRouter()

@router.get("/", response_model=List[Category])
async def get_categories(
    owner_id: Optional[str] = Query("u_demo"),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(CategoryModel).where(CategoryModel.owner_id == owner_id))
    return result.scalars().all()

@router.post("/", response_model=Category)
async def create_category(
    request: CategoryCreate,
    db: AsyncSession = Depends(get_db)
):
    # Check if category already exists for this owner
    query = select(CategoryModel).where(
        CategoryModel.owner_id == request.owner_id,
        CategoryModel.name == request.name
    )
    res = await db.execute(query)
    if res.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Category already exists")

    new_cat = CategoryModel(
        id=f"cat_{uuid.uuid4().hex[:8]}",
        owner_id=request.owner_id,
        name=request.name
    )
    db.add(new_cat)
    await db.commit()
    await db.refresh(new_cat)
    return new_cat
