from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_, desc, asc
from typing import List, Optional
import math

from database import get_db
from models import User
from schemas import (
    UserCreate, UserUpdate, UserResponse, 
    PaginatedResponse, UserFilters
)

router = APIRouter()

@router.post("/", response_model=UserResponse, status_code=201)
async def create_user(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new user"""
    # Check if username or email already exists
    existing_user = await db.execute(
        select(User).where(
            or_(User.username == user_data.username, User.email == user_data.email)
        )
    )
    if existing_user.scalar_one_or_none():
        raise HTTPException(
            status_code=400, 
            detail="Username or email already exists"
        )
    
    # Create new user
    db_user = User(**user_data.model_dump())
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    
    return db_user

@router.get("/", response_model=PaginatedResponse)
async def get_users(
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(10, ge=1, le=100, description="Items per page"),
    role: Optional[str] = Query(None, description="Filter by role"),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    search: Optional[str] = Query(None, description="Search in username, email, first_name, last_name"),
    order_by: str = Query("created_at", description="Field to order by"),
    order_desc: bool = Query(False, description="Order in descending order"),
    db: AsyncSession = Depends(get_db)
):
    """Get paginated list of users with filtering, searching, and ordering"""
    
    # Build base query
    query = select(User)
    
    # Apply filters
    if role:
        query = query.where(User.role == role)
    if is_active is not None:
        query = query.where(User.is_active == is_active)
    
    # Apply search
    if search:
        search_filter = or_(
            User.username.ilike(f"%{search}%"),
            User.email.ilike(f"%{search}%"),
            User.first_name.ilike(f"%{search}%"),
            User.last_name.ilike(f"%{search}%")
        )
        query = query.where(search_filter)
    
    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Apply ordering
    if hasattr(User, order_by):
        order_column = getattr(User, order_by)
        if order_desc:
            query = query.order_by(desc(order_column))
        else:
            query = query.order_by(asc(order_column))
    
    # Apply pagination
    offset = (page - 1) * size
    query = query.offset(offset).limit(size)
    
    # Execute query
    result = await db.execute(query)
    users = result.scalars().all()
    
    # Calculate pagination info
    pages = math.ceil(total / size)
    
    return PaginatedResponse(
        items=[UserResponse.model_validate(user) for user in users],
        total=total,
        page=page,
        size=size,
        pages=pages
    )

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific user by ID"""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_data: UserUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update a specific user"""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check for unique constraints if updating username or email
    update_data = user_data.model_dump(exclude_unset=True)
    if 'username' in update_data or 'email' in update_data:
        existing_user = await db.execute(
            select(User).where(
                User.id != user_id,
                or_(
                    User.username == update_data.get('username', user.username),
                    User.email == update_data.get('email', user.email)
                )
            )
        )
        if existing_user.scalar_one_or_none():
            raise HTTPException(
                status_code=400, 
                detail="Username or email already exists"
            )
    
    # Update user fields
    for field, value in update_data.items():
        setattr(user, field, value)
    
    await db.commit()
    await db.refresh(user)
    
    return user

@router.delete("/{user_id}", status_code=204)
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Delete a specific user"""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    await db.delete(user)
    await db.commit()
    
    return None
