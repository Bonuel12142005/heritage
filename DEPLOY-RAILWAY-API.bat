@echo off
echo ========================================
echo  DEPLOYING BACKUP API TO RAILWAY
echo ========================================
echo.

echo Step 1: Install Railway CLI
echo ============================
npm install -g @railway/cli
if %errorlevel% neq 0 (
    echo Trying with yarn...
    yarn global add @railway/cli
)
echo.

echo Step 2: Login to Railway
echo =========================
railway login
echo.

echo Step 3: Initialize Railway Project
echo ==================================
railway init
echo.

echo Step 4: Deploy Backend
echo ======================
railway up
echo.

echo ========================================
echo  DEPLOYMENT COMPLETE!
echo ========================================
echo.

echo Your new API will be available at:
echo https://your-project-name.up.railway.app
echo.

echo Next steps:
echo 1. Note your Railway URL
echo 2. Update Firebase frontend to use new URL
echo 3. Test API connection
echo.

pause