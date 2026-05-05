@echo off
echo ========================================
echo  FIREBASE HOSTING SETUP - MANUAL
echo ========================================
echo.

echo Your Firebase project details:
echo Project ID: heritagelink-22d0f
echo Auth Domain: heritagelink-22d0f.firebaseapp.com
echo.

echo Step 1: Install Firebase CLI
echo ============================
npm install -g firebase-tools
echo.

echo Step 2: Login to Firebase
echo ==========================
firebase login
echo.

echo Step 3: Initialize Project
echo ==========================
echo When prompted, choose:
echo - Use an existing project
echo - Select: heritagelink-22d0f
echo - Public directory: public
echo - Single-page app: Yes
echo - Overwrite index.html: No
echo.
firebase init hosting
echo.

echo Step 4: Deploy
echo ===============
firebase deploy --only hosting
echo.

echo ========================================
echo  YOUR SITE WILL BE LIVE AT:
echo ========================================
echo https://heritagelink-22d0f.web.app
echo https://heritagelink-22d0f.firebaseapp.com
echo.

pause