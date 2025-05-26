# Employee Management System API

A comprehensive FastAPI-based REST API for managing users and employees with full CRUD operations, advanced filtering, searching, and pagination capabilities.

## 🚀 Features

### Core Functionality
- **Full CRUD Operations** for Users and Employees
- **Advanced Pagination** with configurable page sizes
- **Multi-field Filtering** by role, status, department, position
- **Full-text Search** across relevant fields
- **Flexible Ordering** (ascending/descending by any field)
- **Relationship Management** (User-Employee linking, Manager hierarchy)

### Technical Features
- **FastORM Integration** - No raw SQL queries
- **Async/Await Support** - High-performance async operations
- **Auto-generated API Documentation** - Swagger UI and ReDoc
- **Data Validation** - Pydantic schemas with comprehensive validation
- **Error Handling** - Proper HTTP status codes and detailed error messages
- **CORS Support** - Cross-origin resource sharing enabled

## 📋 Requirements

- **Python**: 3.8+ (Recommended: 3.11+)
- **Database**: SQLite (default) or PostgreSQL
- **Dependencies**: Listed in \`requirements.txt\`

## 🛠️ Installation & Setup

### Option 1: Local Development

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd employee-management-api
   \`\`\`

2. **Create virtual environment**
   \`\`\`bash
   python -m venv venv
   
   # On Windows
   venv\\Scripts\\activate
   
   # On macOS/Linux
   source venv/bin/activate
   \`\`\`

3. **Install dependencies**
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

4. **Run the application**
   \`\`\`bash
   python run.py
   \`\`\`

5. **Access the API**
   - API Base URL: \`http://localhost:8000\`
   - Swagger Documentation: \`http://localhost:8000/docs\`
   - ReDoc Documentation: \`http://localhost:8000/redoc\`

### Option 2: Docker (Recommended)

1. **Build and run with Docker Compose**
   \`\`\`bash
   docker-compose up --build
   \`\`\`

2. **Access the API**
   - API Base URL: \`http://localhost:8000\`
   - Swagger Documentation: \`http://localhost:8000/docs\`

## 🐳 Docker Configuration

The project includes Docker support for easy deployment and development:

- **Dockerfile**: Multi-stage build for optimized production image
- **docker-compose.yml**: Complete development environment
- **docker-compose.prod.yml**: Production-ready configuration with PostgreSQL

### Docker Commands

\`\`\`bash
# Development
docker-compose up --build

# Production
docker-compose -f docker-compose.prod.yml up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
\`\`\`

## 📊 Database Models

### User Model
\`\`\`python
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "employee",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
\`\`\`

### Employee Model
\`\`\`python
{
  "id": 1,
  "employee_id": "EMP001",
  "user_id": 1,
  "department": "Engineering",
  "position": "Software Developer",
  "salary": 7500000,  # Salary in cents
  "hire_date": "2024-01-01T00:00:00Z",
  "status": "active",
  "manager_id": null,
  "phone": "+1234567890",
  "address": "123 Main St, City, State",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z",
  "user": { /* User object */ }
}
\`\`\`

## 🔗 API Endpoints

### Users API (\`/api/v1/users\`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | \`/\` | Create a new user |
| GET | \`/\` | List users with pagination, filtering, and search |
| GET | \`/{user_id}\` | Get specific user by ID |
| PUT | \`/{user_id}\` | Update user |
| DELETE | \`/{user_id}\` | Delete user |

### Employees API (\`/api/v1/employees\`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | \`/\` | Create a new employee |
| GET | \`/\` | List employees with pagination, filtering, and search |
| GET | \`/{employee_id}\` | Get specific employee by ID |
| PUT | \`/{employee_id}\` | Update employee |
| DELETE | \`/{employee_id}\` | Delete employee |
| GET | \`/{employee_id}/subordinates\` | Get employee's subordinates |

## 🔍 Query Parameters

### Pagination
- \`page\`: Page number (default: 1, min: 1)
- \`size\`: Items per page (default: 10, min: 1, max: 100)

### Users Filtering & Search
- \`role\`: Filter by user role (\`admin\`, \`manager\`, \`employee\`, \`user\`)
- \`is_active\`: Filter by active status (\`true\`/\`false\`)
- \`search\`: Search in username, email, first_name, last_name
- \`order_by\`: Field to order by (default: \`created_at\`)
- \`order_desc\`: Order in descending order (\`true\`/\`false\`)

### Employees Filtering & Search
- \`department\`: Filter by department (partial match)
- \`position\`: Filter by position (partial match)
- \`status\`: Filter by status (\`active\`, \`inactive\`, \`terminated\`, \`on_leave\`)
- \`manager_id\`: Filter by manager ID
- \`search\`: Search in employee_id, department, position
- \`order_by\`: Field to order by (default: \`created_at\`)
- \`order_desc\`: Order in descending order (\`true\`/\`false\`)

## 📝 Example API Usage

### Create a User
\`\`\`bash
curl -X POST "http://localhost:8000/api/v1/users/" \\
  -H "Content-Type: application/json" \\
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "employee"
  }'
\`\`\`

### Create an Employee
\`\`\`bash
curl -X POST "http://localhost:8000/api/v1/employees/" \\
  -H "Content-Type: application/json" \\
  -d '{
    "employee_id": "EMP001",
    "user_id": 1,
    "department": "Engineering",
    "position": "Software Developer",
    "salary": 7500000,
    "hire_date": "2024-01-01T00:00:00Z",
    "status": "active"
  }'
\`\`\`

### List Users with Filtering
\`\`\`bash
curl "http://localhost:8000/api/v1/users/?page=1&size=10&role=employee&search=john&order_by=created_at&order_desc=true"
\`\`\`

### List Employees with Filtering
\`\`\`bash
curl "http://localhost:8000/api/v1/employees/?page=1&size=10&department=Engineering&status=active&order_by=hire_date"
\`\`\`

## 🏗️ Project Structure

\`\`\`
employee-management-api/
├── main.py                 # FastAPI application entry point
├── database.py             # Database configuration and FastORM setup
├── models.py               # SQLAlchemy models (User, Employee)
├── schemas.py              # Pydantic schemas for validation
├── routers/
│   ├── __init__.py
│   ├── users.py           # User CRUD endpoints
│   └── employees.py       # Employee CRUD endpoints
├── requirements.txt        # Python dependencies
├── run.py                 # Development server runner
├── Dockerfile             # Docker image configuration
├── docker-compose.yml     # Development Docker setup
├── docker-compose.prod.yml # Production Docker setup
└── README.md              # This file
\`\`\`

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| \`DATABASE_URL\` | Database connection string | \`sqlite+aiosqlite:///./employee_management.db\` |
| \`HOST\` | Server host | \`0.0.0.0\` |
| \`PORT\` | Server port | \`8000\` |

### Database Configuration

**SQLite (Default)**
\`\`\`bash
DATABASE_URL=sqlite+aiosqlite:///./employee_management.db
\`\`\`

**PostgreSQL**
\`\`\`bash
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/dbname
\`\`\`

## 🧪 Testing

### Manual Testing with Swagger UI
1. Navigate to \`http://localhost:8000/docs\`
2. Use the interactive API documentation to test endpoints
3. All endpoints include example requests and responses

### API Testing with curl
See the example API usage section above for curl commands.

## 🚀 Deployment

### Production Deployment with Docker

1. **Use the production Docker Compose**
   \`\`\`bash
   docker-compose -f docker-compose.prod.yml up --build -d
   \`\`\`

2. **Environment Variables for Production**
   Create a \`.env\` file:
   \`\`\`bash
   DATABASE_URL=postgresql+asyncpg://user:password@db:5432/employee_management
   POSTGRES_USER=your_user
   POSTGRES_PASSWORD=your_password
   POSTGRES_DB=employee_management
   \`\`\`

### Cloud Deployment

The application can be deployed to various cloud platforms:
- **Heroku**: Use the included \`Dockerfile\`
- **AWS ECS/Fargate**: Use the production Docker setup
- **Google Cloud Run**: Deploy the Docker container
- **DigitalOcean App Platform**: Use the Dockerfile

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at \`/docs\`
- Review the example usage in this README

## 🔄 Changelog

### v1.0.0
- Initial release
- Full CRUD operations for Users and Employees
- Advanced filtering, searching, and pagination
- Docker support
- Comprehensive API documentation
\`\`\`

```dockerfile file="Dockerfile"
# Use Python 3.11 slim image as base
FROM python:3.11-slim as base

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user
RUN adduser --disabled-password --gecos '' --shell /bin/bash appuser \
    && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run the application
CMD ["python", "run.py"]
