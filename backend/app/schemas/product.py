from typing import Optional
from pydantic import BaseModel

class ProductBase(BaseModel):
    name: str
    category: str
    price: float
    available: bool = True
    on_hand: int = 0
    min_stock: int = 5
    imageUrl: Optional[str] = None

class ProductCreate(ProductBase):
    id: Optional[str] = None

class ProductUpdate(ProductBase):
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    available: Optional[bool] = None

class Product(ProductBase):
    id: str

    class Config:
        from_attributes = True
