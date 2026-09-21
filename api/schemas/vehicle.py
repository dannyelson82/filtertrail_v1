from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field


class VehicleBase(BaseModel):
    name: str = Field(..., min_length=1)
    type: str
    vehicle_type_id: Optional[int] = None
    vin: Optional[str] = None
    make: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    color: Optional[str] = None
    license_plate: Optional[str] = None
    purchase_date: Optional[date] = None
    purchase_price: Optional[float] = None
    current_value: Optional[float] = None
    sale_price: Optional[float] = None
    notes: Optional[str] = None


class VehicleCreate(VehicleBase):
    pass


class VehicleUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    vehicle_type_id: Optional[int] = None
    vin: Optional[str] = None
    make: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    color: Optional[str] = None
    license_plate: Optional[str] = None
    purchase_date: Optional[date] = None
    purchase_price: Optional[float] = None
    current_value: Optional[float] = None
    sale_price: Optional[float] = None
    notes: Optional[str] = None
    retired: Optional[bool] = None
    retired_at: Optional[datetime] = None
    retirement_reason: Optional[str] = None
    retirement_notes: Optional[str] = None


class Vehicle(VehicleBase):
    id: int
    retired: bool = False
    retired_at: Optional[datetime] = None
    retirement_reason: Optional[str] = None
    retirement_notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class VehicleRetire(BaseModel):
    retired: bool = True
    retirement_reason: str = Field(..., min_length=1, max_length=100)
    retirement_notes: Optional[str] = None
    sale_price: Optional[float] = None
