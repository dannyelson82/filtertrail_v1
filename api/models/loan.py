from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.sql.sqltypes import DateTime
from sqlalchemy import func

from core.database import Base


class ToolLoan(Base):
    __tablename__ = "tool_loans"

    id = Column(Integer, primary_key=True, index=True)
    tool_id = Column(Integer, ForeignKey("tools.id"), nullable=False)

    borrower_id = Column(Integer, ForeignKey("borrowers.id"), nullable=True)
    borrower_name = Column(String(255), nullable=False)

    checkout_date = Column(DateTime, nullable=False, server_default=func.now())
    due_date = Column(DateTime, nullable=True)
    return_date = Column(DateTime, nullable=True)

    condition_at_checkout = Column(String(50), nullable=True)
    condition_at_return = Column(String(50), nullable=True)

    notes = Column(Text, nullable=True)
    return_notes = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
