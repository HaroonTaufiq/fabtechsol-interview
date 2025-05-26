from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv

from database import init_db, test_connection
from routers import users, employees

# Load environment variables
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Test database connection on startup
    print("🚀 Starting Employee Management API...")
    
    connection_ok = await test_connection()
    if not connection_ok:
        raise HTTPException(
            status_code=500, 
            detail="Failed to connect to database. Please check your DATABASE_URL."
        )
    
    # Initialize database tables
    await init_db()
    print("✅ Application startup complete!")
    
    yield
    
    print("🛑 Application shutdown")

app = FastAPI(
    title=os.getenv("API_TITLE", "Employee Management System"),
    description="A comprehensive API for managing users and employees with Neon PostgreSQL",
    version=os.getenv("API_VERSION", "1.0.0"),
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(employees.router, prefix="/api/v1/employees", tags=["Employees"])

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Employee Management System API",
        "database": "Neon PostgreSQL",
        "docs": "/docs",
        "redoc": "/redoc",
        "status": "running"
    }

@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    try:
        connection_ok = await test_connection()
        return {
            "status": "healthy" if connection_ok else "unhealthy",
            "database": "connected" if connection_ok else "disconnected",
            "environment": os.getenv("ENVIRONMENT", "development")
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "error",
            "error": str(e)
        }

if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    
    uvicorn.run(
        "main:app", 
        host=host, 
        port=port, 
        reload=True,
        log_level="info"
    )
