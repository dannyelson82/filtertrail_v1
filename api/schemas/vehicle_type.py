from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class VehicleTypeBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    icon_key: str = Field(default="vehicle", min_length=1, max_length=64)


class VehicleTypeCreate(VehicleTypeBase):
    pass


class VehicleTypeUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    icon_key: Optional[str] = Field(default=None, min_length=1, max_length=64)
    is_active: Optional[bool] = None


class VehicleType(VehicleTypeBase):
    id: int
    is_active: bool = True
    active_vehicle_count: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
