#!/bin/bash

# E-Commerce Application Setup Script
# This script sets up the complete e-commerce application

set -e

echo "🚀 Setting up E-Commerce Application..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js $(node -v) is installed"
}

# Check if PostgreSQL is available
check_postgres() {
    if command -v psql &> /dev/null; then
        print_success "PostgreSQL is installed"
    elif command -v docker &> /dev/null; then
        print_warning "PostgreSQL not found locally, but Docker is available"
        echo "You can use Docker to run PostgreSQL:"
        echo "docker run --name ecommerce-postgres -e POSTGRES_DB=ecommerce_db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15"
    else
        print_error "PostgreSQL is not installed and Docker is not available"
        print_error "Please install PostgreSQL or Docker and try again"
        exit 1
    fi
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    npm install
    
    # Copy environment file if it doesn't exist
    if [ ! -f .env ]; then
        print_status "Creating backend environment file..."
        cp .env.example .env
        print_warning "Please edit backend/.env with your database credentials and API keys"
    fi
    
    # Generate Prisma client
    print_status "Generating Prisma client..."
    npm run db:generate
    
    print_success "Backend setup completed"
    cd ..
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd frontend
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install
    
    # Copy environment file if it doesn't exist
    if [ ! -f .env.local ]; then
        print_status "Creating frontend environment file..."
        cp .env.example .env.local
        print_warning "Please edit frontend/.env.local with your configuration"
    fi
    
    print_success "Frontend setup completed"
    cd ..
}

# Database setup
setup_database() {
    print_status "Setting up database..."
    
    cd backend
    
    # Check if DATABASE_URL is set
    if grep -q "DATABASE_URL=" .env; then
        print_status "Running database migrations..."
        npm run db:migrate
        
        print_status "Seeding database with sample data..."
        npm run db:seed
        
        print_success "Database setup completed"
    else
        print_warning "DATABASE_URL not found in .env file"
        print_warning "Please set up your database connection and run:"
        print_warning "cd backend && npm run db:migrate && npm run db:seed"
    fi
    
    cd ..
}

# Main setup function
main() {
    echo "============================================"
    echo "🛍️  E-Commerce Application Setup"
    echo "============================================"
    echo ""
    
    # Check prerequisites
    print_status "Checking prerequisites..."
    check_node
    check_postgres
    echo ""
    
    # Setup backend
    setup_backend
    echo ""
    
    # Setup frontend
    setup_frontend
    echo ""
    
    # Setup database
    setup_database
    echo ""
    
    # Final instructions
    echo "============================================"
    print_success "Setup completed successfully! 🎉"
    echo "============================================"
    echo ""
    echo "📝 Next steps:"
    echo ""
    echo "1. Configure your environment variables:"
    echo "   - Edit backend/.env with your database and API credentials"
    echo "   - Edit frontend/.env.local with your configuration"
    echo ""
    echo "2. Start the development servers:"
    echo ""
    echo "   Backend (Terminal 1):"
    echo "   cd backend && npm run dev"
    echo ""
    echo "   Frontend (Terminal 2):"
    echo "   cd frontend && npm run dev"
    echo ""
    echo "3. Open your browser:"
    echo "   - Frontend: http://localhost:3000"
    echo "   - Backend API: http://localhost:5000"
    echo ""
    echo "🔐 Default accounts (after seeding):"
    echo "   Admin: admin@ecommerce.com / Admin123!"
    echo "   Customer: customer@example.com / Customer123!"
    echo ""
    echo "📚 For more information, check the README.md file"
    echo ""
}

# Run main function
main
