from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db
from models.part import Part as PartModel
from schemas.part import Part as PartSchema
from schemas.part import PartCreate, PartUpdate

router = APIRouter(prefix="/parts", tags=["parts"])


@router.get("/", response_model=List[PartSchema])
def list_parts(
    include_retired: bool = False,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    query = db.query(PartModel)

    if not include_retired:
        query = query.filter(PartModel.is_retired.is_(False))

    return query.order_by(PartModel.name.asc()).offset(skip).limit(limit).all()


@router.post("/", response_model=PartSchema, status_code=status.HTTP_201_CREATED)
def create_part(
    part: PartCreate,
    db: Session = Depends(get_db),
):
    db_part = PartModel(**part.model_dump())

    try:
        db.add(db_part)
        db.commit()
        db.refresh(db_part)
        return db_part
    except Exception:
        db.rollback()
        raise


@router.get("/{part_id}", response_model=PartSchema)
def get_part(part_id: int, db: Session = Depends(get_db)):
    part = db.query(PartModel).filter(PartModel.id == part_id).first()

    if part is None:
        raise HTTPException(status_code=404, detail="Part not found")

    return part


@router.put("/{part_id}", response_model=PartSchema)
def update_part(
    part_id: int,
    part: PartUpdate,
    db: Session = Depends(get_db),
):
    db_part = db.query(PartModel).filter(PartModel.id == part_id).first()

    if db_part is None:
        raise HTTPException(status_code=404, detail="Part not found")

    for field, value in part.model_dump(exclude_unset=True).items():
        setattr(db_part, field, value)

    try:
        db.commit()
        db.refresh(db_part)
        return db_part
    except Exception:
        db.rollback()
        raise


@router.delete("/{part_id}")
def delete_part(part_id: int, db: Session = Depends(get_db)):
    db_part = db.query(PartModel).filter(PartModel.id == part_id).first()

    if db_part is None:
        raise HTTPException(status_code=404, detail="Part not found")

    try:
        db.delete(db_part)
        db.commit()
        return {"ok": True}
    except Exception:
        db.rollback()
        raise
