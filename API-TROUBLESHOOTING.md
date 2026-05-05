# 🔧 API Offline - Troubleshooting Guide

## 🚨 **Problem**: API Offline ❌

Your frontend is live on Firebase, but the backend API at `https://heritage3.onrender.com` is not responding.

---

## 🔍 **Step 1: Check Render Service Status**

### **Go to Render Dashboard:**
1. **Visit**: https://dashboard.render.com
2. **Find**: Your "heritage3" service
3. **Check**: Service status

### **Possible Status Issues:**
- 🔴 **Failed** - Deployment failed
- 🟡 **Building** - Still deploying
- 😴 **Sleeping** - Free tier sleeps after 15 minutes
- 🟢 **Live** - Should be working

---

## 🛠️ **Step 2: Common Fixes**

### **Fix A: Wake Up Sleeping Service**
If status shows "Sleeping":
1. **Visit**: https://heritage3.onrender.com/health
2. **Wait**: 30-60 seconds for service to wake up
3. **Refresh**: Your Firebase site and test API again

### **Fix B: Check Environment Variables**
If deployment failed:
1. **Go to**: Render Dashboard → Your service → Environment
2. **Verify**: All 11 environment variables are set correctly
3. **Check**: DATABASE_URL is correct

### **Fix C: Redeploy Service**
1. **Go to**: Render Dashboard → Your service
2. **Click**: "Manual Deploy"
3. **Wait**: 5-10 minutes for deployment
4. **Test**: API again

### **Fix D: Check Build Logs**
1. **Go to**: Render Dashboard → Your service → Logs
2. **Look for**: Error messages
3. **Common errors**:
   - Database connection failed
   - Missing environment variables
   - Package installation failed

---

## 🎯 **Step 3: Test API Directly**

### **Test in Browser:**
Visit these URLs directly:
```
https://heritage3.onrender.com/health
https://heritage3.onrender.com/
```

### **Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-...",
  "service": "HeritageLink Backend API",
  "version": "1.0.0"
}
```

---

## 🚀 **Step 4: Quick Fixes**

### **Most Common Issue: Service Sleeping**
Free Render services sleep after 15 minutes of inactivity.

**Solution:**
1. Visit https://heritage3.onrender.com/health
2. Wait 30-60 seconds
3. Service should wake up
4. Test your Firebase site again

### **Database Connection Issue**
**Check Environment Variables:**
- DATABASE_URL is correct
- DB_HOST, DB_PORT, DB_USER, DB_PASSWORD are set
- All 11 variables from our setup are present

---

## 📱 **Next Steps:**

1. **Check Render status** first
2. **Wake up service** if sleeping
3. **Verify environment variables**
4. **Redeploy if needed**
5. **Test API directly**

**Most likely it's just sleeping - visit the API URL to wake it up!** 🌊