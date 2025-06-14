@echo off
echo ========================================
echo   BUSINESS ACCOUNTING APP DEPLOYMENT
echo ========================================
echo.

echo [1/4] Checking if git is initialized...
if not exist .git (
    echo Initializing git repository...
    git init
    git add .
    git commit -m "Initial deployment commit"
) else (
    echo Git repository already exists.
    echo Adding latest changes...
    git add .
    git commit -m "Deployment update - %date% %time%"
)

echo.
echo [2/4] Building the application...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed! Please check for errors.
    pause
    exit /b 1
)

echo.
echo [3/4] Deployment options:
echo.
echo 1. Deploy to Vercel (Recommended - Free)
echo 2. Build for static hosting (cPanel/Shared hosting)
echo 3. Show deployment instructions
echo.
set /p choice="Choose option (1-3): "

if "%choice%"=="1" (
    echo.
    echo Installing Vercel CLI...
    npm install -g vercel
    echo.
    echo Starting Vercel deployment...
    echo Follow the prompts to deploy your app!
    vercel
) else if "%choice%"=="2" (
    echo.
    echo Building static version for traditional hosting...
    echo Updating configuration for static export...
    
    echo import type { NextConfig } from "next"; > next.config.ts
    echo. >> next.config.ts
    echo const nextConfig: NextConfig = { >> next.config.ts
    echo   output: "export", >> next.config.ts
    echo   trailingSlash: true, >> next.config.ts
    echo   images: { unoptimized: true } >> next.config.ts
    echo }; >> next.config.ts
    echo. >> next.config.ts
    echo export default nextConfig; >> next.config.ts
    
    call npm run build
    echo.
    echo ✅ Static files ready in 'out' folder!
    echo Upload the contents of 'out' folder to your hosting provider's public_html directory.
    echo.
) else if "%choice%"=="3" (
    echo.
    echo 📖 Opening deployment instructions...
    start DEPLOYMENT_INSTRUCTIONS.md
) else (
    echo Invalid choice. Please run the script again.
)

echo.
echo [4/4] Deployment process completed!
echo.
echo 🎉 Your Business Accounting App is ready to go live!
echo.
echo Next steps:
echo - If using Vercel: Your app is now live at the provided URL
echo - If using static hosting: Upload the 'out' folder contents
echo - Update default login credentials for security
echo - Configure custom domain (optional)
echo.
echo 📱 Test your app on different devices to ensure it works perfectly!
echo.
pause
