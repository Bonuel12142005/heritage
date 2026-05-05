@echo off
echo ========================================
echo    HeritageLink ZIP Creator
echo ========================================
echo.
echo This will create a ZIP file of your HeritageLink project
echo for easy upload to GitHub.
echo.

set "zip_name=heritagelink-deployment.zip"

echo Creating ZIP file: %zip_name%
echo.

if exist "%zip_name%" (
    echo Removing old ZIP file...
    del "%zip_name%"
)

echo Adding files to ZIP...

:: Use PowerShell to create ZIP (available on Windows 10+)
powershell -command "& {Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory('%cd%', '%cd%\%zip_name%', 'Optimal', $false)}"

if exist "%zip_name%" (
    echo.
    echo ✅ ZIP file created successfully: %zip_name%
    echo.
    echo You can now:
    echo 1. Go to your GitHub repository
    echo 2. Click "Add file" → "Upload files"
    echo 3. Upload this ZIP file
    echo 4. Extract it in GitHub
    echo.
    echo Opening file location...
    explorer /select,"%cd%\%zip_name%"
) else (
    echo.
    echo ❌ Failed to create ZIP file.
    echo.
    echo Alternative: Manually select all files and upload to GitHub
    echo 1. Select all files in this folder (Ctrl+A)
    echo 2. Drag and drop to GitHub repository
)

echo.
pause