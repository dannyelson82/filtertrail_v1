from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, Text
from sqlalchemy.sql.sqltypes import DateTime
from sqlalchemy import func
from core.database import Base

class MaintenanceLog(Base):
    __tablename__ = "maintenance_logs"

    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False)
    service_date = Column(Date, nullable=False)
    service_type = Column(String(100), nullable=False)
    odometer_at_service = Column(Integer, nullable=True)
    engine_hours_at_service = Column(Integer, nullable=True)
    cost_parts = Column(Float, nullable=True)
    cost_labor = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
