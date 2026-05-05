# 🚀 HeritageLink Deployment Checklist

## Pre-Deployment ✅

- [x] **Railway configuration** - `railway.toml` created
- [x] **Environment variables** - `.env.example` template created
- [x] **Production server config** - Server binds to `0.0.0.0` and uses `process.env.PORT`
- [x] **Git ignore** - Sensitive files excluded
- [x] **Health check endpoint** - `/health` available for monitoring
- [x] **Error handling** - Proper error pages and JSON responses
- [x] **Upload directory** - Structure maintained with `.gitkeep`

## Railway Deployment Steps

### 1. Repository Setup
```bash
# Add all files to git
git add .
git commit -m "Prepare HeritageLink for Railway deployment"
git push origin main
```

### 2. Railway Project Creation
1. Go to https://railway.app
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose your HeritageLink repository

### 3. Add MySQL Database
1. In Railway dashboard: "New" → "Database" → "Add MySQL"
2. Copy the connection details

### 4. Environment Variables
Set these in Railway → Project → Variables:
```
NODE_ENV=production
DB_HOST=[from Railway MySQL]
DB_PORT=[from Railway MySQL]
DB_NAME=[from Railway MySQL]
DB_USER=[from Railway MySQL]
DB_PASSWORD=[from Railway MySQL]
SESSION_SECRET=your-super-secret-key-here
```

### 5. Deploy & Test
1. Railway auto-deploys on git push
2. Visit your app URL: `https://your-project.up.railway.app`
3. Test all functionality

## Post-Deployment ✅

### Security
- [ ] Change admin password from default (`admin123`)
- [ ] Set strong SESSION_SECRET
- [ ] Test all authentication flows
- [ ] Verify HTTPS is working

### Database
- [ ] Run migrations: `railway run npm run migrate`
- [ ] Verify all tables created
- [ ] Test admin/artisan/user login
- [ ] Check data persistence

### Functionality Testing
- [ ] Homepage loads with ocean theme
- [ ] Admin dashboard accessible
- [ ] Artisan dashboard accessible
- [ ] User registration/login works
- [ ] File uploads work (or configure external storage)
- [ ] All UI themes applied correctly

### Performance
- [ ] Check page load times
- [ ] Monitor Railway metrics
- [ ] Test under load if needed

### Monitoring
- [ ] Set up error tracking
- [ ] Monitor Railway logs
- [ ] Configure alerts if needed

## Quick Commands

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and link project
railway login
railway link

# View logs
railway logs

# Run commands on Railway
railway run npm run migrate
railway run node scripts/check-mysql.js

# Deploy manually (if needed)
railway up
```

## Estimated Costs
- **Railway Hobby**: $5/month per service
- **MySQL Database**: Included
- **Total**: ~$10-15/month

## Support Resources
- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **HeritageLink Repo**: Your GitHub repository

---

## 🎯 Success Criteria

Your deployment is successful when:
1. ✅ App loads at Railway URL
2. ✅ Database connections work
3. ✅ All three user types can login
4. ✅ Ocean theme displays correctly
5. ✅ No console errors
6. ✅ Health check returns OK

**Ready to deploy!** 🚀

Follow the detailed steps in `RAILWAY_DEPLOYMENT_GUIDE.md` for complete instructions.