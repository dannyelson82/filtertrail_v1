from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, date

class MaintenanceLogBase(BaseModel):
    vehicle_id: int
    service_date: date
    service_type: str
    odometer_at_service: Optional[int] = None
    engine_hours_at_service: Optional[int] = None
    cost_parts: Optional[float] = None
    cost_labor: Optional[float] = None
    notes: Optional[str] = None

class MaintenanceLogCreate(MaintenanceLogBase):
    pass

class MaintenanceLogUpdate(BaseModel):
    vehicle_id: Optional[int] = None
    service_date: Optional[date] = None
    service_type: Optional[str] = None
    odometer_at_service: Optional[int] = None
    engine_hours_at_service: Optional[int] = None
    cost_parts: Optional[float] = None
    cost_labor: Optional[float] = None
    notes: Optional[str] = None

class MaintenanceLog(MaintenanceLogBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
