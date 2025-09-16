#!/bin/bash

# NestJS GraphQL Boilerplate - Development Startup Script
# This script starts the development environment with all necessary services

set -e

echo "🚀 Starting NestJS GraphQL Boilerplate Development Environment"
echo "============================================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please review and update the configuration if needed."
fi

# Build the application image
echo "🔨 Building application image..."
docker-compose -f docker-compose.dev.yml build

# Start the development environment
echo "🐳 Starting development services..."
docker-compose -f docker-compose.dev.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🔍 Checking service health..."
docker-compose -f docker-compose.dev.yml ps

echo ""
echo "✅ Development environment is ready!"
echo ""
echo "📊 Available Services:"
echo "  - Application: http://localhost:3000"
echo "  - GraphQL Playground: http://localhost:3000/graphql"
echo "  - Health Check: http://localhost:3000/health"
echo "  - Metrics: http://localhost:3000/metrics"
echo "  - pgAdmin: http://localhost:5050 (admin@admin.com / admin)"
echo "  - Redis Commander: http://localhost:8081"
echo ""
echo "📝 Useful Commands:"
echo "  - View logs: docker-compose -f docker-compose.dev.yml logs -f"
echo "  - Stop services: docker-compose -f docker-compose.dev.yml down"
echo "  - Restart app: docker-compose -f docker-compose.dev.yml restart app"
echo ""
echo "🎉 Happy coding!"