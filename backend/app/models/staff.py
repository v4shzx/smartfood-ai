from sqlalchemy import Column, String
from app.core.database import Base

class Staff(Base):
    __tablename__ = "staff"

    id = Column(String, primary_key=True, index=True)
    owner_id = Column(String, index=True)
    full_name = Column(String)
    role = Column(String)
    email = Column(String)
