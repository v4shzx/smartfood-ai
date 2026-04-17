from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.models.cafeteria import SchoolUser
from app.schemas.auth import LoginRequest, LoginResponse

router = APIRouter()

@router.post("/login", response_model=LoginResponse)
async def login(
    login_data: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Authenticate user by email and password.
    Queries the 'users' table in PostgreSQL.
    """
    query = select(SchoolUser).where(SchoolUser.email == login_data.email)
    result = await db.execute(query)
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    # Simplified password check for Demo (as requested)
    if user.password_hash != login_data.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password"
        )

    # For demo mapping or fallback if the model doesn't have the attribute yet
    sub_tier = getattr(user, "subscription_tier", None)
    if not sub_tier:
        # Pseudo-logic for demo based on email to allow testing different tiers
        if "empresarial" in login_data.email.lower():
            sub_tier = "empresarial"
        elif "profesional" in login_data.email.lower():
            sub_tier = "profesional"
        else:
            sub_tier = "basico"

    return {
        "user_id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "subscription_tier": sub_tier,
        "status": "success"
    }
