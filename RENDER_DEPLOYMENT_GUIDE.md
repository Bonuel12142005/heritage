# 🆓 HeritageLink Render.com FREE Deployment Guide

## Why Render.com?
- ✅ **100% FREE** for small projects
- ✅ **PostgreSQL database included** (free tier)
- ✅ **No credit card required** for free tier
- ✅ **Auto-deploy from GitHub**
- ✅ **HTTPS included**
- ✅ **No sleep after 30min** (unlike Heroku)

## Free Tier Limits
- **RAM**: 512MB
- **Storage**: 1GB
- **Database**: PostgreSQL (100MB)
- **Bandwidth**: 100GB/month
- **Build time**: 500 minutes/month

## Step-by-Step Deployment

### 1. Prepare Your Repository

#### 1.1 Create GitHub Repository
1. Go to https://github.com
2. Create new repository: "heritagelink"
3. Make it public (required for free tier)

#### 1.2 Upload Your Code
Since you don't have Git installed locally, use GitHub's web interface:

1. **Download your project as ZIP**
2. **Extract the ZIP file**
3. **Go to your GitHub repository**
4. **Click "uploading an existing file"**
5. **Drag and drop all your HeritageLink files**
6. **Commit the files**

### 2. Deploy on Render

#### 2.1 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub account (free)
3. Authorize Render to access your repositories

#### 2.2 Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select "heritagelink" repository
4. Configure:
   - **Name**: heritagelink
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

#### 2.3 Add PostgreSQL Database
1. In Render dashboard: "New +" → "PostgreSQL"
2. Configure:
   - **Name**: heritagelink-db
   - **Database**: heritagelink
   - **User**: heritagelink_user
   - **Plan**: Free
3. Click "Create Database"

#### 2.4 Configure Environment Variables
In your web service → Environment:

```
NODE_ENV=production
DATABASE_URL=[Auto-filled by Render when you connect the database]
SESSION_SECRET=your-super-secret-key-change-this-in-production
```

#### 2.5 Connect Database to Web Service
1. Go to your web service settings
2. Click "Environment" tab
3. Add environment variable:
   - **Key**: DATABASE_URL
   - **Value**: Select your PostgreSQL database from dropdown

### 3. Automatic Deployment

Render will automatically:
1. ✅ Install dependencies (`npm install`)
2. ✅ Run migrations (`npm run migrate:render`)
3. ✅ Start your application (`npm start`)
4. ✅ Provide HTTPS URL

### 4. Access Your Application

Your app will be available at:
`https://heritagelink.onrender.com` (or similar)

## Default Login Credentials

### Admin Account
- **URL**: https://your-app.onrender.com/admin
- **Email**: admin@heritagelink.com
- **Password**: admin123

### Artisan Account
- **URL**: https://your-app.onrender.com/artisan/dashboard
- **Email**: artisan@heritagelink.com
- **Password**: artisan123

### Regular User
- **URL**: https://your-app.onrender.com/register
- Create new account or use existing test data

## File Upload Configuration

### For Production (Render)
Render has ephemeral storage. For persistent uploads:

1. **Option 1: Cloudinary (Recommended)**
   ```bash
   npm install cloudinary multer-storage-cloudinary
   ```

2. **Option 2: AWS S3**
   ```bash
   npm install aws-sdk multer-s3
   ```

3. **Option 3: Keep local storage** (files will be lost on restart)

## Database Differences

### Development (MySQL) vs Production (PostgreSQL)
Your app automatically handles both:
- **Local**: Uses MySQL (`models/db.js`)
- **Render**: Uses PostgreSQL (`models/db-render.js`)
- **Migrations**: Database-agnostic SQL

## Monitoring and Logs

### View Logs
1. Go to Render dashboard
2. Click your web service
3. Click "Logs" tab
4. Monitor real-time logs

### Health Check
Your app includes health check: `/health`
Render automatically monitors this endpoint.

## Custom Domain (Optional)

### Add Your Domain
1. In Render service → Settings → Custom Domains
2. Add your domain (e.g., heritagelink.com)
3. Update DNS records as instructed
4. SSL certificate is automatic

## Troubleshooting

### Common Issues

1. **Build Failed**
   - Check package.json syntax
   - Ensure all dependencies are listed
   - Check build logs in Render dashboard

2. **Database Connection Error**
   - Verify DATABASE_URL is set
   - Check PostgreSQL service is running
   - Review connection logs

3. **App Won't Start**
   - Check start command: `npm start`
   - Verify server.js exists
   - Check application logs

4. **File Upload Issues**
   - Files are ephemeral on Render
   - Consider external storage (Cloudinary/S3)

### Support Resources
- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com
- **PostgreSQL Guide**: https://render.com/docs/databases

## Security Checklist

- [ ] Change admin password from default
- [ ] Set strong SESSION_SECRET
- [ ] Enable HTTPS (automatic)
- [ ] Configure CORS if needed
- [ ] Set up error monitoring

## Performance Tips

1. **Optimize Images**: Use WebP format
2. **Enable Gzip**: Express compression middleware
3. **Database Indexing**: Add indexes for frequently queried fields
4. **Caching**: Implement Redis caching if needed

## Scaling Options

### When You Outgrow Free Tier:
- **Starter Plan**: $7/month (more RAM/storage)
- **Standard Plan**: $25/month (dedicated resources)
- **Pro Plan**: $85/month (high performance)

---

## 🎯 Quick Deployment Checklist

- [ ] Create GitHub repository
- [ ] Upload HeritageLink code to GitHub
- [ ] Create Render account
- [ ] Create web service from GitHub repo
- [ ] Add PostgreSQL database
- [ ] Set environment variables
- [ ] Wait for deployment to complete
- [ ] Test application at Render URL
- [ ] Change default passwords

## 🎉 Success!

Your HeritageLink application with the beautiful ocean theme will be live and accessible worldwide for **FREE**!

**Estimated deployment time**: 10-15 minutes
**Cost**: $0.00/month (free tier)
**URL**: https://your-app-name.onrender.com