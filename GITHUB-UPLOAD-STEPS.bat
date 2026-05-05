@echo off
echo ========================================
echo  GITHUB WEB UPLOAD - STEP BY STEP
echo ========================================
echo.

echo I've created the files you need to upload:
echo - server.js (your complete backend API)
echo - package.json (configuration)
echo.

echo STEP 1: Open GitHub Repository
echo ===============================
echo Click this link or copy to browser:
echo https://github.com/Bonuel12142005/heritage
echo.

echo STEP 2: Upload Files
echo ====================
echo 1. Click "Add file" button
echo 2. Select "Upload files"
echo 3. Drag these 2 files to the upload area:
echo    - server.js
echo    - package.json
echo.

echo STEP 3: Commit Changes
echo ======================
echo 1. Scroll down to "Commit changes"
echo 2. Add message: "Add HeritageLink backend API"
echo 3. Click "Commit changes"
echo.

echo STEP 4: Deploy on Render
echo =========================
echo 1. Go to: https://heritage3.onrender.com
echo 2. Click "Manual Deploy" or "Retry Deploy"
echo 3. Wait 3-5 minutes
echo 4. Test: https://heritage3.onrender.com/health
echo.

echo STEP 5: Test Your API
echo =====================
echo Your API will be available at:
echo https://heritage3.onrender.com
echo.
echo Test endpoints:
echo - /health (health check)
echo - /api/auth/login (login)
echo - /api/admin/dashboard (admin data)
echo.

echo Login credentials:
echo - Admin: admin@heritagelink.com / admin123
echo - Artisan: artisan@heritagelink.com / artisan123
echo - User: user@heritagelink.com / user123
echo.

echo ========================================
echo  READY TO UPLOAD!
echo ========================================
echo.
echo Press any key to open GitHub...
pause
start https://github.com/Bonuel12142005/heritage