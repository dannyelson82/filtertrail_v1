from sqlalchemy import Boolean, Column, Integer, String, Float, Date, Text, Numeric
from sqlalchemy.sql.sqltypes import DateTime
from sqlalchemy import func

from core.database import Base


class Part(Base):
    __tablename__ = "parts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)

    quantity = Column(Integer, nullable=True, default=0)
    unit = Column(String(50), nullable=True)
    min_stock_level = Column(Integer, nullable=True)
    cost_per_unit = Column(Float, nullable=True)
    supplier = Column(String(255), nullable=True)

    location = Column(String(255), nullable=True)
    part_number = Column(String(100), nullable=True)
    brand = Column(String(100), nullable=True)
    model_compatibility = Column(String(255), nullable=True)
    condition_status = Column(String(50), nullable=True, default="good")
    notes = Column(Text, nullable=True)

    purchase_date = Column(Date, nullable=True)
    purchase_price = Column(Float, nullable=True)
    current_value = Column(Float, nullable=True)

    quantity_on_hand = Column(Integer, nullable=True, default=0)

    is_retired = Column(Boolean, nullable=False, default=False)
    retired_at = Column(DateTime, nullable=True)
    retirement_reason = Column(String(100), nullable=True)
    retirement_notes = Column(Text, nullable=True)
    sale_price = Column(Numeric(12, 2), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
