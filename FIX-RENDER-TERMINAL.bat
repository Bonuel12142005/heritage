@echo off
echo ========================================
echo  FIXING RENDER API VIA TERMINAL
echo ========================================
echo.

echo Step 1: Test Current API Status
echo ================================
echo Testing your Render API directly...
curl -s https://heritage3.onrender.com/health
echo.
echo If you see JSON response above, API is working
echo If you see error or nothing, API is down
echo.

echo Step 2: Wake Up Render Service
echo ===============================
echo Sending wake-up request to Render...
curl -s https://heritage3.onrender.com/
echo.
echo Waiting 30 seconds for service to wake up...
timeout /t 30 /nobreak >nul
echo.

echo Step 3: Test Again After Wake Up
echo =================================
echo Testing API after wake up attempt...
curl -s https://heritage3.onrender.com/health
echo.

echo Step 4: Force GitHub Push (Trigger Redeploy)
echo =============================================
echo Adding Git PATH for this session...
set "PATH=%PATH%;C:\Program Files\Git\bin;C:\Program Files\Git\cmd"
echo.

echo Making a small change to trigger redeploy...
echo # API Fix - %date% %time% >> backend/README.md
echo.

echo Committing and pushing to trigger Render redeploy...
git add backend/README.md
git commit -m "Trigger Render redeploy - API fix"
git push origin main
echo.

echo Step 5: Wait for Render Auto-Deploy
echo ====================================
echo Render should automatically redeploy when it detects the GitHub push
echo This usually takes 3-5 minutes
echo.

echo Waiting 2 minutes before testing...
timeout /t 120 /nobreak >nul
echo.

echo Step 6: Test API After Redeploy
echo ================================
echo Testing API after redeploy...
curl -s https://heritage3.onrender.com/health
echo.

echo ========================================
echo  RESULTS:
echo ========================================
echo.
echo If you see JSON with "status": "OK" above, your API is fixed!
echo If not, the issue might be:
echo 1. Environment variables missing in Render
echo 2. Database connection failed
echo 3. Build failed during deployment
echo.

echo Next: Go to https://heritagelink-22d0f.web.app and test API button
echo.

pause