from sqlalchemy import Column, String, Integer, Boolean
from app.core.database import Base

class PaymentMethod(Base):
    __tablename__ = "payment_methods"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True)
    brand = Column(String)
    last4 = Column(String)
    exp_month = Column(Integer)
    exp_year = Column(Integer)
    is_primary = Column(Boolean, default=False)
