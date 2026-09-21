from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db
from models.borrower import Borrower as BorrowerModel
from schemas.borrower import Borrower as BorrowerSchema
from schemas.borrower import BorrowerCreate, BorrowerUpdate

router = APIRouter(prefix="/borrowers", tags=["borrowers"])


@router.get("/", response_model=List[BorrowerSchema])
def list_borrowers(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    return (
        db.query(BorrowerModel)
        .order_by(BorrowerModel.name.asc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.post("/", response_model=BorrowerSchema, status_code=status.HTTP_201_CREATED)
def create_borrower(
    borrower: BorrowerCreate,
    db: Session = Depends(get_db),
):
    db_borrower = BorrowerModel(**borrower.model_dump())

    try:
        db.add(db_borrower)
        db.commit()
        db.refresh(db_borrower)
        return db_borrower
    except Exception:
        db.rollback()
        raise


@router.get("/{borrower_id}", response_model=BorrowerSchema)
def get_borrower(borrower_id: int, db: Session = Depends(get_db)):
    borrower = (
        db.query(BorrowerModel)
        .filter(BorrowerModel.id == borrower_id)
        .first()
    )

    if borrower is None:
        raise HTTPException(status_code=404, detail="Borrower not found")

    return borrower


@router.put("/{borrower_id}", response_model=BorrowerSchema)
def update_borrower(
    borrower_id: int,
    borrower: BorrowerUpdate,
    db: Session = Depends(get_db),
):
    db_borrower = (
        db.query(BorrowerModel)
        .filter(BorrowerModel.id == borrower_id)
        .first()
    )

    if db_borrower is None:
        raise HTTPException(status_code=404, detail="Borrower not found")

    for field, value in borrower.model_dump(exclude_unset=True).items():
        setattr(db_borrower, field, value)

    try:
        db.commit()
        db.refresh(db_borrower)
        return db_borrower
    except Exception:
        db.rollback()
        raise


@router.delete("/{borrower_id}")
def delete_borrower(borrower_id: int, db: Session = Depends(get_db)):
    db_borrower = (
        db.query(BorrowerModel)
        .filter(BorrowerModel.id == borrower_id)
        .first()
    )

    if db_borrower is None:
        raise HTTPException(status_code=404, detail="Borrower not found")

    try:
        db.delete(db_borrower)
        db.commit()
        return {"ok": True}
    except Exception:
        db.rollback()
        raise
