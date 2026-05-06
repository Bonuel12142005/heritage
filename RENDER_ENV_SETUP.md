# Render Environment Variables Setup

## Required Environment Variables for Production (Render)

To fix the login errors on Render, you need to configure these environment variables in your Render dashboard:

### 1. Go to Render Dashboard
- Navigate to your service (heritagelink)
- Click on "Environment" tab
- Add the following environment variables:

### 2. Database Configuration (Aiven MySQL)

```
DB_HOST=mysql-2a6b1cea-heritage-6610.d.aivencloud.com
DB_PORT=17649
DB_USER=avnadmin
DB_PASSWORD=your-aiven-password-here
DB_NAME=heritagelink
```

### 3. Application Configuration

```
NODE_ENV=production
PORT=3000
SESSION_SECRET=heritagelink-unified-secret-2024
```

### 4. Save and Redeploy

After adding all environment variables:
1. Click "Save Changes"
2. Render will automatically redeploy your service
3. Wait for the deployment to complete
4. Check the logs for any errors

## Verifying the Setup

### Check Render Logs

After deployment, check the logs for these messages:

✅ **Success indicators:**
```
🔄 Connecting to MySQL database...
📍 DB_HOST: mysql-2a6b1cea-heritage-6610.d.aivencloud.com
📍 DB_PORT: 17649
📍 DB_USER: avnadmin
📍 DB_NAME: heritagelink
🔒 Using SSL for Aiven connection
✅ MySQL database connected!
```

❌ **Error indicators:**
```
❌ Database initialization failed
❌ Database not initialized!
❌ API Login error
```

### Test Login

After successful deployment:
1. Go to your Render URL: `https://heritagelink.onrender.com/login`
2. Try logging in with your credentials
3. If it fails, check the Render logs immediately after the attempt
4. Look for log messages with emojis (🔐, 📊, 👤, 🔒, ✅, ❌)

## Common Issues and Solutions

### Issue 1: "Database not initialized"
**Solution:** Make sure all DB_* environment variables are set correctly in Render

### Issue 2: "Invalid email or password"
**Possible causes:**
- User doesn't exist in the database
- Password is not hashed correctly
- Database connection is using wrong credentials

**Solution:** Run the test script locally to verify users exist:
```bash
node test-login-debug.js
```

### Issue 3: "Internal server error"
**Possible causes:**
- Database connection failed
- bcrypt comparison error
- Session storage error

**Solution:** Check Render logs for the specific error message

### Issue 4: Login works but redirects to wrong page
**Solution:** Check the user's role in the database:
- admin → redirects to /admin
- artisan → redirects to /artisan
- user → redirects to /dashboard

## Testing Locally with Aiven

To test the Aiven connection locally before deploying:

1. Update your `.env` file temporarily:
```
DB_HOST=mysql-2a6b1cea-heritage-6610.d.aivencloud.com
DB_PORT=17649
DB_USER=avnadmin
DB_PASSWORD=your-aiven-password-here
DB_NAME=heritagelink
```

2. Run the server:
```bash
npm start
```

3. Try logging in at `http://localhost:3000/login`

4. If it works locally, it should work on Render with the same environment variables

## Need Help?

If you're still experiencing issues:
1. Copy the Render logs (especially lines with emojis)
2. Share the specific error message
3. Verify that the environment variables are set correctly in Render dashboard
