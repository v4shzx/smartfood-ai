from sqlalchemy import Column, String, Float, Boolean, ForeignKey, Integer, DateTime, Text
from sqlalchemy.sql import func
from app.core.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, index=True)
    owner_id = Column(String, index=True)
    name = Column(String, index=True)
    category = Column(String, index=True)
    price = Column(Float)
    available = Column(Boolean, default=True)
    on_hand = Column(Integer, default=0)
    min_stock = Column(Integer, default=5)
    image_url = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
