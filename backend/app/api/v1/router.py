from fastapi import APIRouter
from app.api.v1.endpoints import products, cafeteria, auth, payment, stats, staff, sales, inventory, suppliers

api_router = APIRouter()

# Register sub-routers here
api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(cafeteria.router, prefix="/cafeteria", tags=["cafeteria"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(payment.router, prefix="/payments", tags=["payments"])
api_router.include_router(stats.router, prefix="/stats", tags=["stats"])
api_router.include_router(staff.router, prefix="/staff", tags=["staff"])
api_router.include_router(sales.router, prefix="/sales", tags=["sales"])
api_router.include_router(inventory.router, prefix="/inventory", tags=["inventory"])
api_router.include_router(suppliers.router, prefix="/suppliers", tags=["suppliers"])
