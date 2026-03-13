#!/bin/bash

echo "🚀 Checking Docker Status..."
echo "==========================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "✅ Docker is running"
echo ""
echo "📋 To start Asterisk manually, use:"
echo "  docker run -d --name asterisk -p 5060:5060/udp -p 5060:5060/tcp -p 8088:8088 -p 10000-20000:10000-20000/udp andrius/asterisk:alpine-latest-20.5.2"
echo ""
echo "📋 To start your development servers:"
echo "  Backend: cd backend && npm start"
echo "  Frontend: cd frontend && npm start"
echo ""
echo "🎉 Ready to go!"
