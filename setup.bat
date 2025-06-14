@echo off
setlocal enabledelayedexpansion

REM E-Commerce Application Setup Script for Windows
REM This script sets up the complete e-commerce application

echo.
echo ============================================
echo 🛍️  E-Commerce Application Setup
echo ============================================
echo.

REM Check if Node.js is installed
echo [INFO] Checking prerequisites...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ and try again.
    pause
    exit /b 1
)

for /f "tokens=1 delims=." %%a in ('node --version') do set NODE_MAJOR=%%a
set NODE_MAJOR=%NODE_MAJOR:v=%
if %NODE_MAJOR% LSS 18 (
    echo [ERROR] Node.js version 18+ is required. Current version: 
    node --version
    pause
    exit /b 1
)

echo [SUCCESS] Node.js is installed
node --version

REM Check if npm is available
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not available
    pause
    exit /b 1
)

echo [SUCCESS] npm is available
echo.

REM Setup Backend
echo [INFO] Setting up backend...
cd backend

echo [INFO] Installing backend dependencies...
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)

REM Copy environment file if it doesn't exist
if not exist .env (
    echo [INFO] Creating backend environment file...
    copy .env.example .env
    echo [WARNING] Please edit backend\.env with your database credentials and API keys
)

echo [INFO] Generating Prisma client...
call npm run db:generate
if errorlevel 1 (
    echo [ERROR] Failed to generate Prisma client
    pause
    exit /b 1
)

echo [SUCCESS] Backend setup completed
cd ..
echo.

REM Setup Frontend
echo [INFO] Setting up frontend...
cd frontend

echo [INFO] Installing frontend dependencies...
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)

REM Copy environment file if it doesn't exist
if not exist .env.local (
    echo [INFO] Creating frontend environment file...
    copy .env.example .env.local
    echo [WARNING] Please edit frontend\.env.local with your configuration
)

echo [SUCCESS] Frontend setup completed
cd ..
echo.

REM Database Setup
echo [INFO] Setting up database...
cd backend

REM Check if DATABASE_URL exists in .env
findstr /C:"DATABASE_URL=" .env >nul 2>&1
if not errorlevel 1 (
    echo [INFO] Running database migrations...
    call npm run db:migrate
    if errorlevel 1 (
        echo [WARNING] Database migration failed. Please check your database connection.
    ) else (
        echo [INFO] Seeding database with sample data...
        call npm run db:seed
        if errorlevel 1 (
            echo [WARNING] Database seeding failed.
        ) else (
            echo [SUCCESS] Database setup completed
        )
    )
) else (
    echo [WARNING] DATABASE_URL not found in .env file
    echo [WARNING] Please set up your database connection and run:
    echo [WARNING] cd backend ^&^& npm run db:migrate ^&^& npm run db:seed
)

cd ..
echo.

REM Final Instructions
echo ============================================
echo [SUCCESS] Setup completed successfully! 🎉
echo ============================================
echo.
echo 📝 Next steps:
echo.
echo 1. Configure your environment variables:
echo    - Edit backend\.env with your database and API credentials
echo    - Edit frontend\.env.local with your configuration
echo.
echo 2. Start the development servers:
echo.
echo    Backend (Terminal 1):
echo    cd backend ^&^& npm run dev
echo.
echo    Frontend (Terminal 2):
echo    cd frontend ^&^& npm run dev
echo.
echo 3. Open your browser:
echo    - Frontend: http://localhost:3000
echo    - Backend API: http://localhost:5000
echo.
echo 🔐 Default accounts (after seeding):
echo    Admin: admin@ecommerce.com / Admin123!
echo    Customer: customer@example.com / Customer123!
echo.
echo 📚 For more information, check the README.md file
echo.

pause
