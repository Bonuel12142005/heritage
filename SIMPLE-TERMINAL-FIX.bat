@echo off
echo ========================================
echo  SIMPLE TERMINAL FIX
echo ========================================
echo.

echo Problem: Git installed but terminal can't find it
echo Solution: Add Git to PATH for current session
echo.

echo Trying to locate Git installation...
echo.

:: Check common Git installation paths
if exist "C:\Program Files\Git\bin\git.exe" (
    echo Found Git at: C:\Program Files\Git\bin\
    set "PATH=%PATH%;C:\Program Files\Git\bin;C:\Program Files\Git\cmd"
    goto :test_git
)

if exist "C:\Program Files (x86)\Git\bin\git.exe" (
    echo Found Git at: C:\Program Files (x86)\Git\bin\
    set "PATH=%PATH%;C:\Program Files (x86)\Git\bin;C:\Program Files (x86)\Git\cmd"
    goto :test_git
)

if exist "%USERPROFILE%\AppData\Local\Programs\Git\bin\git.exe" (
    echo Found Git at: %USERPROFILE%\AppData\Local\Programs\Git\bin\
    set "PATH=%PATH%;%USERPROFILE%\AppData\Local\Programs\Git\bin;%USERPROFILE%\AppData\Local\Programs\Git\cmd"
    goto :test_git
)

echo Git installation not found in common locations.
echo Please restart your terminal or reinstall Git.
goto :end

:test_git
echo.
echo Testing Git...
git --version
if %errorlevel% equ 0 (
    echo.
    echo ✅ SUCCESS! Git is now working!
    echo.
    echo Now you can push to GitHub:
    echo.
    echo 1. Configure Git:
    echo    git config --global user.name "Your Name"
    echo    git config --global user.email "your.email@example.com"
    echo.
    echo 2. Push to GitHub:
    echo    git init
    echo    git add server.js package.json
    echo    git commit -m "Add HeritageLink backend API"
    echo    git branch -M main
    echo    git remote add origin https://github.com/Bonuel12142005/heritage.git
    echo    git push -u origin main
    echo.
    echo Or run: PUSH-AFTER-GIT-INSTALL.bat
    echo.
) else (
    echo ❌ Git still not working. Please restart your terminal.
)

:end
pause