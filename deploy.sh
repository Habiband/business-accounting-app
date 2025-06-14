#!/bin/bash

echo "========================================"
echo "  BUSINESS ACCOUNTING APP DEPLOYMENT"
echo "========================================"
echo

echo "[1/4] Checking if git is initialized..."
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
    git add .
    git commit -m "Initial deployment commit"
else
    echo "Git repository already exists."
    echo "Adding latest changes..."
    git add .
    git commit -m "Deployment update - $(date)"
fi

echo
echo "[2/4] Building the application..."
npm run build
if [ $? -ne 0 ]; then
    echo "ERROR: Build failed! Please check for errors."
    exit 1
fi

echo
echo "[3/4] Deployment options:"
echo
echo "1. Deploy to Vercel (Recommended - Free)"
echo "2. Build for static hosting (cPanel/Shared hosting)"
echo "3. Show deployment instructions"
echo
read -p "Choose option (1-3): " choice

case $choice in
    1)
        echo
        echo "Installing Vercel CLI..."
        npm install -g vercel
        echo
        echo "Starting Vercel deployment..."
        echo "Follow the prompts to deploy your app!"
        vercel
        ;;
    2)
        echo
        echo "Building static version for traditional hosting..."
        echo "Updating configuration for static export..."
        
        cat > next.config.ts << EOF
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true }
};

export default nextConfig;
EOF
        
        npm run build
        echo
        echo "✅ Static files ready in 'out' folder!"
        echo "Upload the contents of 'out' folder to your hosting provider's public_html directory."
        echo
        ;;
    3)
        echo
        echo "📖 Opening deployment instructions..."
        if command -v xdg-open > /dev/null; then
            xdg-open DEPLOYMENT_INSTRUCTIONS.md
        elif command -v open > /dev/null; then
            open DEPLOYMENT_INSTRUCTIONS.md
        else
            echo "Please open DEPLOYMENT_INSTRUCTIONS.md manually"
        fi
        ;;
    *)
        echo "Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo
echo "[4/4] Deployment process completed!"
echo
echo "🎉 Your Business Accounting App is ready to go live!"
echo
echo "Next steps:"
echo "- If using Vercel: Your app is now live at the provided URL"
echo "- If using static hosting: Upload the 'out' folder contents"
echo "- Update default login credentials for security"
echo "- Configure custom domain (optional)"
echo
echo "📱 Test your app on different devices to ensure it works perfectly!"
echo
