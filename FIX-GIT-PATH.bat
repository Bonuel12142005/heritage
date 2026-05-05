@echo off
echo ========================================
echo  FIXING GIT PATH ISSUE
echo ========================================
echo.

echo The issue: Git is installed but not in PATH for current session
echo.

echo Solution 1: Refresh Environment Variables
echo ==========================================
echo Refreshing PATH environment variable...

:: Add common Git installation paths to current session
set "PATH=%PATH%;C:\Program Files\Git\bin"
set "PATH=%PATH%;C:\Program Files\Git\cmd"
set "PATH=%PATH%;C:\Program Files (x86)\Git\bin"
set "PATH=%PATH%;C:\Program Files (x86)\Git\cmd"

echo Testing Git...
git --version 2>nul
if %errorlevel% equ 0 (
    echo Git is now working! ✅
    git --version
    echo.
    echo You can now use Git commands in this terminal session.
    echo To make it permanent, restart your terminal.
    goto :push_setup
) else (
    echo Git still not found in PATH.
    goto :manual_fix
)

:push_setup
echo ========================================
echo  READY TO PUSH TO GITHUB
echo ========================================
echo.

echo Step 1: Configure Git (first time setup)
echo =========================================
set /p USERNAME="Enter your GitHub username: "
set /p EMAIL="Enter your email: "

git config --global user.name "%USERNAME%"
git config --global user.email "%EMAIL%"
echo Git configured! ✅
echo.

echo Step 2: Initialize repository and push
echo ======================================
echo Initializing Git repository...
git init
echo.

echo Adding files...
git add server.js package.json
echo.

echo Committing changes...
git commit -m "Add HeritageLink backend API"
echo.

echo Setting main branch...
git branch -M main
echo.

echo Adding remote repository...
git remote add origin https://github.com/Bonuel12142005/heritage.git
echo.

echo Pushing to GitHub...
echo (You will be prompted for GitHub credentials)
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo  SUCCESS! PUSHED TO GITHUB! 🚀
    echo ========================================
    echo.
    echo Now go to Render and deploy:
    echo https://heritage3.onrender.com
    echo Click "Manual Deploy" or "Retry Deploy"
    echo.
) else (
    echo.
    echo Push failed. Check your GitHub credentials.
    echo Make sure you use Personal Access Token as password.
)

goto :end

:manual_fix
echo ========================================
echo  MANUAL FIX REQUIRED
echo ========================================
echo.

echo Git installation path not found automatically.
echo.

echo Option 1: Restart Terminal (Recommended)
echo ========================================
echo 1. Close this terminal completely
echo 2. Open a new PowerShell or Command Prompt
echo 3. Navigate back to your project folder
echo 4. Run: git --version (should work now)
echo 5. Run: PUSH-AFTER-GIT-INSTALL.bat
echo.

echo Option 2: Find Git Installation
echo ===============================
echo Check if Git is installed in one of these locations:
echo - C:\Program Files\Git\bin\git.exe
echo - C:\Program Files (x86)\Git\bin\git.exe
echo - %USERPROFILE%\AppData\Local\Programs\Git\bin\git.exe
echo.

echo If found, add that path to your system PATH variable.
echo.

echo Option 3: Reinstall Git
echo =======================
echo 1. Go to: https://git-scm.com/download/win
echo 2. Download and run installer again
echo 3. Make sure "Add Git to PATH" is checked
echo 4. Restart terminal after installation
echo.

:end
echo.
pause