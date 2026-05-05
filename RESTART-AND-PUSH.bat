@echo off
echo ========================================
echo  RESTART TERMINAL AND PUSH TO GITHUB
echo ========================================
echo.

echo Git has been installed, but you need to restart your terminal first.
echo.

echo After restarting your terminal, run these commands:
echo.

echo 1. Check Git installation:
echo    git --version
echo.

echo 2. Configure Git (first time only):
echo    git config --global user.name "Your Name"
echo    git config --global user.email "your.email@example.com"
echo.

echo 3. Initialize and push:
echo    git init
echo    git add server.js package.json
echo    git commit -m "Add HeritageLink backend API"
echo    git branch -M main
echo    git remote add origin https://github.com/Bonuel12142005/heritage.git
echo    git push -u origin main
echo.

echo ========================================
echo  OR USE THE AUTOMATED SCRIPT
echo ========================================
echo.

echo After restarting terminal, simply run:
echo    PUSH-AFTER-GIT-INSTALL.bat
echo.

echo This will do everything automatically!
echo.

pause