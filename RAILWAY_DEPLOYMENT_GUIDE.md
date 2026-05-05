# 🚀 HeritageLink Railway Deployment Guide

## Prerequisites
- Railway account (sign up at https://railway.app)
- Git repository (GitHub, GitLab, or Bitbucket)
- Your HeritageLink code pushed to the repository

## Step 1: Prepare Your Repository

### 1.1 Create .gitignore (if not exists)
```
node_modules/
.env
.DS_Store
*.log
data/heritagelink.db
public/uploads/*
!public/uploads/.gitkeep
```

### 1.2 Commit and Push Your Code
```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

## Step 2: Deploy to Railway

### 2.1 Create New Project
1. Go to https://railway.app
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose your HeritageLink repository
5. Railway will automatically detect it's a Node.js app

### 2.2 Add MySQL Database
1. In your Railway project dashboard
2. Click "New" → "Database" → "Add MySQL"
3. Railway will create a MySQL instance automatically
4. Note the connection details provided

### 2.3 Configure Environment Variables
In Railway project settings → Variables, add:

```
NODE_ENV=production
DB_HOST=[Railway MySQL Host]
DB_PORT=[Railway MySQL Port] 
DB_NAME=[Railway MySQL Database]
DB_USER=[Railway MySQL User]
DB_PASSWORD=[Railway MySQL Password]
SESSION_SECRET=your-super-secret-key-change-this
```

**Important**: Railway will provide the database connection details automatically. You can find them in the MySQL service variables.

## Step 3: Database Setup

### 3.1 Run Migrations
After deployment, you can run migrations using Railway's CLI or through the web interface:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Run migrations
railway run npm run migrate
```

### 3.2 Alternative: Manual Database Setup
You can also connect to your Railway MySQL database using any MySQL client and run the migration scripts manually.

## Step 4: Custom Domain (Optional)

### 4.1 Add Custom Domain
1. In Railway project → Settings → Domains
2. Click "Custom Domain"
3. Enter your domain (e.g., heritagelink.com)
4. Update your DNS records as instructed

### 4.2 SSL Certificate
Railway automatically provides SSL certificates for all domains.

## Step 5: File Uploads Configuration

### 5.1 Railway File Storage
Railway provides ephemeral storage. For persistent file uploads, consider:
- **Cloudinary** (recommended for images)
- **AWS S3**
- **Railway Volumes** (for persistent storage)

### 5.2 Update Upload Configuration
If using external storage, update your upload middleware in the controllers.

## Step 6: Environment-Specific Settings

### 6.1 Production Optimizations
Your app is already configured for production with:
- ✅ Environment-based port binding
- ✅ Health check endpoint (`/health`)
- ✅ Error handling
- ✅ Security headers

### 6.2 Session Configuration
For production, consider using a Redis store for sessions:
```javascript
// Add to server.js if needed
import RedisStore from 'connect-redis';
import { createClient } from 'redis';

// Configure Redis session store
const redisClient = createClient({
    url: process.env.REDIS_URL
});
```

## Step 7: Monitoring and Logs

### 7.1 View Logs
```bash
railway logs
```

### 7.2 Monitor Performance
Railway provides built-in metrics in the project dashboard.

## Step 8: Scaling

### 8.1 Vertical Scaling
Railway automatically scales based on usage.

### 8.2 Database Scaling
Upgrade your MySQL plan in Railway dashboard if needed.

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check environment variables
   - Ensure MySQL service is running
   - Verify connection details

2. **File Upload Issues**
   - Check file permissions
   - Consider external storage for production

3. **Session Issues**
   - Verify SESSION_SECRET is set
   - Consider Redis for session storage

4. **Port Issues**
   - Railway automatically assigns PORT
   - Your app uses `process.env.PORT` ✅

### Support
- Railway Documentation: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- HeritageLink Issues: Check your repository issues

## Security Checklist

- [ ] Change default admin password
- [ ] Set strong SESSION_SECRET
- [ ] Enable HTTPS (automatic with Railway)
- [ ] Configure CORS if needed
- [ ] Set up proper error logging
- [ ] Regular database backups

## Cost Estimation

Railway pricing (as of 2024):
- **Hobby Plan**: $5/month per service
- **MySQL**: Included in service cost
- **Bandwidth**: 100GB included
- **Build time**: Unlimited

Total estimated cost: ~$10-15/month for HeritageLink + MySQL

---

## Quick Deploy Commands

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Initialize project
railway init

# 4. Deploy
railway up

# 5. Add MySQL
railway add mysql

# 6. Set environment variables
railway variables set NODE_ENV=production

# 7. Run migrations
railway run npm run migrate
```

Your HeritageLink application will be live at: `https://your-project-name.up.railway.app`

🎉 **Congratulations! Your HeritageLink application is now deployed on Railway!**
