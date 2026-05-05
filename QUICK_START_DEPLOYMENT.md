# ⚡ Quick Start - Deploy to Render in 30 Minutes

## 🎯 What You'll Do:
1. Set up cloud database (Aiven MySQL)
2. Push code to GitHub
3. Deploy to Render
4. Your site goes live!

---

## 📝 Step-by-Step Commands

### STEP 1: Set Up Aiven Database (10 min)

1. **Go to**: https://aiven.io
2. **Sign up** (free)
3. **Create Service**:
   - Service: MySQL
   - Plan: Hobbyist (Free)
   - Name: `heritagelink-db`
4. **Wait 2-3 minutes** for database to start
5. **Copy these details** (you'll need them):
   ```
   Host: mysql-xxxxx.aivencloud.com
   Port: 12345
   User: avnadmin
   Password: xxxxxxxxxx
   ```
6. **Create database**: In Aiven Query Editor, run:
   ```sql
   CREATE DATABASE heritagelink;
   ```

---

### STEP 2: Push to GitHub (5 min)

Open terminal in your project folder and run these commands:

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Render deployment"

# Create repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/heritagelink.git

# Push to GitHub
git push -u origin main
```

**Don't forget**: Replace `YOUR_USERNAME` with your actual GitHub username!

---

### STEP 3: Deploy to Render (10 min)

1. **Go to**: https://render.com
2. **Sign up** with GitHub
3. **Click**: "New +" → "Web Service"
4. **Select**: Your `heritagelink` repository
5. **Configure**:
   - Name: `heritagelink`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: **Free**

6. **Add Environment Variables** (click "Advanced"):

   ```
   NODE_ENV = production
   PORT = 3000
   DB_HOST = (your Aiven host)
   DB_PORT = (your Aiven port)
   DB_USER = (your Aiven user)
   DB_PASSWORD = (your Aiven password)
   DB_NAME = heritagelink
   SESSION_SECRET = change-this-to-random-string-123456
   ```

7. **Click**: "Create Web Service"
8. **Wait**: 3-5 minutes for deployment

---

### STEP 4: Test Your Site (5 min)

1. **Open**: Your Render URL (e.g., https://heritagelink.onrender.com)
2. **Test login**:
   - Email: `admin@heritagelink.com`
   - Password: `admin123`
3. **Check**: Admin dashboard loads
4. **Done!** 🎉

---

## 🎉 Success!

Your HeritageLink website is now live on the internet!

**Your URL**: https://heritagelink.onrender.com (or your custom name)

---

## 🔄 How to Update

Whenever you make changes:

```bash
git add .
git commit -m "Your changes description"
git push origin main
```

Render automatically redeploys in 2-3 minutes!

---

## ⚠️ Important Notes

- **Free tier sleeps after 15 minutes of inactivity**
  - First request after sleep takes 30-60 seconds
  - Use UptimeRobot (free) to keep it awake

- **Default accounts**:
  - Admin: `admin@heritagelink.com` / `admin123`
  - Artisan: `artisan@heritagelink.com` / `artisan123`
  - User: `user@heritagelink.com` / `user123`

---

## 🐛 Troubleshooting

**Build failed?**
- Check Render logs
- Verify package.json is correct

**Database error?**
- Check Aiven database is running
- Verify environment variables are correct

**Site not loading?**
- Wait 60 seconds (might be waking up)
- Check Render logs for errors

---

## 📚 Full Documentation

For detailed instructions, see:
- **RENDER_DEPLOYMENT_GUIDE.md** - Complete guide
- **DEPLOYMENT_CHECKLIST.md** - Step-by-step checklist

---

**Need help? Check the logs in Render dashboard!**
