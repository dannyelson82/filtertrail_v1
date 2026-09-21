from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db
from models.vehicle import Vehicle as VehicleModel
from schemas.vehicle import Vehicle, VehicleCreate, VehicleRetire, VehicleUpdate

router = APIRouter(prefix="/vehicles", tags=["vehicles"])


@router.get("/", response_model=List[Vehicle])
def list_vehicles(
    include_retired: bool = False,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    query = db.query(VehicleModel)

    if not include_retired:
        query = query.filter(VehicleModel.retired.is_(False))

    return (
        query.order_by(VehicleModel.name.asc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.post("/", response_model=Vehicle, status_code=status.HTTP_201_CREATED)
def create_vehicle(vehicle: VehicleCreate, db: Session = Depends(get_db)):
    db_vehicle = VehicleModel(**vehicle.model_dump())

    try:
        db.add(db_vehicle)
        db.commit()
        db.refresh(db_vehicle)
        return db_vehicle
    except Exception:
        db.rollback()
        raise


@router.get("/{vehicle_id}", response_model=Vehicle)
def get_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    vehicle = (
        db.query(VehicleModel)
        .filter(VehicleModel.id == vehicle_id)
        .first()
    )

    if vehicle is None:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    return vehicle


@router.put("/{vehicle_id}", response_model=Vehicle)
def update_vehicle(
    vehicle_id: int,
    vehicle: VehicleUpdate,
    db: Session = Depends(get_db),
):
    db_vehicle = (
        db.query(VehicleModel)
        .filter(VehicleModel.id == vehicle_id)
        .first()
    )

    if db_vehicle is None:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    for field, value in vehicle.model_dump(exclude_unset=True).items():
        setattr(db_vehicle, field, value)

    try:
        db.commit()
        db.refresh(db_vehicle)
        return db_vehicle
    except Exception:
        db.rollback()
        raise


@router.put("/{vehicle_id}/retire", response_model=Vehicle)
def retire_vehicle(
    vehicle_id: int,
    payload: VehicleRetire,
    db: Session = Depends(get_db),
):
    db_vehicle = (
        db.query(VehicleModel)
        .filter(VehicleModel.id == vehicle_id)
        .first()
    )

    if db_vehicle is None:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    if payload.retired:
        db_vehicle.retired = True
        db_vehicle.retired_at = datetime.now(timezone.utc)
        db_vehicle.retirement_reason = payload.retirement_reason
        db_vehicle.retirement_notes = payload.retirement_notes
        db_vehicle.sale_price = payload.sale_price
    else:
        db_vehicle.retired = False
        db_vehicle.retired_at = None
        db_vehicle.retirement_reason = None
        db_vehicle.retirement_notes = None
        db_vehicle.sale_price = None

    try:
        db.commit()
        db.refresh(db_vehicle)
        return db_vehicle
    except Exception:
        db.rollback()
        raise


@router.delete("/{vehicle_id}")
def delete_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    db_vehicle = (
        db.query(VehicleModel)
        .filter(VehicleModel.id == vehicle_id)
        .first()
    )

    if db_vehicle is None:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    try:
        db.delete(db_vehicle)
        db.commit()
        return {"ok": True}
    except Exception:
        db.rollback()
        raise
