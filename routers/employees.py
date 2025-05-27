from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_, desc, asc
from sqlalchemy.orm import selectinload
from typing import List, Optional
import math

from database import get_db
from models import Employee, User
from schemas import (
    EmployeeCreate, EmployeeUpdate, EmployeeResponse, 
    PaginatedResponse, EmployeeFilters
)

router = APIRouter()

@router.post("/", response_model=EmployeeResponse, status_code=201)
async def create_employee(
    employee_data: EmployeeCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new employee"""
    # Check if user exists
    user_result = await db.execute(select(User).where(User.id == employee_data.user_id))
    user = user_result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if user already has an employee record
    existing_employee = await db.execute(
        select(Employee).where(Employee.user_id == employee_data.user_id)
    )
    if existing_employee.scalar_one_or_none():
        raise HTTPException(
            status_code=400, 
            detail="User already has an employee record"
        )
    
    # Check if employee_id already exists
    existing_emp_id = await db.execute(
        select(Employee).where(Employee.employee_id == employee_data.employee_id)
    )
    if existing_emp_id.scalar_one_or_none():
        raise HTTPException(
            status_code=400, 
            detail="Employee ID already exists"
        )
    
    # Create new employee
    db_employee = Employee(**employee_data.model_dump())
    db.add(db_employee)
    await db.commit()
    await db.refresh(db_employee)
    
    # Load the user relationship
    result = await db.execute(
        select(Employee).options(selectinload(Employee.user)).where(Employee.id == db_employee.id)
    )
    employee_with_user = result.scalar_one()
    
    return employee_with_user

@router.get("/", response_model=PaginatedResponse)
async def get_employees(
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(10, ge=1, le=100, description="Items per page"),
    department: Optional[str] = Query(None, description="Filter by department"),
    position: Optional[str] = Query(None, description="Filter by position"),
    status: Optional[str] = Query(None, description="Filter by status"),
    manager_id: Optional[int] = Query(None, description="Filter by manager ID"),
    search: Optional[str] = Query(None, description="Search in employee_id, department, position"),
    order_by: str = Query("created_at", description="Field to order by"),
    order_desc: bool = Query(False, description="Order in descending order"),
    db: AsyncSession = Depends(get_db)
):
    """Get paginated list of employees with filtering, searching, and ordering"""
    try:
        # Build base query with user relationship
        query = select(Employee).options(selectinload(Employee.user))
        
        # Apply filters
        if department:
            query = query.where(Employee.department.ilike(f"%{department}%"))
        if position:
            query = query.where(Employee.position.ilike(f"%{position}%"))
        if status:
            query = query.where(Employee.status == status)
        if manager_id is not None:
            query = query.where(Employee.manager_id == manager_id)
        
        # Apply search
        if search:
            search_filter = or_(
                Employee.employee_id.ilike(f"%{search}%"),
                Employee.department.ilike(f"%{search}%"),
                Employee.position.ilike(f"%{search}%")
            )
            query = query.where(search_filter)
        
        # Get total count
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await db.execute(count_query)
        total = total_result.scalar()
        
        # Apply ordering
        if hasattr(Employee, order_by):
            order_column = getattr(Employee, order_by)
            if order_desc:
                query = query.order_by(desc(order_column))
            else:
                query = query.order_by(asc(order_column))
        else:
            # Default ordering if specified column doesn't exist
            query = query.order_by(desc(Employee.created_at))
        
        # Apply pagination
        offset = (page - 1) * size
        query = query.offset(offset).limit(size)
        
        # Execute query
        result = await db.execute(query)
        employees = result.scalars().all()
        
        # Calculate pagination info
        pages = math.ceil(total / size) if total > 0 else 0
        
        return PaginatedResponse(
            items=[EmployeeResponse.model_validate(employee) for employee in employees],
            total=total,
            page=page,
            size=size,
            pages=pages
        )
    except Exception as e:
        print(f"Error in get_employees: {str(e)}")  # This will show in server logs
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while fetching employees: {str(e)}"
        )

@router.get("/{employee_id}", response_model=EmployeeResponse)
async def get_employee(
    employee_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific employee by ID"""
    result = await db.execute(
        select(Employee).options(selectinload(Employee.user)).where(Employee.id == employee_id)
    )
    employee = result.scalar_one_or_none()
    
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    return employee

@router.put("/{employee_id}", response_model=EmployeeResponse)
async def update_employee(
    employee_id: int,
    employee_data: EmployeeUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update a specific employee"""
    result = await db.execute(
        select(Employee).options(selectinload(Employee.user)).where(Employee.id == employee_id)
    )
    employee = result.scalar_one_or_none()
    
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Check for unique employee_id constraint if updating
    update_data = employee_data.model_dump(exclude_unset=True)
    if 'employee_id' in update_data:
        existing_emp_id = await db.execute(
            select(Employee).where(
                Employee.id != employee_id,
                Employee.employee_id == update_data['employee_id']
            )
        )
        if existing_emp_id.scalar_one_or_none():
            raise HTTPException(
                status_code=400, 
                detail="Employee ID already exists"
            )
    
    # Update employee fields
    for field, value in update_data.items():
        setattr(employee, field, value)
    
    await db.commit()
    await db.refresh(employee)
    
    return employee

@router.delete("/{employee_id}", status_code=204)
async def delete_employee(
    employee_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Delete a specific employee"""
    result = await db.execute(select(Employee).where(Employee.id == employee_id))
    employee = result.scalar_one_or_none()
    
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    await db.delete(employee)
    await db.commit()
    
    return None

@router.get("/{employee_id}/subordinates", response_model=List[EmployeeResponse])
async def get_employee_subordinates(
    employee_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get all subordinates of a specific employee"""
    # First check if the employee exists
    manager_result = await db.execute(select(Employee).where(Employee.id == employee_id))
    manager = manager_result.scalar_one_or_none()
    
    if not manager:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Get subordinates
    result = await db.execute(
        select(Employee).options(selectinload(Employee.user)).where(Employee.manager_id == employee_id)
    )
    subordinates = result.scalars().all()
    
    return subordinates
