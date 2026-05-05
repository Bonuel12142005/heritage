@echo off
echo ========================================
echo  PUSH TO GITHUB (After Git Installation)
echo ========================================
echo.

echo Testing if Git is installed...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is still not installed!
    echo Please install Git first using INSTALL-GIT-AND-PUSH.bat
    pause
    exit /b 1
)

echo Git is installed! ✅
git --version
echo.

echo Step 1: Configure Git (if not done before)
echo ===========================================
echo Please enter your details:
set /p USERNAME="Enter your name: "
set /p EMAIL="Enter your email: "

git config --global user.name "%USERNAME%"
git config --global user.email "%EMAIL%"
echo Git configured! ✅
echo.

echo Step 2: Initialize Git repository
echo ==================================
git init
echo Repository initialized! ✅
echo.

echo Step 3: Add files to Git
echo =========================
git add server.js package.json
echo Files added! ✅
echo.

echo Step 4: Commit changes
echo ======================
git commit -m "Add HeritageLink backend API"
echo Changes committed! ✅
echo.

echo Step 5: Set main branch
echo =======================
git branch -M main
echo Main branch set! ✅
echo.

echo Step 6: Add remote repository
echo ==============================
git remote add origin https://github.com/Bonuel12142005/heritage.git
echo Remote added! ✅
echo.

echo Step 7: Push to GitHub
echo ======================
echo You will be prompted for GitHub credentials...
git push -u origin main
echo.

if %errorlevel% equ 0 (
    echo ========================================
    echo  SUCCESS! PUSHED TO GITHUB! 🚀
    echo ========================================
    echo.
    echo Your backend is now on GitHub!
    echo Go to Render and deploy: https://heritage3.onrender.com
    echo.
) else (
    echo ========================================
    echo  PUSH FAILED - POSSIBLE SOLUTIONS
    echo ========================================
    echo.
    echo 1. Check your GitHub credentials
    echo 2. Make sure repository exists: https://github.com/Bonuel12142005/heritage
    echo 3. Try GitHub Personal Access Token instead of password
    echo.
)

echo Press any key to continue...
pause