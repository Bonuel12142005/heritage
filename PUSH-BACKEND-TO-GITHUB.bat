@echo off
color 0B
echo ========================================
echo    Push HeritageLink Backend to GitHub
echo ========================================
echo.
echo This will help you upload your backend to GitHub (no Git required!)
echo.
pause

echo.
echo [STEP 1] Creating backend ZIP file for GitHub upload...
echo.

set "zip_name=heritagelink-backend.zip"

if exist "%zip_name%" (
    echo Removing old ZIP file...
    del "%zip_name%"
)

echo Creating ZIP file with backend files...

:: Create ZIP using PowerShell
powershell -command "& {Add-Type -AssemblyName System.IO.Compression.FileSystem; $source = '%cd%\backend'; $destination = '%cd%\%zip_name%'; $compressionLevel = [System.IO.Compression.CompressionLevel]::Optimal; $includeBaseDirectory = $false; [System.IO.Compression.ZipFile]::CreateFromDirectory($source, $destination, $compressionLevel, $includeBaseDirectory)}" 2>nul

if exist "%zip_name%" (
    echo ✅ Backend ZIP created: %zip_name%
) else (
    echo ⚠️  ZIP creation failed, we'll use drag-and-drop method
)

echo.
echo [STEP 2] Opening GitHub for repository creation...
start https://github.com/new
echo ✅ GitHub opened in your browser

echo.
echo [STEP 3] Opening file explorer to show backend files...
start explorer "%cd%\backend"
echo ✅ Backend folder opened

echo.
echo ========================================
echo    GitHub Upload Instructions
echo ========================================
echo.
echo In GitHub (the website that just opened):
echo.
echo 1️⃣  Repository name: heritagelink-backend
echo 2️⃣  Description: HeritageLink Backend API Server
echo 3️⃣  Make it PUBLIC (required for free deployment)
echo 4️⃣  ✅ Add a README file
echo 5️⃣  Click "Create repository"
echo.
echo Then upload your backend files:
echo.
echo METHOD A - ZIP Upload (if ZIP was created):
echo 6️⃣  Click "uploading an existing file"
echo 7️⃣  Drag the file "%zip_name%" to GitHub
echo 8️⃣  Wait for upload to complete
echo 9️⃣  Commit message: "Initial backend deployment"
echo 🔟  Click "Commit changes"
echo.
echo METHOD B - Drag All Files (if no ZIP):
echo 6️⃣  Click "uploading an existing file"
echo 7️⃣  From the backend folder window, select ALL files (Ctrl+A)
echo 8️⃣  Drag them all to GitHub upload area
echo 9️⃣  Wait for upload to complete
echo 🔟  Commit message: "Initial backend deployment"
echo 1️⃣1️⃣  Click "Commit changes"
echo.

echo ========================================
echo    Backend Files to Upload
echo ========================================
echo.
echo Your backend includes:
echo ✅ package.json - Dependencies and scripts
echo ✅ server.js - Main Express server
echo ✅ models/db.js - Database connection
echo ✅ routes/auth.js - Authentication endpoints
echo ✅ routes/admin.js - Admin API routes (if exists)
echo ✅ routes/artisan.js - Artisan API routes (if exists)
echo ✅ routes/user.js - User API routes (if exists)
echo.

echo ========================================
echo    What Happens Next
echo ========================================
echo.
echo After uploading to GitHub:
echo.
echo 1. Your backend code will be stored in GitHub
echo 2. You can deploy it to Render.com
echo 3. Render will automatically build and run your API
echo 4. Your API will be available at: https://heritagelink-api.onrender.com
echo.
echo Repository URL will be:
echo https://github.com/YOUR-USERNAME/heritagelink-backend
echo.

echo ========================================
echo    Ready for Render Deployment
echo ========================================
echo.
echo Once your backend is on GitHub, you can:
echo.
echo 1. Go to https://render.com
echo 2. Sign up with GitHub
echo 3. Create "Web Service" from your repository
echo 4. Deploy automatically!
echo.
echo Your backend API will be live and ready for the frontend!
echo.

pause

echo.
echo [OPTIONAL] Opening Render.com for next step...
set /p deploy_now="Do you want to open Render.com now? (y/n): "
if /i "%deploy_now%"=="y" (
    start https://render.com/register
    echo ✅ Render.com opened for deployment
    echo.
    echo Instructions for Render:
    echo 1. Sign up with GitHub
    echo 2. "New +" → "Web Service"
    echo 3. Select "heritagelink-backend" repository
    echo 4. Configure:
    echo    - Name: heritagelink-api
    echo    - Build Command: npm install
    echo    - Start Command: npm start
    echo    - Plan: Free
    echo 5. Add environment variables (database connection)
    echo 6. Deploy!
)

echo.
echo ========================================
echo    Backend Upload Complete! ✅
echo ========================================
echo.
echo Your HeritageLink backend is now ready for deployment!
echo.
pause