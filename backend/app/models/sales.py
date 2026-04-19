from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Integer
from sqlalchemy.sql import func
from app.core.database import Base

class Sale(Base):
    __tablename__ = "sales"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True)
    product_id = Column(String, ForeignKey("products.id"))
    quantity = Column(Integer)
    total_price = Column(Float)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    payment_method = Column(String)

class Waste(Base):
    __tablename__ = "waste"

    id = Column(String, primary_key=True, index=True)
    product_id = Column(String, ForeignKey("products.id"))
    quantity = Column(Integer)
    reason = Column(String)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
