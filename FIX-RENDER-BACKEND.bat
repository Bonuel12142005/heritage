@echo off
echo ========================================
echo  FIXING RENDER BACKEND DEPLOYMENT
echo ========================================
echo.

echo Problem: API Connection Failed - Failed to fetch
echo Solution: Check and redeploy Render backend
echo.

echo Step 1: Opening Render Dashboard
echo =================================
echo Opening your Render dashboard to check service status...
start https://dashboard.render.com
echo.

echo Step 2: What to Look For
echo ========================
echo In the Render dashboard, find your service and check:
echo.
echo Status Indicators:
echo - 🔴 FAILED: Service deployment failed
echo - 🟡 BUILDING: Service is still deploying  
echo - 😴 SLEEPING: Service is asleep (normal for free tier)
echo - 🟢 LIVE: Service should be working
echo.

echo Step 3: Common Fixes
echo ====================
echo.
echo If Status is FAILED:
echo 1. Click on your service
echo 2. Click "Manual Deploy" button
echo 3. Wait 5-10 minutes for deployment
echo 4. Check logs for errors
echo.
echo If Status is BUILDING:
echo 1. Wait for build to complete
echo 2. Check build logs for progress
echo.
echo If Status is SLEEPING:
echo 1. Visit: https://heritage3.onrender.com/health
echo 2. Wait 30-60 seconds for wake up
echo.
echo If Status is LIVE but still not working:
echo 1. Check Environment Variables tab
echo 2. Verify all 11 variables are set
echo 3. Redeploy if variables are missing
echo.

echo Step 4: Environment Variables Check
echo ====================================
echo Your service needs these 11 variables:
echo - NODE_ENV=production
echo - DATABASE_URL=(your MySQL connection string)
echo - DB_HOST=(your Aiven host)
echo - DB_PORT=17649
echo - DB_NAME=defaultdb
echo - DB_USER=avnadmin
echo - DB_PASSWORD=(your Aiven password)
echo - DB_SSL=true
echo - SESSION_SECRET=heritagelink-production-secret-2024
echo - FRONTEND_URL=https://heritagelink-22d0f.web.app
echo - PORT=3000
echo.

echo Step 5: Force Redeploy
echo =======================
echo If nothing else works:
echo 1. Go to your service in Render
echo 2. Click "Settings" tab
echo 3. Scroll to "Build & Deploy"
echo 4. Click "Manual Deploy"
echo 5. Wait for complete deployment
echo.

echo ========================================
echo  AFTER FIXING:
echo ========================================
echo.
echo 1. Wait for Render service to show "Live" status
echo 2. Test API directly: https://heritage3.onrender.com/health
echo 3. Go back to your Firebase site: https://heritagelink-22d0f.web.app
echo 4. Click "Test API" button - should show green checkmark
echo.

pause