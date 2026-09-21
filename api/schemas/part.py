from datetime import datetime, date
from typing import Optional

from pydantic import BaseModel, Field


class PartBase(BaseModel):
    name: str = Field(..., min_length=1)
    category: str
    part_number: Optional[str] = None
    brand: Optional[str] = None
    model_compatibility: Optional[str] = None
    purchase_date: Optional[date] = None
    purchase_price: Optional[float] = None
    current_value: Optional[float] = None
    quantity_on_hand: Optional[int] = 0
    location: Optional[str] = None
    condition_status: Optional[str] = "good"
    notes: Optional[str] = None


class PartCreate(PartBase):
    pass


class PartUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    part_number: Optional[str] = None
    brand: Optional[str] = None
    model_compatibility: Optional[str] = None
    purchase_date: Optional[date] = None
    purchase_price: Optional[float] = None
    current_value: Optional[float] = None
    quantity_on_hand: Optional[int] = None
    location: Optional[str] = None
    condition_status: Optional[str] = None
    notes: Optional[str] = None

    is_retired: Optional[bool] = None
    retired_at: Optional[datetime] = None
    retirement_reason: Optional[str] = None
    retirement_notes: Optional[str] = None


class Part(PartBase):
    id: int
    is_retired: bool = False
    retired_at: Optional[datetime] = None
    retirement_reason: Optional[str] = None
    retirement_notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
