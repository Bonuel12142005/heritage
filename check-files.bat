@echo off
echo ========================================
echo    HeritageLink File Checker
echo ========================================
echo.
echo Checking if all deployment files are ready...
echo.

set "missing_files="

if not exist "package.json" (
    echo ❌ package.json - MISSING
    set "missing_files=1"
) else (
    echo ✓ package.json - OK
)

if not exist "server.js" (
    echo ❌ server.js - MISSING
    set "missing_files=1"
) else (
    echo ✓ server.js - OK
)

if not exist "render.yaml" (
    echo ❌ render.yaml - MISSING
    set "missing_files=1"
) else (
    echo ✓ render.yaml - OK
)

if not exist "models\db-render.js" (
    echo ❌ models\db-render.js - MISSING
    set "missing_files=1"
) else (
    echo ✓ models\db-render.js - OK
)

if not exist "scripts\migrate-render.js" (
    echo ❌ scripts\migrate-render.js - MISSING
    set "missing_files=1"
) else (
    echo ✓ scripts\migrate-render.js - OK
)

if not exist "views" (
    echo ❌ views folder - MISSING
    set "missing_files=1"
) else (
    echo ✓ views folder - OK
)

if not exist "public" (
    echo ❌ public folder - MISSING
    set "missing_files=1"
) else (
    echo ✓ public folder - OK
)

if not exist "DEPLOY_NOW_SIMPLE_STEPS.md" (
    echo ❌ DEPLOY_NOW_SIMPLE_STEPS.md - MISSING
    set "missing_files=1"
) else (
    echo ✓ DEPLOY_NOW_SIMPLE_STEPS.md - OK
)

echo.
if defined missing_files (
    echo ❌ Some files are missing! Please check the above list.
    echo.
    echo Make sure you're running this from the HeritageLink folder.
) else (
    echo ✅ ALL FILES READY FOR DEPLOYMENT!
    echo.
    echo Your HeritageLink application is ready to deploy.
    echo Run 'deploy-helper.bat' to start the deployment process.
)

echo.
echo File count summary:
dir /b *.* | find /c /v "" > temp_count.txt
set /p file_count=<temp_count.txt
del temp_count.txt
echo Total files in directory: %file_count%

echo.
pause