@echo off
color 0B
echo ========================================
echo    NO GIT? NO PROBLEM! 
echo    HeritageLink Deployment (Git-Free)
echo ========================================
echo.
echo Git is not installed on your system, but that's PERFECT!
echo We'll use the easier method - GitHub's web interface.
echo.
echo This method is actually SIMPLER than using Git commands!
echo.
pause

echo.
echo [STEP 1] Creating ZIP file for easy upload...
echo.

set "zip_name=heritagelink-for-github.zip"

if exist "%zip_name%" (
    echo Removing old ZIP file...
    del "%zip_name%"
)

echo Creating ZIP file with all your HeritageLink files...

:: Create ZIP using PowerShell (no Git needed!)
powershell -command "& {Add-Type -AssemblyName System.IO.Compression.FileSystem; $source = '%cd%'; $destination = '%cd%\%zip_name%'; $compressionLevel = [System.IO.Compression.CompressionLevel]::Optimal; $includeBaseDirectory = $false; [System.IO.Compression.ZipFile]::CreateFromDirectory($source, $destination, $compressionLevel, $includeBaseDirectory)}" 2>nul

if exist "%zip_name%" (
    echo ✅ ZIP file created: %zip_name%
) else (
    echo ⚠️  ZIP creation failed, but that's OK!
    echo We'll use drag-and-drop method instead.
)

echo.
echo [STEP 2] Opening GitHub for repository creation...
start https://github.com/new
echo ✅ GitHub opened in your browser
echo.

echo [STEP 3] Opening file explorer to your HeritageLink folder...
start explorer "%cd%"
echo ✅ File explorer opened
echo.

echo ========================================
echo    EASY UPLOAD INSTRUCTIONS
echo ========================================
echo.
echo In GitHub (the website that just opened):
echo.
echo 1️⃣  Repository name: heritagelink
echo 2️⃣  Make it PUBLIC (required for free deployment)
echo 3️⃣  Click "Create repository"
echo 4️⃣  Click "uploading an existing file"
echo.
echo Then choose ONE of these methods:
echo.
echo METHOD A - ZIP Upload (if ZIP was created):
echo 5️⃣  Drag the file "%zip_name%" to GitHub
echo 6️⃣  Wait for upload to complete
echo 7️⃣  Click "Commit changes"
echo.
echo METHOD B - Drag All Files (if no ZIP):
echo 5️⃣  Select ALL files in the explorer window (Ctrl+A)
echo 6️⃣  Drag them all to GitHub upload area
echo 7️⃣  Wait for upload to complete
echo 8️⃣  Click "Commit changes"
echo.
pause

echo.
echo [STEP 4] Opening Render.com for deployment...
start https://render.com/register
echo ✅ Render.com opened in your browser
echo.

echo ========================================
echo    RENDER DEPLOYMENT INSTRUCTIONS
echo ========================================
echo.
echo In Render.com (the website that just opened):
echo.
echo 1️⃣  Sign up with GitHub (use same account)
echo 2️⃣  Click "New +" → "Web Service"
echo 3️⃣  Select your "heritagelink" repository
echo 4️⃣  Settings:
echo     - Name: heritagelink
echo     - Build Command: npm install
echo     - Start Command: npm start
echo     - Plan: FREE
echo 5️⃣  Click "Create Web Service"
echo.
echo 6️⃣  Add Database:
echo     - Click "New +" → "PostgreSQL"
echo     - Name: heritagelink-db
echo     - Plan: FREE
echo     - Click "Create Database"
echo.
echo 7️⃣  Connect Database:
echo     - Go to your web service → Environment
echo     - Add variable: DATABASE_URL
echo     - Select your database from dropdown
echo.
echo 8️⃣  Wait for deployment (3-5 minutes)
echo.

echo ========================================
echo    🎉 YOUR WEBSITE WILL BE LIVE! 🎉
echo ========================================
echo.
echo URL: https://heritagelink-[random].onrender.com
echo Cost: FREE forever
echo Time: 15 minutes total
echo.
echo Login credentials after deployment:
echo 🔑 Admin: admin@heritagelink.com / admin123
echo 🎨 Artisan: artisan@heritagelink.com / artisan123
echo.
echo ========================================
echo    Git NOT Required! ✅
echo ========================================
pause