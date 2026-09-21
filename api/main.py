from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.database import Base, engine
from models.borrower import Borrower
from models.vehicle_type import VehicleType
from routes import (
    borrowers,
    health,
    loans,
    maintenance,
    parts,
    tools,
    vehicle_types,
    vehicles,
)

# Create tables for imported SQLAlchemy models.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Filter Trail API", version="0.1.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tighten this when authentication/origins are finalized.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(vehicles.router, prefix="/api")
app.include_router(vehicle_types.router, prefix="/api")
app.include_router(maintenance.router, prefix="/api")
app.include_router(tools.router, prefix="/api")
app.include_router(parts.router, prefix="/api")
app.include_router(loans.router, prefix="/api")
app.include_router(borrowers.router, prefix="/api")


@app.get("/")
def root():
    return {"service": "Filter Trail API", "status": "running"}
