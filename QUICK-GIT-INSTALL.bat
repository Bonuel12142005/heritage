@echo off
echo ========================================
echo  QUICK GIT INSTALLATION
echo ========================================
echo.

echo Trying to install Git using Windows Package Manager...
echo.

echo Method 1: Using winget (Windows 10/11)
echo =======================================
winget install --id Git.Git -e --source winget
if %errorlevel% equ 0 (
    echo Git installed successfully! ✅
    echo Please restart your terminal and run PUSH-AFTER-GIT-INSTALL.bat
    pause
    exit /b 0
)

echo.
echo Method 2: Using Chocolatey (if available)
echo =========================================
choco install git -y
if %errorlevel% equ 0 (
    echo Git installed successfully! ✅
    echo Please restart your terminal and run PUSH-AFTER-GIT-INSTALL.bat
    pause
    exit /b 0
)

echo.
echo Method 3: Manual Download Required
echo ==================================
echo Automatic installation failed.
echo Please download Git manually:
echo.
echo 1. Go to: https://git-scm.com/download/win
echo 2. Download "64-bit Git for Windows Setup"
echo 3. Run the installer (use default settings)
echo 4. Restart your terminal
echo 5. Run PUSH-AFTER-GIT-INSTALL.bat
echo.

echo Press any key to open download page...
pause
start https://git-scm.com/download/win