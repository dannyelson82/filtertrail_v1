from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db
from models.vehicle import Vehicle as VehicleModel
from models.vehicle_type import VehicleType as VehicleTypeModel
from schemas.vehicle import Vehicle, VehicleCreate, VehicleRetire, VehicleUpdate

router = APIRouter(prefix="/vehicles", tags=["vehicles"])


def validate_vehicle_type_id(
    vehicle_type_id: Optional[int],
    db: Session,
) -> None:
    if vehicle_type_id is None:
        return

    vehicle_type = db.get(VehicleTypeModel, vehicle_type_id)

    if vehicle_type is None or not vehicle_type.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Selected vehicle type is invalid or inactive.",
        )


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
    validate_vehicle_type_id(vehicle.vehicle_type_id, db)

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

    updates = vehicle.model_dump(exclude_unset=True)

    if "vehicle_type_id" in updates:
        validate_vehicle_type_id(updates["vehicle_type_id"], db)

    for field, value in updates.items():
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
