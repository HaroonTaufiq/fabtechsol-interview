import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import text
from dotenv import load_dotenv
from urllib.parse import urlparse, parse_qs

# Load environment variables
load_dotenv()

# Database configuration for Neon PostgreSQL
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError(
        "DATABASE_URL environment variable is required. "
        "Please add your Neon PostgreSQL connection string to your .env file."
    )

def prepare_database_url(url: str) -> str:
    """
    Prepare database URL for asyncpg by handling SSL and other parameters properly
    """
    # Parse the URL
    parsed = urlparse(url)
    
    # Convert postgres:// to postgresql+asyncpg://
    if parsed.scheme == "postgres":
        scheme = "postgresql+asyncpg"
    elif parsed.scheme == "postgresql":
        scheme = "postgresql+asyncpg"
    else:
        scheme = parsed.scheme
    
    # Build the base URL without query parameters
    base_url = f"{scheme}://{parsed.netloc}{parsed.path}"
    
    # Parse query parameters
    query_params = parse_qs(parsed.query) if parsed.query else {}
    
    # Remove sslmode from query params as asyncpg handles SSL differently
    if 'sslmode' in query_params:
        del query_params['sslmode']
    
    # Rebuild query string if there are remaining parameters
    if query_params:
        query_string = "&".join([f"{k}={v[0]}" for k, v in query_params.items()])
        return f"{base_url}?{query_string}"
    
    return base_url

# Prepare the database URL
prepared_url = prepare_database_url(DATABASE_URL)
print(f"Connecting to database: {prepared_url.split('@')[0]}@***")

# Create async engine with Neon-optimized settings
engine = create_async_engine(
    prepared_url,
    echo=True,
    pool_size=10,
    max_overflow=0,
    pool_pre_ping=True,
    pool_recycle=300,
    connect_args={
        "ssl": "require",  # This is how asyncpg handles SSL
        "server_settings": {
            "application_name": "employee_management_api",
        }
    }
)

# Create async session factory
AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

# Base class for models
Base = declarative_base()

async def init_db():
    """Initialize database tables"""
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("✅ Database tables created successfully!")
    except Exception as e:
        print(f"❌ Error creating database tables: {e}")
        raise

async def get_db():
    """Dependency to get database session"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

async def test_connection():
    """Test database connection"""
    try:
        async with engine.begin() as conn:
            # Use text() to wrap raw SQL strings in SQLAlchemy 2.0
            result = await conn.execute(text("SELECT 1"))
            print("✅ Database connection successful!")
            return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False
