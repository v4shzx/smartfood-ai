from sqlalchemy import Column, String
from app.core.database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True, index=True)
    owner_id = Column(String, index=True)
    name = Column(String)
