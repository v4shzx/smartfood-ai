from sqlalchemy import Column, String, Integer, Float
from app.core.database import Base

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(String, primary_key=True, index=True)
    owner_id = Column(String, index=True)
    name = Column(String, index=True)
    contact = Column(String)
    phone = Column(String)
    email = Column(String)
    lead_days = Column(Integer)
    rating = Column(Float)
