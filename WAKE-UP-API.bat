@echo off
echo ========================================
echo  WAKING UP RENDER API SERVICE
echo ========================================
echo.

echo The most common issue: Render free services sleep after 15 minutes
echo.

echo Step 1: Testing API directly...
echo ===============================
echo Visiting: https://heritage3.onrender.com/health
echo.

echo Opening API health check in browser...
start https://heritage3.onrender.com/health
echo.

echo Step 2: Wait for wake up...
echo ===========================
echo Please wait 30-60 seconds for the service to wake up
echo You should see a JSON response in your browser
echo.

timeout /t 10 /nobreak >nul
echo Step 3: Testing main API endpoint...
echo ===================================
echo Opening main API endpoint...
start https://heritage3.onrender.com/
echo.

echo Step 4: Check Render Dashboard...
echo =================================
echo Opening Render dashboard to check service status...
start https://dashboard.render.com
echo.

echo ========================================
echo  INSTRUCTIONS:
echo ========================================
echo.
echo 1. Wait for browser windows to load
echo 2. Check if API returns JSON response
echo 3. If still offline, check Render dashboard
echo 4. Look for service status (Failed/Sleeping/Live)
echo 5. If Failed, click "Manual Deploy"
echo 6. If Sleeping, just wait - it should wake up
echo.

echo After API is awake, test your Firebase site:
echo https://heritagelink-22d0f.web.app
echo.

pause