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


# ==================== AUTH SCHEMAS (NEW) ====================
class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str   # user types this when registering

class User(UserBase):
    id: int
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None