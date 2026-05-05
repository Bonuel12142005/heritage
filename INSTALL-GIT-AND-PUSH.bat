@echo off
echo ========================================
echo  INSTALL GIT AND PUSH TO GITHUB
echo ========================================
echo.

echo Step 1: Install Git for Windows
echo ================================
echo Git is not installed on your system.
echo We need to install it first.
echo.
echo Option A: Download Git manually
echo 1. Go to: https://git-scm.com/download/win
echo 2. Download "64-bit Git for Windows Setup"
echo 3. Run the installer (use default settings)
echo 4. Restart this script after installation
echo.

echo Option B: Install using Chocolatey (if you have it)
echo choco install git
echo.

echo Option C: Install using winget (Windows 10/11)
echo winget install --id Git.Git -e --source winget
echo.

echo ========================================
echo  AFTER GIT IS INSTALLED
echo ========================================
echo.

echo Step 2: Configure Git (first time only)
echo ========================================
echo git config --global user.name "Your Name"
echo git config --global user.email "your.email@example.com"
echo.

echo Step 3: Initialize and Push
echo ============================
echo git init
echo git add server.js package.json
echo git commit -m "Add HeritageLink backend API"
echo git branch -M main
echo git remote add origin https://github.com/Bonuel12142005/heritage.git
echo git push -u origin main
echo.

echo ========================================
echo  INSTALL GIT FIRST!
echo ========================================
echo.

echo Press any key to open Git download page...
pause
start https://git-scm.com/download/win