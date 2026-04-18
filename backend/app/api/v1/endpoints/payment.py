from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from app.core.database import get_db
from app.models.payment import PaymentMethod as PaymentMethodModel
from app.schemas.payment import PaymentMethod, PaymentMethodCreate
import uuid

router = APIRouter()

@router.get("/", response_model=List[PaymentMethod])
async def get_payment_methods(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve payment methods for the demo user (simulating current user).
    """
    result = await db.execute(
        select(PaymentMethodModel)
        .where(PaymentMethodModel.user_id == "u_demo")
        .offset(skip)
        .limit(limit)
    )
    methods = result.scalars().all()
    return methods

@router.post("/", response_model=PaymentMethod)
async def create_payment_method(
    *,
    db: AsyncSession = Depends(get_db),
    method_in: PaymentMethodCreate
) -> Any:
    """
    Create a new payment method.
    """
    db_obj = PaymentMethodModel(
        id=f"pm_{uuid.uuid4().hex[:8]}",
        user_id="u_demo",
        brand=method_in.brand,
        last4=method_in.last4,
        exp_month=method_in.exp_month,
        exp_year=method_in.exp_year,
        is_primary=method_in.is_primary
    )
    
    if db_obj.is_primary:
        # Unset other primary methods
        await db.execute(
            update(PaymentMethodModel)
            .where(
                PaymentMethodModel.user_id == "u_demo",
                PaymentMethodModel.is_primary == True
            )
            .values(is_primary=False)
        )
        
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

@router.delete("/{method_id}", response_model=PaymentMethod)
async def delete_payment_method(
    *,
    db: AsyncSession = Depends(get_db),
    method_id: str
) -> Any:
    """
    Delete a payment method.
    """
    result = await db.execute(
        select(PaymentMethodModel).where(PaymentMethodModel.id == method_id)
    )
    method = result.scalar_one_or_none()
    
    if not method:
        raise HTTPException(status_code=404, detail="Payment method not found")
    
    if method.is_primary:
        raise HTTPException(status_code=400, detail="Cannot delete primary payment method")
        
    await db.delete(method)
    await db.commit()
    return method

@router.patch("/{method_id}/set-primary", response_model=PaymentMethod)
async def set_primary_payment_method(
    *,
    db: AsyncSession = Depends(get_db),
    method_id: str
) -> Any:
    """
    Set a payment method as primary.
    """
    result = await db.execute(
        select(PaymentMethodModel).where(PaymentMethodModel.id == method_id)
    )
    method = result.scalar_one_or_none()
    
    if not method:
        raise HTTPException(status_code=404, detail="Payment method not found")
    
    await db.execute(
        update(PaymentMethodModel)
        .where(
            PaymentMethodModel.user_id == "u_demo",
            PaymentMethodModel.is_primary == True
        )
        .values(is_primary=False)
    )
    
    method.is_primary = True
    await db.commit()
    await db.refresh(method)
    return method
