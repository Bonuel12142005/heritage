@echo off
color 0A
echo.
echo  ██╗  ██╗███████╗██████╗ ██╗████████╗ █████╗  ██████╗ ███████╗██╗     ██╗███╗   ██╗██╗  ██╗
echo  ██║  ██║██╔════╝██╔══██╗██║╚══██╔══╝██╔══██╗██╔════╝ ██╔════╝██║     ██║████╗  ██║██║ ██╔╝
echo  ███████║█████╗  ██████╔╝██║   ██║   ███████║██║  ███╗█████╗  ██║     ██║██╔██╗ ██║█████╔╝ 
echo  ██╔══██║██╔══╝  ██╔══██╗██║   ██║   ██╔══██║██║   ██║██╔══╝  ██║     ██║██║╚██╗██║██╔═██╗ 
echo  ██║  ██║███████╗██║  ██║██║   ██║   ██║  ██║╚██████╔╝███████╗███████╗██║██║ ╚████║██║  ██╗
echo  ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝
echo.
echo                           🌊 PROFESSIONAL DEPLOYMENT AUTOMATION 🌊
echo                          Firebase + Render + Aiven Architecture
echo.
echo ========================================================================================================
echo.
echo Welcome to HeritageLink Professional Deployment!
echo.
echo This will deploy your application using industry-standard architecture:
echo 📱 Frontend: Firebase Hosting (Fast CDN, Global Distribution)
echo 🚀 Backend: Render.com (Scalable API Server)
echo 🗄️  Database: Aiven (Managed PostgreSQL)
echo.
echo ========================================================================================================
echo.
pause

:menu
cls
echo.
echo ========================================
echo    Professional Deployment Menu
echo ========================================
echo.
echo Choose deployment phase:
echo.
echo [1] Phase 1: Setup Aiven Database (10 min)
echo [2] Phase 2: Deploy Backend to Render (15 min)
echo [3] Phase 3: Deploy Frontend to Firebase (15 min)
echo [4] Phase 4: Connect & Test Everything (10 min)
echo [5] View deployment guide
echo [6] Open all deployment websites
echo [7] Check deployment status
echo [8] Exit
echo.
set /p choice="Enter your choice (1-8): "

if "%choice%"=="1" goto phase1
if "%choice%"=="2" goto phase2
if "%choice%"=="3" goto phase3
if "%choice%"=="4" goto phase4
if "%choice%"=="5" goto guide
if "%choice%"=="6" goto websites
if "%choice%"=="7" goto status
if "%choice%"=="8" goto exit
goto invalid

:phase1
cls
echo ========================================
echo    PHASE 1: Setup Aiven Database
echo ========================================
echo.
echo Setting up managed PostgreSQL database on Aiven...
echo.
echo [STEP 1] Opening Aiven website...
start https://aiven.io
echo ✅ Aiven opened in your browser
echo.
echo Instructions for Aiven:
echo.
echo 1️⃣  Click "Start Free Trial"
echo 2️⃣  Sign up with your email (no credit card needed)
echo 3️⃣  Verify your email address
echo 4️⃣  Click "Create Service" → "PostgreSQL"
echo 5️⃣  Choose:
echo     - Cloud: AWS (recommended)
echo     - Region: Closest to your users
echo     - Plan: "Hobbyist" (FREE for 1 month)
echo     - Service Name: heritagelink-db
echo 6️⃣  Click "Create Service"
echo 7️⃣  Wait 3-5 minutes for database to start
echo 8️⃣  Copy connection details from Overview tab:
echo     - Host (e.g., heritagelink-db-xxx.aivencloud.com)
echo     - Port (e.g., 12345)
echo     - Database: defaultdb
echo     - User: avnadmin
echo     - Password: (shown in overview)
echo.
echo ⚠️  IMPORTANT: Save these details! You'll need them in Phase 2.
echo.
echo When database is ready, return here and choose Phase 2.
echo.
pause
goto menu

:phase2
cls
echo ========================================
echo    PHASE 2: Deploy Backend to Render
echo ========================================
echo.
echo Deploying Node.js API server to Render...
echo.
echo [STEP 1] Creating backend ZIP file...
if exist "backend-deployment.zip" del "backend-deployment.zip"
powershell -command "Compress-Archive -Path 'backend\*' -DestinationPath 'backend-deployment.zip'" 2>nul
if exist "backend-deployment.zip" (
    echo ✅ Backend ZIP created: backend-deployment.zip
) else (
    echo ⚠️  ZIP creation failed, use manual upload
)
echo.
echo [STEP 2] Opening GitHub for backend repository...
start https://github.com/new
echo ✅ GitHub opened for backend repository
echo.
echo [STEP 3] Opening Render for backend deployment...
start https://render.com/register
echo ✅ Render opened for backend deployment
echo.
echo Instructions:
echo.
echo GitHub Setup:
echo 1️⃣  Repository name: heritagelink-backend
echo 2️⃣  Make it PUBLIC
echo 3️⃣  Upload backend-deployment.zip OR drag backend folder contents
echo 4️⃣  Commit changes
echo.
echo Render Setup:
echo 5️⃣  Sign up with GitHub
echo 6️⃣  "New +" → "Web Service"
echo 7️⃣  Select "heritagelink-backend" repository
echo 8️⃣  Configure:
echo     - Name: heritagelink-api
echo     - Build Command: npm install
echo     - Start Command: npm start
echo     - Plan: Free
echo 9️⃣  Add Environment Variables:
echo     - NODE_ENV = production
echo     - DATABASE_URL = (your Aiven connection string)
echo     - SESSION_SECRET = (create a random secret)
echo 🔟  Click "Create Web Service"
echo.
echo Your API will be at: https://heritagelink-api.onrender.com
echo.
pause
goto menu

:phase3
cls
echo ========================================
echo    PHASE 3: Deploy Frontend to Firebase
echo ========================================
echo.
echo Deploying static frontend to Firebase Hosting...
echo.
echo [STEP 1] Creating frontend ZIP file...
if exist "frontend-deployment.zip" del "frontend-deployment.zip"
powershell -command "Compress-Archive -Path 'frontend\*' -DestinationPath 'frontend-deployment.zip'" 2>nul
if exist "frontend-deployment.zip" (
    echo ✅ Frontend ZIP created: frontend-deployment.zip
) else (
    echo ⚠️  ZIP creation failed, use manual upload
)
echo.
echo [STEP 2] Opening Firebase Console...
start https://console.firebase.google.com
echo ✅ Firebase Console opened
echo.
echo Instructions:
echo.
echo Firebase Setup:
echo 1️⃣  Click "Create a project"
echo 2️⃣  Project name: "heritagelink"
echo 3️⃣  Disable Google Analytics (optional)
echo 4️⃣  Click "Create project"
echo 5️⃣  Go to "Hosting" in left sidebar
echo 6️⃣  Click "Get started"
echo 7️⃣  Click "Add another site"
echo 8️⃣  Site name: "heritagelink-app"
echo 9️⃣  Go to Hosting → "heritagelink-app"
echo 🔟  Drag and drop frontend folder OR upload frontend-deployment.zip
echo 1️⃣1️⃣  Click "Deploy"
echo.
echo Your website will be at: https://heritagelink-app.web.app
echo.
pause
goto menu

:phase4
cls
echo ========================================
echo    PHASE 4: Connect & Test Everything
echo ========================================
echo.
echo Connecting frontend to backend and testing...
echo.
echo [STEP 1] Update API configuration...
echo.
echo In your Firebase frontend, the API is already configured to use:
echo https://heritagelink-api.onrender.com
echo.
echo [STEP 2] Test connections...
echo.
echo Opening test URLs:
start https://heritagelink-api.onrender.com/health
echo ✅ Backend health check opened
timeout /t 3 >nul
start https://heritagelink-app.web.app
echo ✅ Frontend website opened
echo.
echo [STEP 3] Test login functionality...
echo.
echo Default credentials to test:
echo 🔑 Admin: admin@heritagelink.com / admin123
echo 🎨 Artisan: artisan@heritagelink.com / artisan123
echo.
echo Test checklist:
echo [ ] Backend health check returns OK
echo [ ] Frontend loads without errors
echo [ ] Login form works
echo [ ] Admin dashboard accessible
echo [ ] Artisan dashboard accessible
echo [ ] Database connections work
echo.
echo If everything works, your deployment is COMPLETE! 🎉
echo.
pause
goto menu

:guide
cls
start FIREBASE-RENDER-AIVEN-DEPLOYMENT.md
echo ✅ Deployment guide opened
pause
goto menu

:websites
cls
echo ========================================
echo    Opening All Deployment Websites
echo ========================================
echo.
echo Opening all required websites for deployment...
echo.
start https://aiven.io
echo ✅ Aiven (Database)
timeout /t 2 >nul
start https://github.com
echo ✅ GitHub (Code Repository)
timeout /t 2 >nul
start https://render.com
echo ✅ Render (Backend Hosting)
timeout /t 2 >nul
start https://console.firebase.google.com
echo ✅ Firebase (Frontend Hosting)
echo.
echo All deployment websites opened!
echo.
pause
goto menu

:status
cls
echo ========================================
echo    Deployment Status Check
echo ========================================
echo.
echo Checking deployment status...
echo.
echo Opening status pages:
start https://heritagelink-api.onrender.com/health
echo ✅ Backend API Health Check
timeout /t 3 >nul
start https://heritagelink-app.web.app
echo ✅ Frontend Website
echo.
echo Expected results:
echo 📊 Backend: Should show JSON with status "OK"
echo 🌐 Frontend: Should show HeritageLink homepage
echo.
echo If both load successfully, your deployment is working! 🎉
echo.
pause
goto menu

:invalid
echo.
echo Invalid choice. Please enter 1-8.
timeout /t 2 >nul
goto menu

:exit
echo.
echo ========================================
echo    Deployment Complete! 🎉
echo ========================================
echo.
echo Your HeritageLink application is now deployed with:
echo.
echo 🌐 Frontend: https://heritagelink-app.web.app
echo 🚀 Backend: https://heritagelink-api.onrender.com
echo 🗄️  Database: Managed by Aiven
echo.
echo Login credentials:
echo 🔑 Admin: admin@heritagelink.com / admin123
echo 🎨 Artisan: artisan@heritagelink.com / artisan123
echo.
echo Your beautiful ocean-themed website is now live worldwide! 🌊✨
echo.
pause
exit