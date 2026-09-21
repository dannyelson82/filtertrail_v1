from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db
from models.tool import Tool as ToolModel
from schemas.tool import Tool as ToolSchema
from schemas.tool import ToolCreate, ToolUpdate

router = APIRouter(prefix="/tools", tags=["tools"])


@router.get("/", response_model=List[ToolSchema])
def list_tools(
    include_retired: bool = False,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    query = db.query(ToolModel)

    if not include_retired:
        query = query.filter(ToolModel.is_retired.is_(False))

    return query.order_by(ToolModel.name.asc()).offset(skip).limit(limit).all()


@router.post("/", response_model=ToolSchema, status_code=status.HTTP_201_CREATED)
def create_tool(
    tool: ToolCreate,
    db: Session = Depends(get_db),
):
    db_tool = ToolModel(**tool.model_dump())

    try:
        db.add(db_tool)
        db.commit()
        db.refresh(db_tool)
        return db_tool
    except Exception:
        db.rollback()
        raise


@router.get("/{tool_id}", response_model=ToolSchema)
def get_tool(tool_id: int, db: Session = Depends(get_db)):
    tool = db.query(ToolModel).filter(ToolModel.id == tool_id).first()

    if tool is None:
        raise HTTPException(status_code=404, detail="Tool not found")

    return tool


@router.put("/{tool_id}", response_model=ToolSchema)
def update_tool(
    tool_id: int,
    tool: ToolUpdate,
    db: Session = Depends(get_db),
):
    db_tool = db.query(ToolModel).filter(ToolModel.id == tool_id).first()

    if db_tool is None:
        raise HTTPException(status_code=404, detail="Tool not found")

    for field, value in tool.model_dump(exclude_unset=True).items():
        setattr(db_tool, field, value)

    try:
        db.commit()
        db.refresh(db_tool)
        return db_tool
    except Exception:
        db.rollback()
        raise


@router.delete("/{tool_id}")
def delete_tool(tool_id: int, db: Session = Depends(get_db)):
    db_tool = db.query(ToolModel).filter(ToolModel.id == tool_id).first()

    if db_tool is None:
        raise HTTPException(status_code=404, detail="Tool not found")

    try:
        db.delete(db_tool)
        db.commit()
        return {"ok": True}
    except Exception:
        db.rollback()
        raise
