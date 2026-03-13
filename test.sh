#!/bin/bash

echo "🧪 Testing Custom Dialer System..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test HTTP endpoints
test_endpoint() {
    local url=$1
    local name=$2
    local expected_status=$3
    
    echo -n "Testing $name... "
    
    if command -v curl &> /dev/null; then
        response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
        if [ "$response" = "$expected_status" ]; then
            echo -e "${GREEN}✅ OK${NC}"
            return 0
        else
            echo -e "${RED}❌ Failed (HTTP $response)${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠️  curl not available${NC}"
        return 0
    fi
}

# Function to test port availability
test_port() {
    local port=$1
    local name=$2
    
    echo -n "Testing $name (port $port)... "
    
    if command -v nc &> /dev/null; then
        if nc -z localhost "$port" 2>/dev/null; then
            echo -e "${GREEN}✅ OK${NC}"
            return 0
        else
            echo -e "${RED}❌ Failed${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠️  netcat not available${NC}"
        return 0
    fi
}

# Check if services are running
echo "🔍 Checking Docker services..."
if docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}✅ Docker services are running${NC}"
else
    echo -e "${RED}❌ Docker services are not running${NC}"
    echo "Please run: ./start.sh"
    exit 1
fi

echo ""
echo "🌐 Testing HTTP endpoints..."

# Test frontend
test_endpoint "http://localhost:3000" "Frontend" "200"

# Test backend
test_endpoint "http://localhost:3001" "Backend API" "200"
test_endpoint "http://localhost:3001/health" "Backend Health" "200"

echo ""
echo "🔌 Testing network ports..."

# Test ports
test_port 3000 "Frontend"
test_port 3001 "Backend"
test_port 5060 "Asterisk SIP"
test_port 8088 "Asterisk HTTP API"

echo ""
echo "🐳 Checking container status..."

# Show container status
docker-compose ps

echo ""
echo "📊 System Summary:"
echo "=================="

# Count running containers
running_containers=$(docker-compose ps --filter "status=running" -q | wc -l)
total_containers=$(docker-compose ps -q | wc -l)

echo "Containers: $running_containers/$total_containers running"

if [ "$running_containers" -eq "$total_containers" ]; then
    echo -e "${GREEN}🎉 All services are running successfully!${NC}"
    echo ""
    echo "📱 Access your dialer at: http://localhost:3000"
    echo "🔧 API available at: http://localhost:3001"
    echo ""
    echo "🧪 Test extensions:"
    echo "  • 999 - Echo test"
    echo "  • 888 - Music on hold"
    echo "  • 1001, 1002, 1003 - Basic extensions"
else
    echo -e "${RED}❌ Some services are not running properly${NC}"
    echo ""
    echo "🔍 Check logs with: docker-compose logs -f"
    echo "🔄 Restart with: docker-compose restart"
fi

echo ""
echo "📋 Additional commands:"
echo "  • View logs: docker-compose logs -f"
echo "  • Stop all: docker-compose down"
echo "  • Restart: docker-compose restart"
echo "  • Rebuild: docker-compose up -d --build"
