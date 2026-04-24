from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PaymentMethodBase(BaseModel):
    brand: str
    last4: str
    exp_month: int
    exp_year: int
    is_primary: bool = False

class PaymentMethodCreate(PaymentMethodBase):
    user_id: str

class PaymentMethod(PaymentMethodBase):
    id: str
    user_id: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
