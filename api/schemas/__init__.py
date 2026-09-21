from .vehicle import VehicleCreate, VehicleUpdate, Vehicle
from .maintenance import MaintenanceLogCreate, MaintenanceLogUpdate, MaintenanceLog
from .tool import ToolCreate, ToolUpdate, Tool
from .part import PartCreate, PartUpdate, Part
from .loan import ToolLoanCreate, ToolLoanUpdate, ToolLoan

__all__ = [
    "VehicleCreate", "VehicleUpdate", "Vehicle",
    "MaintenanceLogCreate", "MaintenanceLogUpdate", "MaintenanceLog",
    "ToolCreate", "ToolUpdate", "Tool",
    "PartCreate", "PartUpdate", "Part",
    "ToolLoanCreate", "ToolLoanUpdate", "ToolLoan",
]
