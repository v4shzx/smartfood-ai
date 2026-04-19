from typing import List, Optional
import uuid
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.models.staff import Staff
from app.schemas.staff import StaffCreate, StaffResponse, StaffUpdate

router = APIRouter()

def to_staff_response(worker: Staff) -> StaffResponse:
    return StaffResponse(
        id=worker.id,
        name=worker.full_name,
        role=worker.role,
        active=worker.active,
        lastActiveAt=worker.updated_at or worker.created_at
    )

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
    
    return [to_staff_response(w) for w in workers]

@router.post("/", response_model=StaffResponse, status_code=status.HTTP_201_CREATED)
async def create_staff_member(
    staff_in: StaffCreate,
    db: AsyncSession = Depends(get_db)
):
    worker = Staff(
        id=str(uuid.uuid4()),
        owner_id=staff_in.owner_id,
        full_name=staff_in.name,
        role=staff_in.role,
        active=staff_in.active,
    )
    db.add(worker)
    await db.commit()
    await db.refresh(worker)
    return to_staff_response(worker)

@router.patch("/{staff_id}", response_model=StaffResponse)
async def update_staff_member(
    staff_id: str,
    staff_in: StaffUpdate,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Staff).where(Staff.id == staff_id))
    worker = result.scalar_one_or_none()
    if not worker:
        raise HTTPException(status_code=404, detail="Staff member not found")

    update_data = staff_in.model_dump(exclude_unset=True)
    if "name" in update_data:
        worker.full_name = update_data.pop("name")
    for field, value in update_data.items():
        setattr(worker, field, value)

    await db.commit()
    await db.refresh(worker)
    return to_staff_response(worker)
