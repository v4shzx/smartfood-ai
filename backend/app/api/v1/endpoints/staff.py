from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.models.cafeteria import SchoolUser
from app.schemas.staff import StaffResponse

router = APIRouter()

@router.get("/", response_model=List[StaffResponse])
async def get_staff(db: AsyncSession = Depends(get_db)):
    """
    Fetch all users that are part of the staff (non-parent roles).
    """
    query = select(SchoolUser).where(SchoolUser.role != "parent")
    result = await db.execute(query)
    users = result.scalars().all()
    
    # Mapping to StaffResponse schema
    return [
        StaffResponse(
            id=u.id,
            name=u.full_name,
            role=u.role.capitalize(),
            active=True, # In a real app, this would be a column
            lastActiveAt=u.updated_at or u.created_at
        ) for u in users
    ]
