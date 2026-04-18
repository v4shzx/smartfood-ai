from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.models.staff import Staff
from app.schemas.staff import StaffResponse

router = APIRouter()

@router.get("/", response_model=List[StaffResponse])
async def get_staff(
    owner_id: Optional[str] = Query("u_demo", description="Owner ID to filter staff"),
    db: AsyncSession = Depends(get_db)
):
    """
    Fetch all staff members belonging to a specific owner/admin.
    """
    query = select(Staff).where(Staff.owner_id == owner_id)
    result = await db.execute(query)
    workers = result.scalars().all()
    
    # Mapping to StaffResponse schema
    return [
        StaffResponse(
            id=w.id,
            name=w.full_name,
            role=w.role,
            active=w.active,
            lastActiveAt=w.updated_at or w.created_at
        ) for w in workers
    ]
