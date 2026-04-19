from sqlalchemy import Column, String, Float, Boolean, ForeignKey
from app.core.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, index=True)
    owner_id = Column(String, index=True)
    name = Column(String, index=True)
    category = Column(String, index=True)
    price = Column(Float)
    available = Column(Boolean, default=True)
    on_hand = Column(Float, default=0.0)
