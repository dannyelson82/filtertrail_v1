from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ToolLoanBase(BaseModel):
    tool_id: int
    borrower_id: Optional[int] = None
    borrower_name: str
    due_date: Optional[datetime] = None
    condition_at_checkout: Optional[str] = None
    condition_at_return: Optional[str] = None
    notes: Optional[str] = None
    return_notes: Optional[str] = None


class ToolLoanCreate(ToolLoanBase):
    pass


class ToolLoanUpdate(BaseModel):
    tool_id: Optional[int] = None
    borrower_id: Optional[int] = None
    borrower_name: Optional[str] = None
    due_date: Optional[datetime] = None
    condition_at_checkout: Optional[str] = None
    condition_at_return: Optional[str] = None
    notes: Optional[str] = None
    return_notes: Optional[str] = None
    return_date: Optional[datetime] = None


class ToolLoan(ToolLoanBase):
    id: int
    checkout_date: datetime
    return_date: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
