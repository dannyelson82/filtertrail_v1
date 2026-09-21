from sqlalchemy import Boolean, Column, Date, Float, Integer, String, Text
from sqlalchemy.sql.sqltypes import DateTime
from sqlalchemy import func

from core.database import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False)
    vin = Column(String(100), nullable=True)
    make = Column(String(100), nullable=True)
    model = Column(String(100), nullable=True)
    year = Column(Integer, nullable=True)
    color = Column(String(50), nullable=True)
    license_plate = Column(String(50), nullable=True)
    purchase_date = Column(Date, nullable=True)
    purchase_price = Column(Float, nullable=True)
    current_value = Column(Float, nullable=True)
    sale_price = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)

    retired = Column(Boolean, nullable=False, default=False)
    retired_at = Column(DateTime(timezone=True), nullable=True)
    retirement_reason = Column(String(100), nullable=True)
    retirement_notes = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
