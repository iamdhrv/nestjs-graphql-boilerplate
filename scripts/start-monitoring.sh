#!/bin/bash

# NestJS GraphQL Boilerplate - Monitoring Stack Startup Script
# This script starts the monitoring stack with Prometheus, Grafana, and Loki

set -e

echo "📊 Starting NestJS GraphQL Boilerplate Monitoring Stack"
echo "======================================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Start the monitoring stack
echo "🐳 Starting monitoring services..."
docker-compose -f docker-compose.monitoring.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 15

# Check service health
echo "🔍 Checking service health..."
docker-compose -f docker-compose.monitoring.yml ps

echo ""
echo "✅ Monitoring stack is ready!"
echo ""
echo "📊 Available Monitoring Services:"
echo "  - Prometheus: http://localhost:9090"
echo "  - Grafana: http://localhost:3001 (admin / admin)"
echo "  - Loki: http://localhost:3100"
echo "  - Node Exporter: http://localhost:9100"
echo "  - cAdvisor: http://localhost:8080"
echo ""
echo "📈 Pre-configured Dashboards:"
echo "  - NestJS Application Dashboard (imported automatically)"
echo ""
echo "📝 Useful Commands:"
echo "  - View logs: docker-compose -f docker-compose.monitoring.yml logs -f"
echo "  - Stop monitoring: docker-compose -f docker-compose.monitoring.yml down"
echo "  - Restart service: docker-compose -f docker-compose.monitoring.yml restart <service>"
echo ""
echo "🎯 Happy monitoring!"