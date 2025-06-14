#!/bin/bash

# Development startup script
# This script starts both backend and frontend in development mode

set -e

echo "🚀 Starting E-Commerce Development Environment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Check if both directories exist
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "Error: backend or frontend directory not found"
    echo "Please run this script from the project root directory"
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    print_info "Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    print_info "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    print_info "Creating backend .env file..."
    cd backend && cp .env.example .env && cd ..
    echo "⚠️  Please configure backend/.env with your database credentials"
fi

if [ ! -f "frontend/.env.local" ]; then
    print_info "Creating frontend .env.local file..."
    cd frontend && cp .env.example .env.local && cd ..
    echo "⚠️  Please configure frontend/.env.local with your settings"
fi

print_success "Starting development servers..."

# Function to handle cleanup
cleanup() {
    echo ""
    print_info "Shutting down development servers..."
    kill $(jobs -p) 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Start backend in background
print_info "Starting backend server on http://localhost:5000..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend in background
print_info "Starting frontend server on http://localhost:3000..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

print_success "Development environment is running!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000"
echo "📊 API Docs: http://localhost:5000/api-docs (if available)"
echo ""
echo "🔐 Default accounts (after seeding):"
echo "   Admin: admin@ecommerce.com / Admin123!"
echo "   Customer: customer@example.com / Customer123!"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for background processes
wait
