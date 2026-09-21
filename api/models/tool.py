from sqlalchemy import Boolean, Column, Integer, String, Float, Date, Text
from sqlalchemy.sql.sqltypes import DateTime
from sqlalchemy import func

from core.database import Base


class Tool(Base):
    __tablename__ = "tools"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    serial_number = Column(String(100), nullable=True)
    brand = Column(String(100), nullable=True)
    model = Column(String(100), nullable=True)
    purchase_date = Column(Date, nullable=True)
    purchase_price = Column(Float, nullable=True)
    current_value = Column(Float, nullable=True)
    location = Column(String(255), nullable=True)
    condition_status = Column(String(50), default="good")
    notes = Column(Text, nullable=True)

    is_retired = Column(Boolean, nullable=False, default=False)
    retired_at = Column(DateTime, nullable=True)
    retirement_reason = Column(String(100), nullable=True)
    retirement_notes = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
