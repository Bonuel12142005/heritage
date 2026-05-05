@echo off
echo ========================================
echo  FIREBASE HOSTING - FREE DEPLOYMENT
echo ========================================
echo.

echo Step 1: Install Firebase CLI
echo ============================
echo Installing Firebase CLI globally...
npm install -g firebase-tools
if %errorlevel% neq 0 (
    echo Error installing Firebase CLI. Trying with yarn...
    yarn global add firebase-tools
)
echo.

echo Step 2: Login to Firebase
echo ==========================
echo Opening browser for Firebase login...
firebase login
echo.

echo Step 3: Initialize Firebase Hosting
echo ===================================
echo Initializing Firebase hosting in current directory...
firebase init hosting
echo.

echo Step 4: Deploy to Firebase Hosting
echo ==================================
echo Deploying your site to Firebase...
firebase deploy --only hosting
echo.

echo ========================================
echo  DEPLOYMENT COMPLETE!
echo ========================================
echo.

echo Your site should be live at:
echo https://heritagelink-22d0f.web.app
echo https://heritagelink-22d0f.firebaseapp.com
echo.

echo To deploy again in the future, just run:
echo firebase deploy --only hosting
echo.

pause