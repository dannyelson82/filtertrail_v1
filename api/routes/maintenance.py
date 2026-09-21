from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from core.database import get_db
from models.maintenance import MaintenanceLog
from schemas.maintenance import MaintenanceLogCreate, MaintenanceLogUpdate, MaintenanceLog

router = APIRouter(prefix="/maintenance", tags=["maintenance"])

@router.get("/", response_model=List[MaintenanceLog])
def list_maintenance(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(MaintenanceLog).offset(skip).limit(limit).all()

@router.post("/", response_model=MaintenanceLog)
def create_maintenance(log: MaintenanceLogCreate, db: Session = Depends(get_db)):
    db_log = MaintenanceLog(**log.model_dump())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

@router.get("/{log_id}", response_model=MaintenanceLog)
def get_maintenance(log_id: int, db: Session = Depends(get_db)):
    log = db.query(MaintenanceLog).filter(MaintenanceLog.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    return log

@router.put("/{log_id}", response_model=MaintenanceLog)
def update_maintenance(log_id: int, log: MaintenanceLogUpdate, db: Session = Depends(get_db)):
    db_log = db.query(MaintenanceLog).filter(MaintenanceLog.id == log_id).first()
    if not db_log:
        raise HTTPException(status_code=404, detail="Log not found")
    for key, value in log.model_dump(exclude_unset=True).items():
        setattr(db_log, key, value)
    db.commit()
    db.refresh(db_log)
    return db_log

@router.delete("/{log_id}")
def delete_maintenance(log_id: int, db: Session = Depends(get_db)):
    db_log = db.query(MaintenanceLog).filter(MaintenanceLog.id == log_id).first()
    if not db_log:
        raise HTTPException(status_code=404, detail="Log not found")
    db.delete(db_log)
    db.commit()
    return {"ok": True}
