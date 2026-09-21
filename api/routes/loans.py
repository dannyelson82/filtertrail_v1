from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.database import get_db
from models.borrower import Borrower as BorrowerModel
from models.loan import ToolLoan as ToolLoanModel
from schemas.loan import ToolLoan as ToolLoanSchema
from schemas.loan import ToolLoanCreate, ToolLoanUpdate

router = APIRouter(prefix="/loans", tags=["loans"])


@router.get("/", response_model=List[ToolLoanSchema])
def list_loans(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    return (
        db.query(ToolLoanModel)
        .order_by(ToolLoanModel.checkout_date.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.post("/", response_model=ToolLoanSchema)
def create_loan(loan: ToolLoanCreate, db: Session = Depends(get_db)):
    borrower_name = loan.borrower_name.strip()

    if loan.borrower_id is not None:
        borrower = (
            db.query(BorrowerModel)
            .filter(BorrowerModel.id == loan.borrower_id)
            .first()
        )

        if borrower is None:
            raise HTTPException(status_code=404, detail="Borrower not found")

        borrower_name = borrower.name

    if not borrower_name:
        raise HTTPException(status_code=422, detail="Borrower name is required")

    loan_data = loan.model_dump()
    loan_data["borrower_name"] = borrower_name

    db_loan = ToolLoanModel(
        **loan_data,
        checkout_date=datetime.utcnow(),
    )

    try:
        db.add(db_loan)
        db.commit()
        db.refresh(db_loan)
        return db_loan
    except Exception:
        db.rollback()
        raise


@router.get("/{loan_id}", response_model=ToolLoanSchema)
def get_loan(loan_id: int, db: Session = Depends(get_db)):
    loan = (
        db.query(ToolLoanModel)
        .filter(ToolLoanModel.id == loan_id)
        .first()
    )

    if loan is None:
        raise HTTPException(status_code=404, detail="Loan not found")

    return loan


@router.put("/{loan_id}", response_model=ToolLoanSchema)
def update_loan(
    loan_id: int,
    loan: ToolLoanUpdate,
    db: Session = Depends(get_db),
):
    db_loan = (
        db.query(ToolLoanModel)
        .filter(ToolLoanModel.id == loan_id)
        .first()
    )

    if db_loan is None:
        raise HTTPException(status_code=404, detail="Loan not found")

    update_data = loan.model_dump(exclude_unset=True)

    if "borrower_id" in update_data and update_data["borrower_id"] is not None:
        borrower = (
            db.query(BorrowerModel)
            .filter(BorrowerModel.id == update_data["borrower_id"])
            .first()
        )

        if borrower is None:
            raise HTTPException(status_code=404, detail="Borrower not found")

        update_data["borrower_name"] = borrower.name

    for field, value in update_data.items():
        setattr(db_loan, field, value)

    try:
        db.commit()
        db.refresh(db_loan)
        return db_loan
    except Exception:
        db.rollback()
        raise


@router.delete("/{loan_id}")
def delete_loan(loan_id: int, db: Session = Depends(get_db)):
    db_loan = (
        db.query(ToolLoanModel)
        .filter(ToolLoanModel.id == loan_id)
        .first()
    )

    if db_loan is None:
        raise HTTPException(status_code=404, detail="Loan not found")

    try:
        db.delete(db_loan)
        db.commit()
        return {"ok": True}
    except Exception:
        db.rollback()
        raise
