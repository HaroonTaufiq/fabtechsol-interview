#!/bin/bash

# Docker run script for Employee Management API

set -e

echo "🐳 Employee Management API - Docker Setup"
echo "=========================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "📝 Please create a .env file with your Neon PostgreSQL credentials."
    echo "💡 You can copy from .env.example:"
    echo "   cp .env.example .env"
    echo "   # Then edit .env with your actual Neon credentials"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running!"
    echo "🐳 Please start Docker and try again."
    exit 1
fi

echo "✅ Docker is running"
echo "✅ .env file found"

# Parse command line arguments
COMMAND=${1:-"dev"}

case $COMMAND in
    "dev"|"development")
        echo "🚀 Starting development environment..."
        docker-compose up --build
        ;;
    "prod"|"production")
        echo "🚀 Starting production environment..."
        docker-compose -f docker-compose.prod.yml up --build -d
        echo "✅ Production environment started in background"
        echo "📊 API: http://localhost:8000"
        echo "📚 Docs: http://localhost:8000/docs"
        echo "🔍 Health: http://localhost:8000/health"
        ;;
    "stop")
        echo "🛑 Stopping all containers..."
        docker-compose down
        docker-compose -f docker-compose.prod.yml down
        ;;
    "logs")
        echo "📋 Showing logs..."
        docker-compose logs -f
        ;;
    "test")
        echo "🧪 Running connection test in container..."
        docker-compose run --rm api python test_neon_connection.py
        ;;
    "sample-data")
        echo "📊 Creating sample data..."
        echo "⏳ Waiting for API to be ready..."
        sleep 5
        docker-compose exec api python create_sample_data.py
        ;;
    "shell")
        echo "🐚 Opening shell in container..."
        docker-compose exec api bash
        ;;
    "build")
        echo "🔨 Building Docker image..."
        docker-compose build
        ;;
    "clean")
        echo "🧹 Cleaning up Docker resources..."
        docker-compose down -v
        docker system prune -f
        ;;
    *)
        echo "❓ Unknown command: $COMMAND"
        echo ""
        echo "📖 Available commands:"
        echo "  dev          - Start development environment (default)"
        echo "  prod         - Start production environment"
        echo "  stop         - Stop all containers"
        echo "  logs         - Show container logs"
        echo "  test         - Test database connection"
        echo "  sample-data  - Create sample data"
        echo "  shell        - Open shell in container"
        echo "  build        - Build Docker image"
        echo "  clean        - Clean up Docker resources"
        echo ""
        echo "📝 Examples:"
        echo "  ./docker-run.sh dev"
        echo "  ./docker-run.sh prod"
        echo "  ./docker-run.sh test"
        exit 1
        ;;
esac
