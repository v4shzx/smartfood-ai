from fastapi import APIRouter
from app.api.v1.endpoints import products

api_router = APIRouter()

# Register sub-routers here
api_router.include_router(products.router, prefix="/products", tags=["products"])
