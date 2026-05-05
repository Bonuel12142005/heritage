# 📋 Copy-Paste Method for GitHub Upload

Since I can't directly push to your GitHub, here's the **easiest copy-paste method**:

## Method 1: Copy-Paste File Contents

### Step 1: Go to GitHub
1. Open: https://github.com/Bonuel12142005/heritage
2. Click "Add file" → "Create new file"

### Step 2: Create server.js
1. **Filename**: `server.js`
2. **Copy this entire content** and paste it:

```javascript
// HeritageLink Backend API - Single File Version
// This file contains everything needed for deployment
// Just copy this file and deploy it anywhere that supports Node.js

import express from 'express';
import cors from 'cors';
import session from 'express-session';

const app = express();

// CORS configuration
app.use(cors({
    origin: [
        'https://heritagelink-app.web.app',
        'https://heritagelink-app.firebaseapp.com',
        'http://localhost:3000',
        'http://localhost:5000',
        '*' // Allow all origins for testing
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'heritagelink-api-secret-2024',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
}));

// Mock database (in-memory for simplicity)
const users = [
    { id: 1, email: 'admin@heritagelink.com', password: 'admin123', role: 'admin' },
    { id: 2, email: 'artisan@heritagelink.com', password: 'artisan123', role: 'artisan' },
    { id: 3, email: 'user@heritagelink.com', password: 'user123', role: 'user' }
];

const destinations = [
    { id: 1, name: 'Heritage Site 1', location: 'Location 1', description: 'Beautiful heritage site' },
    { id: 2, name: 'Heritage Site 2', location: 'Location 2', description: 'Historic landmark' }
];

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'HeritageLink Backend API',
        version: '1.0.0',
        deployment: 'Single File Version'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'HeritageLink Backend API - Single File Version',
        version: '1.0.0',
        status: 'Running Successfully! 🚀',
        endpoints: {
            health: '/health',
            auth: '/api/auth/*',
            admin: '/api/admin/*',
            artisan: '/api/artisan/*',
            user: '/api/user/*'
        },
        frontend: 'https://heritagelink-app.web.app',
        note: 'This is a simplified single-file version for easy deployment'
    });
});

// AUTH ROUTES
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        req.session.userId = user.id;
        req.session.userRole = user.role;
        
        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }
});

app.post('/api/auth/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true, message: 'Logged out successfully' });
});

app.get('/api/auth/me', (req, res) => {
    if (req.session.userId) {
        const user = users.find(u => u.id === req.session.userId);
        res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });
    } else {
        res.status(401).json({ success: false, message: 'Not authenticated' });
    }
});

// ADMIN ROUTES
app.get('/api/admin/dashboard', (req, res) => {
    if (req.session.userRole !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    
    res.json({
        success: true,
        data: {
            totalUsers: users.length,
            totalDestinations: destinations.length,
            totalArtisans: users.filter(u => u.role === 'artisan').length,
            recentActivity: [
                { action: 'New user registered', timestamp: new Date().toISOString() },
                { action: 'Destination added', timestamp: new Date().toISOString() }
            ]
        }
    });
});

app.get('/api/admin/destinations', (req, res) => {
    if (req.session.userRole !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    
    res.json({
        success: true,
        destinations: destinations
    });
});

app.post('/api/admin/destinations', (req, res) => {
    if (req.session.userRole !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    
    const { name, location, description } = req.body;
    const newDestination = {
        id: destinations.length + 1,
        name,
        location,
        description,
        createdAt: new Date().toISOString()
    };
    
    destinations.push(newDestination);
    
    res.json({
        success: true,
        message: 'Destination added successfully',
        destination: newDestination
    });
});

// ARTISAN ROUTES
app.get('/api/artisan/dashboard', (req, res) => {
    if (req.session.userRole !== 'artisan') {
        return res.status(403).json({ success: false, message: 'Artisan access required' });
    }
    
    res.json({
        success: true,
        data: {
            totalProducts: 5,
            totalOrders: 12,
            revenue: 1250,
            recentOrders: [
                { id: 1, product: 'Handmade Pottery', amount: 150, date: new Date().toISOString() },
                { id: 2, product: 'Traditional Textile', amount: 200, date: new Date().toISOString() }
            ]
        }
    });
});

app.get('/api/artisan/products', (req, res) => {
    if (req.session.userRole !== 'artisan') {
        return res.status(403).json({ success: false, message: 'Artisan access required' });
    }
    
    res.json({
        success: true,
        products: [
            { id: 1, name: 'Handmade Pottery', price: 150, stock: 10 },
            { id: 2, name: 'Traditional Textile', price: 200, stock: 5 },
            { id: 3, name: 'Wooden Sculpture', price: 300, stock: 3 }
        ]
    });
});

// USER ROUTES
app.get('/api/user/destinations', (req, res) => {
    res.json({
        success: true,
        destinations: destinations
    });
});

app.get('/api/user/profile', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    
    const user = users.find(u => u.id === req.session.userId);
    res.json({
        success: true,
        user: {
            id: user.id,
            email: user.email,
            role: user.role
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('API Error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `API endpoint ${req.method} ${req.path} not found`
    });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 HeritageLink Backend API running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`📱 Single File Deployment - Ready to use!`);
});

export default app;
```

3. **Click**: "Commit new file"

### Step 3: Create package.json
1. **Click**: "Add file" → "Create new file"
2. **Filename**: `package.json`
3. **Copy this content** and paste it:

```json
{
  "name": "heritagelink-backend-simple",
  "version": "1.0.0",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "express-session": "^1.17.3"
  }
}
```

4. **Click**: "Commit new file"

### Step 4: Deploy on Render
1. **Go to**: https://heritage3.onrender.com
2. **Click**: "Manual Deploy"
3. **Wait**: 3-5 minutes
4. **Test**: https://heritage3.onrender.com/health

---

## 🎯 Quick Summary

1. **Go to**: https://github.com/Bonuel12142005/heritage
2. **Create**: `server.js` (copy-paste the JavaScript code above)
3. **Create**: `package.json` (copy-paste the JSON code above)
4. **Deploy**: Go to Render and click "Manual Deploy"

**That's it! Your backend will be deployed!** 🚀