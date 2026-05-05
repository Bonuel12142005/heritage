# 🚀 Deploy HeritageLink to Render - Complete Guide

## Prerequisites Checklist
- [ ] GitHub account
- [ ] Render account (sign up at https://render.com)
- [ ] Git installed on your computer
- [ ] Your HeritageLink code ready

---

## 📋 STEP 1: Prepare Your Code for Deployment

### 1.1 Update .gitignore
Make sure sensitive files are not pushed to GitHub:

```
node_modules/
.env
data/*.db
*.log
.DS_Store
```

### 1.2 Create render.yaml (Render Configuration)
This file tells Render how to deploy your app.

**File: `render.yaml`** (already created for you)

### 1.3 Verify package.json
Make sure your start script is correct:
```json
"scripts": {
  "start": "node server.js"
}
```
✅ Already configured!

---

## 📋 STEP 2: Set Up Remote MySQL Database (Aiven)

### 2.1 Create Aiven Account
1. Go to https://aiven.io
2. Click "Sign Up" (free tier available)
3. Verify your email

### 2.2 Create MySQL Database
1. Click "Create Service"
2. Select **MySQL**
3. Choose **Free Plan** (Hobbyist)
4. Select region closest to you
5. Name your service: `heritagelink-db`
6. Click "Create Service"
7. Wait 2-3 minutes for database to start

### 2.3 Get Database Connection Details
Once running, you'll see:
- **Host**: `mysql-xxxxx.aivencloud.com`
- **Port**: `12345`
- **User**: `avnadmin`
- **Password**: `xxxxxxxxxx`
- **Database**: `defaultdb`

**Save these details!** You'll need them for Render.

### 2.4 Create HeritageLink Database
1. In Aiven dashboard, click your MySQL service
2. Go to "Query Editor" or use any MySQL client
3. Run this command:
```sql
CREATE DATABASE heritagelink CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## 📋 STEP 3: Push Code to GitHub

### 3.1 Initialize Git (if not already done)
Open terminal in your project folder:

```bash
git init
git add .
git commit -m "Initial commit - HeritageLink ready for deployment"
```

### 3.2 Create GitHub Repository
1. Go to https://github.com
2. Click "+" → "New repository"
3. Name: `heritagelink`
4. Keep it **Public** (required for Render free tier)
5. Don't initialize with README
6. Click "Create repository"

### 3.3 Push to GitHub
Copy the commands from GitHub and run them:

```bash
git remote add origin https://github.com/YOUR_USERNAME/heritagelink.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

---

## 📋 STEP 4: Deploy to Render

### 4.1 Create Render Account
1. Go to https://render.com
2. Click "Get Started"
3. Sign up with GitHub (easiest)
4. Authorize Render to access your repositories

### 4.2 Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `heritagelink`
3. Click "Connect"

### 4.3 Configure Web Service
Fill in these settings:

**Basic Settings:**
- **Name**: `heritagelink` (or any name you want)
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: (leave empty)
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Instance Type:**
- Select **Free** (750 hours/month free)

### 4.4 Add Environment Variables
Click "Advanced" → "Add Environment Variable"

Add these variables one by one:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `DB_HOST` | (Your Aiven host from Step 2.3) |
| `DB_PORT` | (Your Aiven port from Step 2.3) |
| `DB_USER` | (Your Aiven user from Step 2.3) |
| `DB_PASSWORD` | (Your Aiven password from Step 2.3) |
| `DB_NAME` | `heritagelink` |
| `SESSION_SECRET` | `your-super-secret-key-change-this-123456` |

**Important:** Change the SESSION_SECRET to a random string!

### 4.5 Deploy!
1. Click "Create Web Service"
2. Wait 3-5 minutes for deployment
3. Watch the logs for any errors

---

## 📋 STEP 5: Verify Deployment

### 5.1 Check Deployment Status
In Render dashboard, you should see:
- ✅ Build: Successful
- ✅ Deploy: Live
- 🌐 URL: `https://heritagelink.onrender.com` (or your chosen name)

### 5.2 Test Your Website
1. Click on your Render URL
2. You should see your HeritageLink homepage!
3. Test login with default accounts:
   - Admin: `admin@heritagelink.com` / `admin123`
   - Artisan: `artisan@heritagelink.com` / `artisan123`
   - User: `user@heritagelink.com` / `user123`

### 5.3 Check Database Connection
1. Try logging in
2. Navigate to admin dashboard
3. Check if data loads correctly

---

## 📋 STEP 6: Populate Database (Optional)

If you want to add sample data:

### 6.1 Connect to Aiven MySQL
Use any MySQL client (MySQL Workbench, DBeaver, phpMyAdmin) with your Aiven credentials.

### 6.2 Run Setup Scripts
You can run your local scripts to populate data:

```bash
# Update .env with Aiven credentials first
node setup-mysql.js
node populate-database.js
```

---

## 🎉 SUCCESS! Your Site is Live!

Your HeritageLink website is now deployed at:
**https://heritagelink.onrender.com** (or your custom name)

### What You Get:
- ✅ Live website accessible worldwide
- ✅ MySQL database in the cloud
- ✅ Automatic HTTPS (SSL certificate)
- ✅ Free hosting (750 hours/month)
- ✅ Automatic deployments on git push

---

## 🔄 How to Update Your Site

Whenever you make changes:

```bash
git add .
git commit -m "Description of changes"
git push origin main
```

Render will automatically detect the push and redeploy! (takes 2-3 minutes)

---

## ⚠️ Important Notes

### Free Tier Limitations:
- **Sleeps after 15 minutes of inactivity**
  - First request after sleep takes 30-60 seconds to wake up
  - Subsequent requests are fast
- **750 hours/month** (enough for one service running 24/7)
- **512 MB RAM** (sufficient for your app)

### Keep Your Site Awake (Optional):
Use a service like **UptimeRobot** (free) to ping your site every 5 minutes:
1. Sign up at https://uptimerobot.com
2. Add monitor with your Render URL
3. Set interval to 5 minutes

---

## 🐛 Troubleshooting

### Build Failed?
- Check Render logs for errors
- Verify package.json has all dependencies
- Make sure Node version is compatible

### Database Connection Error?
- Verify Aiven database is running
- Check environment variables are correct
- Ensure database name is `heritagelink`
- Check if Aiven allows connections (should be enabled by default)

### Site Not Loading?
- Check Render logs for errors
- Verify PORT environment variable is set
- Make sure server.js is listening on `process.env.PORT`

### Session Issues?
- Make sure SESSION_SECRET is set
- Check if cookies are enabled in browser

---

## 📞 Need Help?

If you encounter issues:
1. Check Render logs (Dashboard → Logs)
2. Check Aiven database status
3. Verify all environment variables
4. Test locally first with Aiven credentials

---

## 🎯 Next Steps

After successful deployment:
1. **Custom Domain** - Add your own domain in Render settings
2. **Monitoring** - Set up UptimeRobot to keep site awake
3. **Backups** - Enable automatic backups in Aiven
4. **Analytics** - Add Google Analytics to track visitors
5. **Email** - Set up email service for password resets

---

**Congratulations! Your HeritageLink system is now live on the internet! 🎉**
