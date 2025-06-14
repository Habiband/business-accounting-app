@echo off
setlocal enabledelayedexpansion

REM Development startup script for Windows
REM This script starts both backend and frontend in development mode

echo.
echo 🚀 Starting E-Commerce Development Environment...
echo.

REM Check if both directories exist
if not exist "backend" (
    echo Error: backend directory not found
    echo Please run this script from the project root directory
    pause
    exit /b 1
)

if not exist "frontend" (
    echo Error: frontend directory not found
    echo Please run this script from the project root directory
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "backend\node_modules" (
    echo [INFO] Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

if not exist "frontend\node_modules" (
    echo [INFO] Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

REM Check if .env files exist
if not exist "backend\.env" (
    echo [INFO] Creating backend .env file...
    cd backend
    copy .env.example .env
    cd ..
    echo ⚠️  Please configure backend\.env with your database credentials
)

if not exist "frontend\.env.local" (
    echo [INFO] Creating frontend .env.local file...
    cd frontend
    copy .env.example .env.local
    cd ..
    echo ⚠️  Please configure frontend\.env.local with your settings
)

echo [SUCCESS] Starting development servers...
echo.

REM Start backend
echo [INFO] Starting backend server on http://localhost:5000...
start "Backend Server" cmd /k "cd backend && npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo [INFO] Starting frontend server on http://localhost:3000...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo [SUCCESS] Development environment is running!
echo.
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:5000
echo 📊 API Docs: http://localhost:5000/api-docs (if available)
echo.
echo 🔐 Default accounts (after seeding):
echo    Admin: admin@ecommerce.com / Admin123!
echo    Customer: customer@example.com / Customer123!
echo.
echo Both servers are running in separate windows.
echo Close the terminal windows to stop the servers.
echo.

pause
