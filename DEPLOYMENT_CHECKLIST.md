# 📋 HeritageLink Render Deployment Checklist

## Before You Start
- [ ] Read RENDER_DEPLOYMENT_GUIDE.md completely
- [ ] Have GitHub account ready
- [ ] Have Render account ready (or sign up)
- [ ] Code is working locally on http://localhost:3000

---

## Step 1: Database Setup (15 minutes)
- [ ] Create Aiven account at https://aiven.io
- [ ] Create MySQL service (Free tier)
- [ ] Wait for database to start (2-3 minutes)
- [ ] Copy connection details (host, port, user, password)
- [ ] Create `heritagelink` database using Query Editor

**Connection Details to Save:**
```
Host: _______________________
Port: _______________________
User: _______________________
Password: ___________________
Database: heritagelink
```

---

## Step 2: GitHub Setup (5 minutes)
- [ ] Open terminal in project folder
- [ ] Run: `git init` (if not already initialized)
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Ready for deployment"`
- [ ] Create new repository on GitHub (public)
- [ ] Copy repository URL
- [ ] Run: `git remote add origin YOUR_REPO_URL`
- [ ] Run: `git push -u origin main`
- [ ] Verify code is on GitHub

---

## Step 3: Render Setup (10 minutes)
- [ ] Go to https://render.com
- [ ] Sign up with GitHub
- [ ] Click "New +" → "Web Service"
- [ ] Select your `heritagelink` repository
- [ ] Click "Connect"

**Configure Settings:**
- [ ] Name: `heritagelink` (or your choice)
- [ ] Region: Select closest to you
- [ ] Branch: `main`
- [ ] Runtime: `Node`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Instance Type: **Free**

**Add Environment Variables:**
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `3000`
- [ ] `DB_HOST` = (from Aiven)
- [ ] `DB_PORT` = (from Aiven)
- [ ] `DB_USER` = (from Aiven)
- [ ] `DB_PASSWORD` = (from Aiven)
- [ ] `DB_NAME` = `heritagelink`
- [ ] `SESSION_SECRET` = (random string, e.g., `my-super-secret-key-12345`)

- [ ] Click "Create Web Service"
- [ ] Wait for deployment (3-5 minutes)

---

## Step 4: Verify Deployment (5 minutes)
- [ ] Check build logs - should show "Build successful"
- [ ] Check deploy logs - should show "Deploy live"
- [ ] Copy your Render URL (e.g., https://heritagelink.onrender.com)
- [ ] Open URL in browser
- [ ] Homepage loads successfully
- [ ] Test login with admin account:
  - Email: `admin@heritagelink.com`
  - Password: `admin123`
- [ ] Check admin dashboard loads
- [ ] Test navigation to different pages
- [ ] Verify database connection works

---

## Step 5: Populate Database (Optional - 5 minutes)
If you want sample data:

- [ ] Update local .env with Aiven credentials
- [ ] Run: `node setup-mysql.js`
- [ ] Run: `node populate-database.js`
- [ ] Refresh your Render site
- [ ] Verify data appears

---

## 🎉 Deployment Complete!

Your site is live at: **https://__________________.onrender.com**

### Test These Features:
- [ ] Homepage loads
- [ ] Login works (admin, artisan, user)
- [ ] Admin dashboard accessible
- [ ] Artisan dashboard accessible
- [ ] User dashboard accessible
- [ ] Destinations page loads
- [ ] Events page loads
- [ ] Heritage gallery loads
- [ ] Showcase page loads
- [ ] All CSS/styling works
- [ ] Images load correctly
- [ ] Forms work (if tested)

---

## 🔄 How to Update Your Site

When you make changes:

```bash
git add .
git commit -m "Description of your changes"
git push origin main
```

Render will automatically redeploy (takes 2-3 minutes).

---

## ⚠️ Important Reminders

1. **Free tier sleeps after 15 minutes** - First request takes 30-60 seconds
2. **Keep site awake** - Use UptimeRobot (free) to ping every 5 minutes
3. **Backup database** - Enable backups in Aiven dashboard
4. **Monitor logs** - Check Render logs if issues occur
5. **Update regularly** - Keep dependencies updated

---

## 🐛 Common Issues & Solutions

### "Build Failed"
- Check package.json has all dependencies
- Verify Node version compatibility
- Check Render build logs for specific error

### "Database Connection Error"
- Verify Aiven database is running (green status)
- Double-check environment variables
- Ensure database name is exactly `heritagelink`
- Check Aiven allows external connections (default: yes)

### "Site Not Loading"
- Wait 60 seconds (might be waking from sleep)
- Check Render logs for errors
- Verify PORT environment variable is set
- Clear browser cache and try again

### "Login Not Working"
- Check SESSION_SECRET is set
- Verify database has users table
- Run setup-mysql.js to create default users
- Check browser allows cookies

---

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **Aiven Docs**: https://docs.aiven.io
- **Render Community**: https://community.render.com
- **Check Logs**: Render Dashboard → Your Service → Logs

---

## 🎯 Next Steps After Deployment

1. **Custom Domain** (Optional)
   - Buy domain from Namecheap, GoDaddy, etc.
   - Add to Render in Settings → Custom Domain
   - Update DNS records

2. **Keep Site Awake**
   - Sign up at https://uptimerobot.com
   - Add HTTP(s) monitor
   - Set check interval to 5 minutes

3. **Enable Backups**
   - Go to Aiven dashboard
   - Enable automatic backups
   - Set backup schedule

4. **Add Analytics**
   - Get Google Analytics code
   - Add to your views templates
   - Track visitor statistics

5. **Email Setup** (For password resets)
   - Use SendGrid, Mailgun, or similar
   - Add email configuration
   - Test password reset flow

---

**Good luck with your deployment! 🚀**
