from fastapi import APIRouter
from app.api.v1.endpoints import products, cafeteria, auth

api_router = APIRouter()

# Register sub-routers here
api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(cafeteria.router, prefix="/cafeteria", tags=["cafeteria"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
