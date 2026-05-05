@echo off
echo ========================================
echo    HeritageLink Deployment Guides
echo ========================================
echo.
echo Opening all deployment guides and resources...
echo.

if exist "DEPLOY_NOW_SIMPLE_STEPS.md" (
    echo ✓ Opening simple deployment steps...
    start DEPLOY_NOW_SIMPLE_STEPS.md
) else (
    echo ❌ Simple steps guide not found
)

if exist "RENDER_DEPLOYMENT_GUIDE.md" (
    echo ✓ Opening detailed Render guide...
    start RENDER_DEPLOYMENT_GUIDE.md
) else (
    echo ❌ Render guide not found
)

if exist "FREE_DEPLOYMENT_CHECKLIST.md" (
    echo ✓ Opening deployment checklist...
    start FREE_DEPLOYMENT_CHECKLIST.md
) else (
    echo ❌ Deployment checklist not found
)

if exist "ADMIN_CREDENTIALS.md" (
    echo ✓ Opening admin credentials...
    start ADMIN_CREDENTIALS.md
) else (
    echo ❌ Admin credentials not found
)

echo.
echo All available guides have been opened in your default text editor.
echo.
echo Quick Reference:
echo - GitHub: https://github.com
echo - Render: https://render.com
echo - Admin Login: admin@heritagelink.com / admin123
echo - Artisan Login: artisan@heritagelink.com / artisan123
echo.
pause