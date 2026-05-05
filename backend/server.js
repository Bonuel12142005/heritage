// HeritageLink Backend API Server
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Import routes
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import artisanRoutes from './routes/artisan.js';
import userRoutes from './routes/user.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS configuration for Firebase frontend
app.use(cors({
    origin: [
        'https://heritagelink-app.web.app',
        'https://heritagelink-app.firebaseapp.com',
        'http://localhost:3000',
        'http://localhost:5000'
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

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'HeritageLink Backend API',
        version: '1.0.0'
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/artisan', artisanRoutes);
app.use('/api/user', userRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'HeritageLink Backend API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            auth: '/api/auth',
            admin: '/api/admin',
            artisan: '/api/artisan',
            user: '/api/user'
        },
        frontend: 'https://heritagelink-app.web.app'
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
});

export default app;