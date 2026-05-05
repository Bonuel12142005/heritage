@echo off
echo ========================================
echo    HeritageLink Deployment Helper
echo ========================================
echo.
echo This script will help you deploy HeritageLink to Render.com
echo.
echo What this script does:
echo [1] Opens GitHub in your browser
echo [2] Opens Render.com in your browser  
echo [3] Shows you the deployment checklist
echo [4] Prepares your files for upload
echo.
pause

echo.
echo [STEP 1] Opening GitHub for repository creation...
start https://github.com/new
echo ✓ GitHub opened in your browser
echo.
echo Instructions for GitHub:
echo - Repository name: heritagelink
echo - Make it PUBLIC (required for free deployment)
echo - Click "Create repository"
echo.
pause

echo.
echo [STEP 2] Opening Render.com for deployment...
start https://render.com/register
echo ✓ Render.com opened in your browser
echo.
echo Instructions for Render:
echo - Sign up with your GitHub account
echo - Create "Web Service" from your heritagelink repository
echo - Add PostgreSQL database (free)
echo.
pause

echo.
echo [STEP 3] Opening deployment checklist...
start DEPLOY_NOW_SIMPLE_STEPS.md
echo ✓ Deployment guide opened
echo.
echo [STEP 4] Your files are ready for upload!
echo All necessary files have been created in this folder.
echo.
echo Next steps:
echo 1. Upload ALL files to your GitHub repository
echo 2. Deploy on Render.com using the guide
echo 3. Your website will be live!
echo.
echo ========================================
echo    Deployment Helper Complete!
echo ========================================
pause