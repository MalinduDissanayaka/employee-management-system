from pydantic import BaseModel
from typing import Optional

class EmployeeBase(BaseModel):
    name: str
    email: str
    department: str
    position: str
    salary: float

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(EmployeeBase):
    pass

class Employee(EmployeeBase):
    id: int
    
    class Config:
        from_attributes = True   # tells Pydantic to read from SQLAlchemy model