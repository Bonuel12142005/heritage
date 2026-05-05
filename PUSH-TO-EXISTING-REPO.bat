@echo off
color 0B
echo ========================================
echo    Push Backend to Existing Repository
echo ========================================
echo.
echo This will help you upload backend files to your existing GitHub repository.
echo.
pause

echo.
echo [STEP 1] Creating backend ZIP file...
echo.

set "zip_name=heritagelink-backend-files.zip"

if exist "%zip_name%" (
    echo Removing old ZIP file...
    del "%zip_name%"
)

echo Creating ZIP file with all backend files...

:: Create ZIP using PowerShell
powershell -command "& {Add-Type -AssemblyName System.IO.Compression.FileSystem; $source = '%cd%\backend'; $destination = '%cd%\%zip_name%'; $compressionLevel = [System.IO.Compression.CompressionLevel]::Optimal; $includeBaseDirectory = $false; [System.IO.Compression.ZipFile]::CreateFromDirectory($source, $destination, $compressionLevel, $includeBaseDirectory)}" 2>nul

if exist "%zip_name%" (
    echo ✅ Backend ZIP created: %zip_name%
) else (
    echo ⚠️  ZIP creation failed, we'll use manual method
)

echo.
echo [STEP 2] Opening your GitHub repository...
echo.
echo Please provide your GitHub repository URL:
echo Example: https://github.com/yourusername/your-repo-name
echo.
set /p repo_url="Enter your repository URL: "

if not "%repo_url%"=="" (
    start "%repo_url%"
    echo ✅ Your repository opened in browser
) else (
    echo Opening GitHub.com...
    start https://github.com
    echo ✅ GitHub opened - navigate to your repository
)

echo.
echo [STEP 3] Opening backend folder for manual upload...
start explorer "%cd%\backend"
echo ✅ Backend folder opened

echo.
echo ========================================
echo    Upload Instructions
echo ========================================
echo.
echo In your GitHub repository:
echo.
echo METHOD A - ZIP Upload (Recommended):
echo 1️⃣  Click "Add file" → "Upload files"
echo 2️⃣  Drag the file "%zip_name%" to GitHub
echo 3️⃣  Wait for upload to complete
echo 4️⃣  Commit message: "Add HeritageLink backend API"
echo 5️⃣  Click "Commit changes"
echo.
echo METHOD B - Individual Files:
echo 1️⃣  Click "Add file" → "Upload files"
echo 2️⃣  From the backend folder, select ALL files (Ctrl+A)
echo 3️⃣  Drag them all to GitHub upload area
echo 4️⃣  Wait for upload to complete
echo 5️⃣  Commit message: "Add HeritageLink backend API"
echo 6️⃣  Click "Commit changes"
echo.

echo ========================================
echo    Backend Files Being Uploaded
echo ========================================
echo.
echo Your backend includes:
echo ✅ package.json - Node.js dependencies
echo ✅ server.js - Express API server
echo ✅ models/db.js - Database connection
echo ✅ routes/auth.js - Authentication endpoints
echo ✅ routes/admin.js - Admin API routes
echo ✅ routes/artisan.js - Artisan API routes
echo ✅ routes/user.js - User API routes
echo ✅ scripts/migrate.js - Database migrations
echo.

echo ========================================
echo    After Upload - Deploy to Render
echo ========================================
echo.
echo Once files are uploaded to GitHub:
echo.
echo 1. Go to https://render.com
echo 2. Sign up/login with GitHub
echo 3. Click "New +" → "Web Service"
echo 4. Select your repository
echo 5. Configure:
echo    - Name: heritagelink-api
echo    - Build Command: npm install
echo    - Start Command: npm start
echo    - Plan: Free
echo 6. Add environment variables (database connection)
echo 7. Deploy!
echo.
echo Your API will be live at: https://heritagelink-api.onrender.com
echo.

pause

echo.
echo [OPTIONAL] Open Render.com for deployment?
set /p deploy_render="Open Render.com now? (y/n): "
if /i "%deploy_render%"=="y" (
    start https://render.com/register
    echo ✅ Render.com opened for deployment
)

echo.
echo ========================================
echo    Upload Complete! ✅
echo ========================================
echo.
echo Your backend is ready for deployment!
echo Repository: %repo_url%
echo.
pause