@echo off
color 0A
echo.
echo  ██╗  ██╗███████╗██████╗ ██╗████████╗ █████╗  ██████╗ ███████╗██╗     ██╗███╗   ██╗██╗  ██╗
echo  ██║  ██║██╔════╝██╔══██╗██║╚══██╔══╝██╔══██╗██╔════╝ ██╔════╝██║     ██║████╗  ██║██║ ██╔╝
echo  ███████║█████╗  ██████╔╝██║   ██║   ███████║██║  ███╗█████╗  ██║     ██║██╔██╗ ██║█████╔╝ 
echo  ██╔══██║██╔══╝  ██╔══██╗██║   ██║   ██╔══██║██║   ██║██╔══╝  ██║     ██║██║╚██╗██║██╔═██╗ 
echo  ██║  ██║███████╗██║  ██║██║   ██║   ██║  ██║╚██████╔╝███████╗███████╗██║██║ ╚████║██║  ██╗
echo  ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝
echo.
echo                                    🌊 DEPLOYMENT AUTOMATION 🌊
echo.
echo ========================================================================================================
echo.
echo Welcome to the HeritageLink Deployment Automation!
echo.
echo This will help you deploy your beautiful ocean-themed website to the internet for FREE!
echo.
echo ========================================================================================================
echo.
pause

:menu
cls
echo.
echo ========================================
echo    HeritageLink Deployment Menu
echo ========================================
echo.
echo Choose an option:
echo.
echo [1] Check if all files are ready
echo [2] Create ZIP file for GitHub upload
echo [3] Open deployment guides
echo [4] Start deployment process (NO GIT NEEDED!)
echo [5] View admin credentials
echo [6] Install Git (optional)
echo [7] Exit
echo.
set /p choice="Enter your choice (1-7): "

if "%choice%"=="1" goto check_files
if "%choice%"=="2" goto create_zip
if "%choice%"=="3" goto open_guides
if "%choice%"=="4" goto deploy_no_git
if "%choice%"=="5" goto credentials
if "%choice%"=="6" goto install_git
if "%choice%"=="7" goto exit
goto invalid

:check_files
cls
call check-files.bat
goto menu

:create_zip
cls
call create-zip.bat
goto menu

:open_guides
cls
call open-guides.bat
goto menu

:deploy_no_git
cls
echo ========================================
echo    Git-Free Deployment (RECOMMENDED)
echo ========================================
echo.
echo Since Git is not installed, we'll use the EASIER method!
echo This is actually simpler than using Git commands.
echo.
call NO-GIT-DEPLOYMENT.bat
goto menu

:install_git
cls
echo ========================================
echo    Install Git (Optional)
echo ========================================
echo.
echo Git is not required for deployment, but if you want to install it:
echo.
echo 1. Go to: https://git-scm.com/download/win
echo 2. Download Git for Windows
echo 3. Install with default settings
echo 4. Restart this script
echo.
echo However, the Git-free method is actually EASIER!
echo We recommend using option 4 (Git-Free Deployment).
echo.
start https://git-scm.com/download/win
pause
goto menu

:deploy
cls
call deploy-helper.bat
goto menu

:credentials
cls
echo ========================================
echo    HeritageLink Login Credentials
echo ========================================
echo.
echo After deployment, use these credentials:
echo.
echo 🔑 ADMIN DASHBOARD:
echo    URL: https://your-app.onrender.com/admin
echo    Email: admin@heritagelink.com
echo    Password: admin123
echo.
echo 🎨 ARTISAN DASHBOARD:
echo    URL: https://your-app.onrender.com/artisan/dashboard
echo    Email: artisan@heritagelink.com
echo    Password: artisan123
echo.
echo 👤 REGULAR USER:
echo    URL: https://your-app.onrender.com/register
echo    Create new account or use existing test data
echo.
echo ⚠️  IMPORTANT: Change these passwords after deployment!
echo.
pause
goto menu

:invalid
echo.
echo Invalid choice. Please enter 1-6.
timeout /t 2 >nul
goto menu

:exit
echo.
echo Thank you for using HeritageLink Deployment Automation!
echo.
echo Your beautiful website will be live soon! 🌊✨
echo.
pause
exit