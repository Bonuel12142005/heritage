@echo off
echo ========================================
echo  PUSHING BACKEND TO GITHUB REPOSITORY
echo ========================================
echo.

echo Step 1: Extracting backend files...
if exist "heritagelink-backend-final.zip" (
    echo Found backend ZIP file
    powershell -command "Expand-Archive -Path 'heritagelink-backend-final.zip' -DestinationPath 'temp-backend' -Force"
    echo Backend files extracted to temp-backend/
) else (
    echo ERROR: heritagelink-backend-final.zip not found!
    echo Please make sure the ZIP file exists
    pause
    exit /b 1
)

echo.
echo Step 2: Your GitHub repository URL should be:
echo https://github.com/Bonuel12142005/heritage
echo.

echo Step 3: Manual Upload Instructions:
echo =====================================
echo 1. Go to: https://github.com/Bonuel12142005/heritage
echo 2. Click "uploading an existing file" or drag and drop
echo 3. Upload ALL files from the temp-backend/ folder
echo 4. Or use the ZIP upload method below
echo.

echo Step 4: ZIP Upload Method (Recommended):
echo ========================================
echo 1. Go to: https://github.com/Bonuel12142005/heritage
echo 2. Click "Add file" → "Upload files"
echo 3. Drag and drop the file: heritagelink-backend-final.zip
echo 4. GitHub will automatically extract it
echo 5. Add commit message: "Add HeritageLink backend API"
echo 6. Click "Commit changes"
echo.

echo Step 5: After Upload:
echo ======================
echo 1. Go back to Render: https://heritage3.onrender.com
echo 2. Click "Manual Deploy" or "Retry Deploy"
echo 3. Your service should deploy successfully!
echo.

echo Files ready for upload:
echo - heritagelink-backend-final.zip (Main file to upload)
echo - temp-backend/ folder (Individual files if needed)
echo.

echo ========================================
echo  READY TO UPLOAD TO GITHUB!
echo ========================================
echo.
echo Press any key to open GitHub repository...
pause
start https://github.com/Bonuel12142005/heritage