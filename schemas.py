from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List
from datetime import datetime
from models import UserRole, EmployeeStatus

# User Schemas
class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    role: UserRole = UserRole.USER
    is_active: bool = True

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr] = None
    first_name: Optional[str] = Field(None, min_length=1, max_length=50)
    last_name: Optional[str] = Field(None, min_length=1, max_length=50)
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None

class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    created_at: datetime
    updated_at: datetime

# Employee Schemas
class EmployeeBase(BaseModel):
    employee_id: str = Field(..., min_length=1, max_length=20)
    department: str = Field(..., min_length=1, max_length=100)
    position: str = Field(..., min_length=1, max_length=100)
    salary: Optional[int] = Field(None, ge=0)  # Salary in cents
    hire_date: datetime
    status: EmployeeStatus = EmployeeStatus.ACTIVE
    manager_id: Optional[int] = None
    phone: Optional[str] = Field(None, max_length=20)
    address: Optional[str] = None

class EmployeeCreate(EmployeeBase):
    user_id: int

class EmployeeUpdate(BaseModel):
    employee_id: Optional[str] = Field(None, min_length=1, max_length=20)
    department: Optional[str] = Field(None, min_length=1, max_length=100)
    position: Optional[str] = Field(None, min_length=1, max_length=100)
    salary: Optional[int] = Field(None, ge=0)
    hire_date: Optional[datetime] = None
    status: Optional[EmployeeStatus] = None
    manager_id: Optional[int] = None
    phone: Optional[str] = Field(None, max_length=20)
    address: Optional[str] = None

class EmployeeResponse(EmployeeBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    user: UserResponse

# Pagination Schema
class PaginationParams(BaseModel):
    page: int = Field(1, ge=1, description="Page number")
    size: int = Field(10, ge=1, le=100, description="Items per page")

class PaginatedResponse(BaseModel):
    items: List[dict]
    total: int
    page: int
    size: int
    pages: int

# Filter and Search Schemas
class UserFilters(BaseModel):
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
    search: Optional[str] = Field(None, description="Search in username, email, first_name, last_name")
    order_by: Optional[str] = Field("created_at", description="Field to order by")
    order_desc: bool = Field(False, description="Order in descending order")

class EmployeeFilters(BaseModel):
    department: Optional[str] = None
    position: Optional[str] = None
    status: Optional[EmployeeStatus] = None
    manager_id: Optional[int] = None
    search: Optional[str] = Field(None, description="Search in employee_id, department, position")
    order_by: Optional[str] = Field("created_at", description="Field to order by")
    order_desc: bool = Field(False, description="Order in descending order")
