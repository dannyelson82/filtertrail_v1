from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from core.database import get_db
from models.vehicle import Vehicle as VehicleModel
from models.vehicle_type import VehicleType as VehicleTypeModel
from schemas.vehicle_type import (
    VehicleType as VehicleTypeSchema,
    VehicleTypeCreate,
    VehicleTypeUpdate,
)

router = APIRouter(prefix="/vehicle-types", tags=["vehicle-types"])


def serialize_vehicle_type(
    vehicle_type: VehicleTypeModel,
    active_vehicle_count: int = 0,
) -> VehicleTypeSchema:
    return VehicleTypeSchema(
        id=vehicle_type.id,
        name=vehicle_type.name,
        icon_key=vehicle_type.icon_key,
        is_active=vehicle_type.is_active,
        active_vehicle_count=active_vehicle_count,
        created_at=vehicle_type.created_at,
        updated_at=vehicle_type.updated_at,
    )


@router.get("/", response_model=List[VehicleTypeSchema])
def list_vehicle_types(db: Session = Depends(get_db)):
    rows = (
        db.query(
            VehicleTypeModel,
            func.count(VehicleModel.id).label("active_vehicle_count"),
        )
        .outerjoin(
            VehicleModel,
            (VehicleModel.vehicle_type_id == VehicleTypeModel.id)
            & (VehicleModel.retired.is_(False)),
        )
        .filter(VehicleTypeModel.is_active.is_(True))
        .group_by(VehicleTypeModel.id)
        .order_by(VehicleTypeModel.name.asc())
        .all()
    )

    return [
        serialize_vehicle_type(vehicle_type, active_vehicle_count)
        for vehicle_type, active_vehicle_count in rows
    ]


@router.post(
    "/",
    response_model=VehicleTypeSchema,
    status_code=status.HTTP_201_CREATED,
)
def create_vehicle_type(
    payload: VehicleTypeCreate,
    db: Session = Depends(get_db),
):
    name = payload.name.strip()

    existing = (
        db.query(VehicleTypeModel)
        .filter(func.lower(VehicleTypeModel.name) == name.lower())
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A vehicle type with this name already exists.",
        )

    vehicle_type = VehicleTypeModel(
        name=name,
        icon_key=payload.icon_key.strip() or "vehicle",
    )
    db.add(vehicle_type)
    db.commit()
    db.refresh(vehicle_type)

    return serialize_vehicle_type(vehicle_type)


@router.patch("/{vehicle_type_id}", response_model=VehicleTypeSchema)
def update_vehicle_type(
    vehicle_type_id: int,
    payload: VehicleTypeUpdate,
    db: Session = Depends(get_db),
):
    vehicle_type = db.get(VehicleTypeModel, vehicle_type_id)

    if vehicle_type is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle type not found.",
        )

    updates = payload.model_dump(exclude_unset=True)

    if updates.get("name") is not None:
        name = updates["name"].strip()

        duplicate = (
            db.query(VehicleTypeModel)
            .filter(
                func.lower(VehicleTypeModel.name) == name.lower(),
                VehicleTypeModel.id != vehicle_type_id,
            )
            .first()
        )

        if duplicate:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A vehicle type with this name already exists.",
            )

        vehicle_type.name = name

    if updates.get("icon_key") is not None:
        vehicle_type.icon_key = updates["icon_key"].strip() or "vehicle"

    if "is_active" in updates:
        vehicle_type.is_active = updates["is_active"]

    db.commit()
    db.refresh(vehicle_type)

    active_vehicle_count = (
        db.query(func.count(VehicleModel.id))
        .filter(
            VehicleModel.vehicle_type_id == vehicle_type.id,
            VehicleModel.retired.is_(False),
        )
        .scalar()
        or 0
    )

    return serialize_vehicle_type(vehicle_type, active_vehicle_count)
