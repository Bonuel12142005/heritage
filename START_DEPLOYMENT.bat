@echo off
echo ========================================
echo   HeritageLink Deployment Helper
echo ========================================
echo.
echo This will help you deploy to Render!
echo.
echo Step 1: Initialize Git
echo ----------------------------------------
git init
echo.
echo Step 2: Add all files
echo ----------------------------------------
git add .
echo.
echo Step 3: Commit
echo ----------------------------------------
git commit -m "Ready for Render deployment"
echo.
echo ========================================
echo   Git Setup Complete!
echo ========================================
echo.
echo NEXT STEPS:
echo.
echo 1. Create a repository on GitHub
echo 2. Copy the repository URL
echo 3. Run these commands:
echo.
echo    git remote add origin YOUR_GITHUB_URL
echo    git push -u origin main
echo.
echo 4. Then follow QUICK_START_DEPLOYMENT.md
echo.
echo ========================================
pause
