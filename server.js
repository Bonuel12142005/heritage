// HeritageLink Unified Server - Frontend + Backend + MySQL Database
// Updated: 2026-05-05 - Fixed all template variables
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import multer from 'multer';
import fs from 'fs';
import ejs from 'ejs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// MySQL database setup
let db;

async function initializeDatabase() {
    try {
        console.log('🔄 Connecting to MySQL database...');
        console.log('📍 DB_HOST:', process.env.DB_HOST || 'localhost');
        console.log('📍 DB_PORT:', process.env.DB_PORT || 3306);
        console.log('📍 DB_USER:', process.env.DB_USER || 'root');
        console.log('📍 DB_NAME:', process.env.DB_NAME || 'heritagelink');
        
        // Check if we're connecting to Aiven (production)
        const isAiven = process.env.DB_HOST && process.env.DB_HOST.includes('aivencloud.com');
        
        // Create connection to MySQL
        const connectionConfig = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'heritagelink',
            charset: 'utf8mb4'
        };
        
        // Add SSL for Aiven production database
        if (isAiven) {
            connectionConfig.ssl = {
                rejectUnauthorized: false
            };
            console.log('🔒 Using SSL for Aiven connection');
        }
        
        db = await mysql.createConnection(connectionConfig);
        
        console.log('✅ MySQL database connected!');
        console.log(`📍 Connected to: ${connectionConfig.host}:${connectionConfig.port}/${connectionConfig.database}`);
        
        // Skip table creation - tables already exist from database import
        console.log('ℹ️  Skipping table creation (using imported database structure)');
        
        console.log('✅ Database initialized successfully!');
        return true;
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        console.error('Make sure MySQL is running and database "heritagelink" exists');
        return false;
    }
}

// Middleware
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'heritagelink-unified-secret-2024',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true
    }
}));

// Serve static files (CSS, JS, images)
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));

// Custom middleware for uploads - serve placeholder for missing files
app.use('/uploads', (req, res, next) => {
    const filePath = path.join(__dirname, 'public/uploads', req.path);
    
    // Check if file exists
    if (fs.existsSync(filePath)) {
        // File exists, serve it normally
        express.static(path.join(__dirname, 'public/uploads'))(req, res, next);
    } else {
        // File doesn't exist, serve placeholder SVG
        const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(req.path);
        
        if (isImage) {
            // Return placeholder SVG image
            res.setHeader('Content-Type', 'image/svg+xml');
            res.setHeader('Cache-Control', 'no-cache');
            res.send(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
                <rect fill="#f3f4f6" width="400" height="300"/>
                <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="18" fill="#9ca3af">
                    <tspan x="50%" dy="0">📁 File Not Found</tspan>
                </text>
                <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="14" fill="#6b7280">
                    <tspan x="50%" dy="0">This file was deleted during server restart</tspan>
                </text>
                <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="12" fill="#9ca3af">
                    <tspan x="50%" dy="0">Please re-upload or set up cloud storage</tspan>
                </text>
            </svg>`);
        } else {
            // For non-images, return 404
            res.status(404).send('File not found');
        }
    }
});

app.use('/assets', express.static(path.join(__dirname, 'public')));

// Debug route to check if uploads exist
app.get('/debug/uploads/:folder/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'public/uploads', req.params.folder, req.params.filename);
    const exists = fs.existsSync(filePath);
    res.json({
        path: filePath,
        exists: exists,
        cwd: __dirname,
        files: exists ? null : fs.readdirSync(path.join(__dirname, 'public/uploads', req.params.folder)).slice(0, 5)
    });
});

// Serve favicon
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/uploads/logo.jpg'));
});

// File upload configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, 'public/uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Authentication middleware
const requireAuth = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.redirect('/login');
    }
};

const requireRole = (role) => {
    return (req, res, next) => {
        if (req.session && req.session.user && req.session.user.role === role) {
            return next();
        } else {
            return res.status(403).send('Access denied');
        }
    };
};

// Template rendering function using EJS
function renderTemplate(templatePath, data = {}) {
    try {
        let template = fs.readFileSync(templatePath, 'utf8');
        
        // Use EJS to render the template directly
        const renderedTemplate = ejs.render(template, data, {
            filename: templatePath,
            rmWhitespace: false,
            debug: false
        });
        
        return renderedTemplate;
    } catch (error) {
        console.error('Template rendering error:', error);
        console.error('Template path:', templatePath);
        console.error('Data keys:', Object.keys(data));
        
        return `
            <h1>Template Error</h1>
            <p><strong>Error:</strong> ${error.message}</p>
            <p><strong>File:</strong> ${templatePath}</p>
            <p><strong>Debug:</strong> Check server console for details</p>
        `;
    }
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'HeritageLink Unified Server (SQLite)',
        version: '1.0.0',
        database: 'SQLite Connected',
        frontend: 'Integrated',
        backend: 'Active'
    });
});

// API Routes
// Authentication API
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }
        
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }
        
        const user = users[0];
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }
        
        req.session.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        };
        
        // Determine redirect URL based on role
        let redirect = '/dashboard';
        if (user.role === 'admin') {
            redirect = '/admin';
        } else if (user.role === 'artisan') {
            redirect = '/artisan';
        }
        
        res.json({
            success: true,
            message: 'Login successful',
            user: req.session.user,
            redirect: redirect
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error. Please try again.' 
        });
    }
});

app.post('/api/register', async (req, res) => {
    try {
        const { email, password, name, role } = req.body;
        
        // Validate input
        if (!email || !password || !name) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email, password, and name are required' 
            });
        }
        
        // Check if user already exists
        const [existingUsers] = await db.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );
        
        if (existingUsers.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already registered' 
            });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert new user
        const userRole = role || 'user'; // Default to 'user' if no role specified
        const [result] = await db.execute(
            'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
            [email, hashedPassword, name, userRole]
        );
        
        // Create session for the new user
        req.session.user = {
            id: result.insertId,
            email: email,
            name: name,
            role: userRole
        };
        
        // Determine redirect URL based on role
        let redirect = '/dashboard';
        if (userRole === 'admin') {
            redirect = '/admin';
        } else if (userRole === 'artisan') {
            redirect = '/artisan';
        }
        
        res.json({ 
            success: true, 
            message: 'Registration successful',
            user: req.session.user,
            redirect: redirect
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Registration failed. Please try again.' 
        });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }
        
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }
        
        const user = users[0];
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }
        
        req.session.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        };
        
        // Determine redirect URL based on role
        let redirectUrl = '/dashboard';
        if (user.role === 'admin') {
            redirectUrl = '/admin';
        } else if (user.role === 'artisan') {
            redirectUrl = '/artisan';
        }
        
        res.json({
            success: true,
            message: 'Login successful',
            user: req.session.user,
            redirectUrl: redirectUrl
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error. Please try again.' 
        });
    }
});

app.post('/api/auth/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true, message: 'Logged out successfully' });
});

// Admin API
app.get('/api/admin/dashboard', async (req, res) => {
    try {
        const [totalUsers] = await db.execute('SELECT COUNT(*) as count FROM users');
        const [totalDestinations] = await db.execute('SELECT COUNT(*) as count FROM destinations');
        const [totalArtisans] = await db.execute('SELECT COUNT(*) as count FROM users WHERE role = \'artisan\'');
        
        res.json({
            success: true,
            data: {
                totalUsers: totalUsers[0].count,
                totalDestinations: totalDestinations[0].count,
                totalArtisans: totalArtisans[0].count,
                totalEvents: 0
            }
        });
    } catch (error) {
        console.error('Admin dashboard error:', error);
        res.json({ success: false, message: 'Failed to load dashboard data' });
    }
});

// Admin stats API
app.get('/api/admin/stats', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        // Get counts for various entities
        const [users] = await db.execute('SELECT COUNT(*) as count FROM users');
        const [destinations] = await db.execute('SELECT COUNT(*) as count FROM destinations WHERE status = \'active\'');
        const [events] = await db.execute('SELECT COUNT(*) as count FROM events WHERE status = \'active\'');
        const [products] = await db.execute('SELECT COUNT(*) as count FROM artisan_products WHERE status = \'active\'');
        const [heritage] = await db.execute('SELECT COUNT(*) as count FROM heritage_gallery WHERE status = \'active\'');
        const [workshops] = await db.execute('SELECT COUNT(*) as count FROM workshops WHERE status = \'active\'');
        const [messages] = await db.execute('SELECT COUNT(*) as count FROM messages');
        const [reviews] = await db.execute('SELECT COUNT(*) as count FROM reviews');
        
        // Get recent activity
        const [recentUsers] = await db.execute('SELECT COUNT(*) as count FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)');
        const [recentDestinations] = await db.execute('SELECT COUNT(*) as count FROM destinations WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)');
        
        res.json({
            success: true,
            data: {
                totalUsers: users[0].count,
                totalDestinations: destinations[0].count,
                totalEvents: events[0].count,
                totalProducts: products[0].count,
                totalHeritage: heritage[0].count,
                totalWorkshops: workshops[0].count,
                totalMessages: messages[0].count,
                totalReviews: reviews[0].count,
                recentUsers: recentUsers[0].count,
                recentDestinations: recentDestinations[0].count
            }
        });
    } catch (error) {
        console.error('❌ Admin stats error:', error);
        res.status(500).json({ success: false, message: 'Failed to load stats' });
    }
});

// Notifications count API
app.get('/api/notifications/count', requireAuth, async (req, res) => {
    try {
        const userId = req.session.user.id;
        
        // Count unread messages
        const [messages] = await db.execute(
            'SELECT COUNT(*) as count FROM messages WHERE receiver_id = ? AND is_read = 0',
            [userId]
        );
        
        // Count unread notifications (if notifications table exists)
        let notifications = [{ count: 0 }];
        try {
            const [notifs] = await db.execute(
                'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0',
                [userId]
            );
            notifications = notifs;
        } catch (e) {
            // Notifications table might not exist, use 0
        }
        
        res.json({
            success: true,
            data: {
                messages: messages[0].count,
                notifications: notifications[0].count,
                total: messages[0].count + notifications[0].count
            }
        });
    } catch (error) {
        console.error('❌ Notifications count error:', error);
        res.status(500).json({ success: false, message: 'Failed to load notification count' });
    }
});

// Public API endpoints
app.get('/api/destinations', async (req, res) => {
    try {
        console.log('📍 API /api/destinations called');
        console.log('🔍 DB connection status:', db ? 'Connected' : 'Not connected');
        
        const [destinations] = await db.execute(
            "SELECT * FROM destinations WHERE status = 'active' ORDER BY name"
        );
        
        console.log(`✅ Found ${destinations.length} destinations`);
        
        res.json({
            success: true,
            data: destinations || []
        });
    } catch (error) {
        console.error('❌ API destinations error:', error.message);
        console.error('Error details:', error);
        res.json({ 
            success: false, 
            message: 'Failed to load destinations',
            data: [],
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

app.get('/api/events', async (req, res) => {
    try {
        const [events] = await db.execute(
            "SELECT * FROM events WHERE status = 'active' ORDER BY event_date DESC"
        );
        res.json({
            success: true,
            data: events || []
        });
    } catch (error) {
        console.error('API events error:', error);
        res.json({ 
            success: false, 
            message: 'Failed to load events',
            data: []
        });
    }
});

app.get('/api/products', async (req, res) => {
    try {
        const [products] = await db.execute(
            "SELECT * FROM artisan_products WHERE status = 'active' ORDER BY created_at DESC"
        );
        res.json({
            success: true,
            data: products || []
        });
    } catch (error) {
        console.error('API products error:', error);
        res.json({ 
            success: false, 
            message: 'Failed to load products',
            data: []
        });
    }
});

app.get('/api/heritage', async (req, res) => {
    try {
        const [items] = await db.execute(
            "SELECT * FROM heritage_items WHERE status = 'active' ORDER BY created_at DESC"
        );
        res.json({
            success: true,
            data: items || []
        });
    } catch (error) {
        console.error('API heritage error:', error);
        res.json({ 
            success: false, 
            message: 'Failed to load heritage items',
            data: []
        });
    }
});

app.get('/api/workshops', async (req, res) => {
    try {
        const [workshops] = await db.execute(
            'SELECT w.*, u.name as artisan_name FROM workshops w LEFT JOIN users u ON w.artisan_id = u.id WHERE w.status = \'active\' ORDER BY w.workshop_date ASC'
        );
        res.json({
            success: true,
            data: workshops || []
        });
    } catch (error) {
        console.error('API workshops error:', error);
        res.json({ 
            success: false, 
            message: 'Failed to load workshops',
            data: []
        });
    }
});

// Send message API
app.post('/api/messages/send', requireAuth, async (req, res) => {
    try {
        const { receiver_id, subject, message } = req.body;
        
        if (!receiver_id || !message) {
            return res.json({
                success: false,
                message: 'Receiver and message are required'
            });
        }
        
        console.log('📤 Sending message from', req.session.user.id, 'to', receiver_id);
        
        await db.execute(
            'INSERT INTO messages (sender_id, receiver_id, subject, message, is_read, created_at) VALUES (?, ?, ?, ?, FALSE, NOW())',
            [req.session.user.id, receiver_id, subject || 'No Subject', message]
        );
        
        console.log('✅ Message sent successfully');
        
        res.json({
            success: true,
            message: 'Message sent successfully'
        });
    } catch (error) {
        console.error('❌ Send message error:', error);
        res.json({
            success: false,
            message: 'Failed to send message: ' + error.message
        });
    }
});

// Get reviews for a destination
app.get('/api/destinations/:id/reviews', async (req, res) => {
    try {
        const destinationId = req.params.id;
        
        const [reviews] = await db.execute(
            'SELECT r.*, u.username, u.name, u.profile_photo FROM reviews r LEFT JOIN users u ON r.user_id = u.id WHERE r.destination_id = ? ORDER BY r.created_at DESC',
            [destinationId]
        );
        
        res.json({
            success: true,
            reviews: reviews || []
        });
    } catch (error) {
        console.error('❌ Reviews API error:', error);
        res.json({
            success: false,
            message: 'Failed to load reviews',
            reviews: []
        });
    }
});

// Placeholder image route
app.get('/placeholder-hero.jpg', (req, res) => {
    // Redirect to a default image or send a simple SVG placeholder
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(`<svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="400" fill="#0077B6"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">
            HeritageLink
        </text>
    </svg>`);
});

// Test route for EJS debugging
app.get('/test-ejs', (req, res) => {
    try {
        const templatePath = path.join(__dirname, 'test-template.ejs');
        const html = renderTemplate(templatePath, {
            title: 'EJS Test',
            name: 'World',
            user: req.session.user ? req.session.user.name : null
        });
        res.send(html);
    } catch (error) {
        res.send(`<h1>EJS Test Error</h1><pre>${error.message}</pre>`);
    }
});

// Frontend Routes - Serve .xian templates
app.get('/', (req, res) => {
    const templatePath = path.join(__dirname, 'views/home.xian');
    const html = renderTemplate(templatePath, {
        title: 'HeritageLink - Discover Gloria, Oriental Mindoro',
        user: req.session.user
    });
    res.send(html);
});

app.get('/login', (req, res) => {
    const templatePath = path.join(__dirname, 'views/login.xian');
    const html = renderTemplate(templatePath, {
        title: 'Login - HeritageLink',
        error: req.query.error || null
    });
    res.send(html);
});

// Handle login form submission
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.redirect('/login?error=Please enter both email and password');
        }
        
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.redirect('/login?error=Invalid email or password');
        }
        
        const user = users[0];
        
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return res.redirect('/login?error=Invalid email or password');
        }
        
        req.session.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        };
        
        // Redirect based on role
        if (user.role === 'admin') {
            res.redirect('/admin');
        } else if (user.role === 'artisan') {
            res.redirect('/artisan');
        } else {
            res.redirect('/dashboard');
        }
    } catch (error) {
        console.error('Login form error:', error);
        res.redirect('/login?error=Login failed. Please try again.');
    }
});

app.get('/register', (req, res) => {
    const templatePath = path.join(__dirname, 'views/register.xian');
    const html = renderTemplate(templatePath, {
        title: 'Register - HeritageLink'
    });
    res.send(html);
});

// Handle registration form submission
app.post('/register', async (req, res) => {
    try {
        const { email, password, name, role } = req.body;
        
        // Validate input
        if (!email || !password || !name) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email, password, and name are required' 
            });
        }
        
        // Check if user already exists
        const [existingUsers] = await db.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );
        
        if (existingUsers.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already registered' 
            });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert new user
        const userRole = role || 'user'; // Default to 'user' if no role specified
        const [result] = await db.execute(
            'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
            [email, hashedPassword, name, userRole]
        );
        
        // Create session for the new user
        req.session.user = {
            id: result.insertId,
            email: email,
            name: name,
            role: userRole
        };
        
        res.json({ 
            success: true, 
            message: 'Registration successful',
            redirect: userRole === 'admin' ? '/admin' : (userRole === 'artisan' ? '/artisan' : '/dashboard')
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Registration failed. Please try again.' 
        });
    }
});

// Password Reset Routes
app.get('/forgot-password', (req, res) => {
    const templatePath = path.join(__dirname, 'views/forgotpassword.xian');
    const html = renderTemplate(templatePath, {
        title: 'Forgot Password - HeritageLink'
    });
    res.send(html);
});

app.get('/reset-password', (req, res) => {
    const templatePath = path.join(__dirname, 'views/reset-password.xian');
    const html = renderTemplate(templatePath, {
        title: 'Reset Password - HeritageLink',
        token: req.query.token
    });
    res.send(html);
});

// Error page route
app.get('/error', (req, res) => {
    const templatePath = path.join(__dirname, 'views/error.xian');
    const html = renderTemplate(templatePath, {
        title: 'Error - HeritageLink',
        user: req.session.user,
        error: req.query.message || 'An error occurred'
    });
    res.send(html);
});

app.get('/admin', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        let totalUsers = 0;
        let totalDestinations = 0;
        let totalArtisans = 0;
        
        try {
            const [totalUsersResult] = await db.execute('SELECT COUNT(*) as count FROM users');
            totalUsers = totalUsersResult[0].count;
        } catch (error) {
            console.log('Users table not found or error:', error.message);
        }
        
        try {
            const [totalDestinationsResult] = await db.execute('SELECT COUNT(*) as count FROM destinations');
            totalDestinations = totalDestinationsResult[0].count;
        } catch (error) {
            console.log('Destinations table not found or error:', error.message);
        }
        
        try {
            const [totalArtisansResult] = await db.execute('SELECT COUNT(*) as count FROM users WHERE role = "artisan"');
            totalArtisans = totalArtisansResult[0].count;
        } catch (error) {
            console.log('Error counting artisans:', error.message);
        }
        
        const templatePath = path.join(__dirname, 'views/admin-dashboard.xian');
        const html = renderTemplate(templatePath, {
            title: 'Admin Dashboard - HeritageLink',
            user: req.session.user,
            totalUsers: totalUsers,
            totalDestinations: totalDestinations,
            totalArtisans: totalArtisans,
            totalEvents: 0,
            pendingReviews: 0
        });
        res.send(html);
    } catch (error) {
        console.error('Admin dashboard error:', error);
        res.status(500).send(`
            <h1>Error Loading Admin Dashboard</h1>
            <p>Database tables may not be initialized yet.</p>
            <p>Error: ${error.message}</p>
            <p><a href="/">Go to Homepage</a></p>
        `);
    }
});

// Alias route for /admin/dashboard
app.get('/admin/dashboard', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        let totalUsers = 0;
        let totalDestinations = 0;
        let totalArtisans = 0;
        
        try {
            const [totalUsersResult] = await db.execute('SELECT COUNT(*) as count FROM users');
            totalUsers = totalUsersResult[0].count;
        } catch (error) {
            console.log('Users table not found or error:', error.message);
        }
        
        try {
            const [totalDestinationsResult] = await db.execute('SELECT COUNT(*) as count FROM destinations');
            totalDestinations = totalDestinationsResult[0].count;
        } catch (error) {
            console.log('Destinations table not found or error:', error.message);
        }
        
        try {
            const [totalArtisansResult] = await db.execute('SELECT COUNT(*) as count FROM users WHERE role = "artisan"');
            totalArtisans = totalArtisansResult[0].count;
        } catch (error) {
            console.log('Error counting artisans:', error.message);
        }
        
        const templatePath = path.join(__dirname, 'views/admin-dashboard.xian');
        const html = renderTemplate(templatePath, {
            title: 'Admin Dashboard - HeritageLink',
            user: req.session.user,
            totalUsers: totalUsers,
            totalDestinations: totalDestinations,
            totalArtisans: totalArtisans,
            totalEvents: 0,
            pendingReviews: 0
        });
        res.send(html);
    } catch (error) {
        console.error('Admin dashboard error:', error);
        res.status(500).send(`
            <h1>Error Loading Admin Dashboard</h1>
            <p>Database tables may not be initialized yet.</p>
            <p>Error: ${error.message}</p>
            <p><a href="/">Go to Homepage</a></p>
        `);
    }
});

// Admin Users Management
app.get('/admin/users', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        // Fetch all users
        const [users] = await db.execute(
            'SELECT id, email, role, name, created_at FROM users ORDER BY created_at DESC'
        );
        
        const templatePath = path.join(__dirname, 'views/admin-users.xian');
        const html = renderTemplate(templatePath, {
            title: 'Manage Users - Admin',
            user: req.session.user,
            users: users || []
        });
        res.send(html);
    } catch (error) {
        console.error('Admin users error:', error);
        res.status(500).send('Error loading users');
    }
});

app.get('/admin/user/new', requireAuth, requireRole('admin'), (req, res) => {
    const templatePath = path.join(__dirname, 'views/admin-user-form.xian');
    const html = renderTemplate(templatePath, {
        title: 'Add New User - Admin',
        user: req.session.user,
        editMode: false
    });
    res.send(html);
});

app.get('/admin/user/:id/edit', requireAuth, requireRole('admin'), (req, res) => {
    const templatePath = path.join(__dirname, 'views/admin-user-form.xian');
    const html = renderTemplate(templatePath, {
        title: 'Edit User - Admin',
        user: req.session.user,
        editMode: true,
        userId: req.params.id
    });
    res.send(html);
});

// Admin Destinations Management
app.get('/admin/destinations', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        // Fetch all destinations
        const [destinations] = await db.execute(
            'SELECT * FROM destinations ORDER BY created_at DESC'
        );
        
        const templatePath = path.join(__dirname, 'views/admin-destinations.xian');
        const html = renderTemplate(templatePath, {
            title: 'Manage Destinations - Admin',
            user: req.session.user,
            destinations: destinations || []
        });
        res.send(html);
    } catch (error) {
        console.error('Admin destinations error:', error);
        res.status(500).send('Error loading destinations');
    }
});

app.get('/admin/destination/new', requireAuth, requireRole('admin'), (req, res) => {
    const templatePath = path.join(__dirname, 'views/admin-destination-form.xian');
    const html = renderTemplate(templatePath, {
        title: 'Add New Destination - Admin',
        user: req.session.user,
        editMode: false
    });
    res.send(html);
});

app.get('/admin/destination/:id/edit', requireAuth, requireRole('admin'), (req, res) => {
    const templatePath = path.join(__dirname, 'views/admin-destination-form.xian');
    const html = renderTemplate(templatePath, {
        title: 'Edit Destination - Admin',
        user: req.session.user,
        editMode: true,
        destinationId: req.params.id
    });
    res.send(html);
});

// Admin Events Management
app.get('/admin/events', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        // Fetch all events
        let events = [];
        try {
            const [eventsResult] = await db.execute(
                'SELECT * FROM events ORDER BY event_date DESC'
            );
            events = eventsResult;
        } catch (error) {
            console.log('Events table not found or error:', error.message);
            events = [];
        }
        
        const templatePath = path.join(__dirname, 'views/admin-events.xian');
        const html = renderTemplate(templatePath, {
            title: 'Manage Events - Admin',
            user: req.session.user,
            events: events
        });
        res.send(html);
    } catch (error) {
        console.error('Admin events error:', error);
        const templatePath = path.join(__dirname, 'views/admin-events.xian');
        const html = renderTemplate(templatePath, {
            title: 'Manage Events - Admin',
            user: req.session.user,
            events: []
        });
        res.send(html);
    }
});

app.get('/admin/event/new', requireAuth, requireRole('admin'), (req, res) => {
    const templatePath = path.join(__dirname, 'views/admin-event-form.xian');
    const html = renderTemplate(templatePath, {
        title: 'Add New Event - Admin',
        user: req.session.user,
        editMode: false,
        event: null
    });
    res.send(html);
});

// Alias route for /admin/events/add
app.get('/admin/events/add', requireAuth, requireRole('admin'), (req, res) => {
    const templatePath = path.join(__dirname, 'views/admin-event-form.xian');
    const html = renderTemplate(templatePath, {
        title: 'Add New Event - Admin',
        user: req.session.user,
        editMode: false,
        event: null
    });
    res.send(html);
});

app.get('/admin/event/:id/edit', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const eventId = req.params.id;
        
        // Fetch event details from database
        const [events] = await db.execute(
            'SELECT * FROM events WHERE id = ? LIMIT 1',
            [eventId]
        );
        
        if (!events || events.length === 0) {
            return res.status(404).send('Event not found');
        }
        
        const event = events[0];
        
        const templatePath = path.join(__dirname, 'views/admin-event-form.xian');
        const html = renderTemplate(templatePath, {
            title: 'Edit Event - Admin',
            user: req.session.user,
            editMode: true,
            eventId: req.params.id,
            event: event
        });
        res.send(html);
    } catch (error) {
        console.error('Error loading event for edit:', error);
        res.status(500).send('Error loading event');
    }
});

// Alias route for /admin/events/edit/:id
app.get('/admin/events/edit/:id', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const eventId = req.params.id;
        
        // Fetch event details from database
        const [events] = await db.execute(
            'SELECT * FROM events WHERE id = ? LIMIT 1',
            [eventId]
        );
        
        if (!events || events.length === 0) {
            return res.status(404).send('Event not found');
        }
        
        const event = events[0];
        
        const templatePath = path.join(__dirname, 'views/admin-event-form.xian');
        const html = renderTemplate(templatePath, {
            title: 'Edit Event - Admin',
            user: req.session.user,
            editMode: true,
            eventId: req.params.id,
            event: event
        });
        res.send(html);
    } catch (error) {
        console.error('Error loading event for edit:', error);
        res.status(500).send('Error loading event');
    }
});

// Save event (create or update)
app.post('/admin/events/save', requireAuth, requireRole('admin'), upload.single('event_image'), async (req, res) => {
    try {
        console.log('📝 Event save request body:', req.body);
        console.log('📎 Event save file:', req.file);
        
        const { id, title, description, event_date, event_time, location, organizer, category, price, capacity, status } = req.body;
        const eventImage = req.file ? `uploads/events/${req.file.filename}` : null;
        
        // Convert undefined to null for database
        const safeValue = (val) => val === undefined || val === '' ? null : val;
        
        // Validate required fields
        if (!title || !event_date || !event_time || !location || !organizer) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields: title, event_date, event_time, location, organizer' 
            });
        }
        
        if (id) {
            // Update existing event
            console.log('🔄 Updating event:', id);
            let updateQuery = 'UPDATE events SET title = ?, description = ?, event_date = ?, event_time = ?, location = ?, organizer = ?, category = ?, ticket_price = ?, max_attendees = ?, status = ?';
            let updateParams = [
                safeValue(title), 
                safeValue(description), 
                safeValue(event_date), 
                safeValue(event_time), 
                safeValue(location), 
                safeValue(organizer), 
                safeValue(category) || 'cultural', 
                safeValue(price) || 0, 
                safeValue(capacity) || 0, 
                safeValue(status) || 'active'
            ];
            
            if (eventImage) {
                updateQuery += ', image_url = ?';
                updateParams.push(eventImage);
            }
            
            updateQuery += ' WHERE id = ?';
            updateParams.push(id);
            
            console.log('📊 Update query:', updateQuery);
            console.log('📊 Update params:', updateParams);
            
            await db.execute(updateQuery, updateParams);
            console.log('✅ Event updated:', id);
            res.json({ success: true, message: 'Event updated successfully', eventId: id });
        } else {
            // Create new event
            console.log('➕ Creating new event');
            const insertQuery = 'INSERT INTO events (title, description, event_date, event_time, location, organizer, category, ticket_price, max_attendees, status, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const insertParams = [
                safeValue(title),
                safeValue(description),
                safeValue(event_date),
                safeValue(event_time),
                safeValue(location),
                safeValue(organizer),
                safeValue(category) || 'cultural',
                safeValue(price) || 0,
                safeValue(capacity) || 0,
                safeValue(status) || 'active',
                eventImage
            ];
            
            console.log('📊 Insert query:', insertQuery);
            console.log('📊 Insert params:', insertParams);
            
            const [result] = await db.execute(insertQuery, insertParams);
            console.log('✅ Event created:', result.insertId);
            res.json({ success: true, message: 'Event created successfully', eventId: result.insertId });
        }
    } catch (error) {
        console.error('❌ Error saving event:', error);
        console.error('❌ Error stack:', error.stack);
        res.status(500).json({ success: false, message: 'Failed to save event: ' + error.message });
    }
});

// Admin Heritage Management
app.get('/admin/heritage', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        // Fetch all heritage items
        let items = [];
        try {
            const [itemsResult] = await db.execute(
                'SELECT * FROM heritage_items ORDER BY created_at DESC'
            );
            items = itemsResult;
        } catch (error) {
            console.log('Heritage items table not found or error:', error.message);
            items = [];
        }
        
        // Calculate stats
        const stats = {
            total: items.length,
            photos: items.filter(item => item.media_type === 'photo').length,
            videos: items.filter(item => item.media_type === 'video').length,
            audio: items.filter(item => item.media_type === 'audio').length,
            documents: items.filter(item => item.media_type === 'document').length
        };
        
        const templatePath = path.join(__dirname, 'views/admin-heritage-gallery.xian');
        const html = renderTemplate(templatePath, {
            title: 'Manage Heritage - Admin',
            user: req.session.user,
            items: items,
            stats: stats
        });
        res.send(html);
    } catch (error) {
        console.error('Admin heritage error:', error);
        const templatePath = path.join(__dirname, 'views/admin-heritage-gallery.xian');
        const html = renderTemplate(templatePath, {
            title: 'Manage Heritage - Admin',
            user: req.session.user,
            items: [],
            stats: { total: 0, photos: 0, videos: 0, audio: 0, documents: 0 }
        });
        res.send(html);
    }
});

// Alias route for heritage-gallery
app.get('/admin/heritage-gallery', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        // Fetch all heritage items
        let items = [];
        try {
            const [itemsResult] = await db.execute(
                'SELECT * FROM heritage_items ORDER BY created_at DESC'
            );
            items = itemsResult;
        } catch (error) {
            console.log('Heritage items table not found or error:', error.message);
            items = [];
        }
        
        // Calculate stats
        const stats = {
            total: items.length,
            photos: items.filter(item => item.media_type === 'photo').length,
            videos: items.filter(item => item.media_type === 'video').length,
            audio: items.filter(item => item.media_type === 'audio').length,
            documents: items.filter(item => item.media_type === 'document').length
        };
        
        const templatePath = path.join(__dirname, 'views/admin-heritage-gallery.xian');
        const html = renderTemplate(templatePath, {
            title: 'Heritage Gallery - Admin',
            user: req.session.user,
            items: items,
            stats: stats
        });
        res.send(html);
    } catch (error) {
        console.error('Admin heritage gallery error:', error);
        const templatePath = path.join(__dirname, 'views/admin-heritage-gallery.xian');
        const html = renderTemplate(templatePath, {
            title: 'Heritage Gallery - Admin',
            user: req.session.user,
            items: [],
            stats: { total: 0, photos: 0, videos: 0, audio: 0, documents: 0 }
        });
        res.send(html);
    }
});

app.get('/admin/heritage/new', requireAuth, requireRole('admin'), (req, res) => {
    const templatePath = path.join(__dirname, 'views/admin-heritage-form.xian');
    const html = renderTemplate(templatePath, {
        title: 'Add Heritage Item - Admin',
        user: req.session.user,
        editMode: false,
        item: null
    });
    res.send(html);
});

app.get('/admin/heritage/:id/edit', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const heritageId = req.params.id;
        
        // Fetch heritage item details from database
        const [items] = await db.execute(
            'SELECT * FROM heritage_gallery WHERE id = ? LIMIT 1',
            [heritageId]
        );
        
        if (!items || items.length === 0) {
            return res.status(404).send('Heritage item not found');
        }
        
        const heritageItem = items[0];
        
        const templatePath = path.join(__dirname, 'views/admin-heritage-form.xian');
        const html = renderTemplate(templatePath, {
            title: 'Edit Heritage Item - Admin',
            user: req.session.user,
            editMode: true,
            heritageId: req.params.id,
            item: heritageItem
        });
        res.send(html);
    } catch (error) {
        console.error('Error loading heritage item for edit:', error);
        res.status(500).send('Error loading heritage item');
    }
});

// Alias route for /admin/heritage-gallery/edit/:id
app.get('/admin/heritage-gallery/edit/:id', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const heritageId = req.params.id;
        
        // Fetch heritage item details from database
        const [items] = await db.execute(
            'SELECT * FROM heritage_gallery WHERE id = ? LIMIT 1',
            [heritageId]
        );
        
        if (!items || items.length === 0) {
            return res.status(404).send('Heritage item not found');
        }
        
        const heritageItem = items[0];
        
        const templatePath = path.join(__dirname, 'views/admin-heritage-form.xian');
        const html = renderTemplate(templatePath, {
            title: 'Edit Heritage Item - Admin',
            user: req.session.user,
            editMode: true,
            heritageId: req.params.id,
            item: heritageItem
        });
        res.send(html);
    } catch (error) {
        console.error('Error loading heritage item for edit:', error);
        res.status(500).send('Error loading heritage item');
    }
});

// Save heritage item (create or update)
app.post('/admin/heritage-gallery/save', requireAuth, requireRole('admin'), upload.single('media_file'), async (req, res) => {
    try {
        console.log('📝 Heritage save request body:', req.body);
        console.log('📎 Heritage save file:', req.file);
        
        const { id, title, description, category, media_type, historical_date, location, contributor_name, source, tags, status } = req.body;
        const mediaFile = req.file ? `uploads/heritage/${req.file.filename}` : null;
        
        // Convert undefined to null for database
        const safeValue = (val) => val === undefined || val === '' ? null : val;
        
        // Validate required fields
        if (!title) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required field: title' 
            });
        }
        
        if (id) {
            // Update existing heritage item
            console.log('🔄 Updating heritage item:', id);
            let updateQuery = 'UPDATE heritage_gallery SET title = ?, description = ?, category = ?, media_type = ?, historical_date = ?, location = ?, contributor_name = ?, source = ?, tags = ?, status = ?';
            let updateParams = [
                safeValue(title), 
                safeValue(description), 
                safeValue(category) || 'traditional_crafts', 
                safeValue(media_type) || 'photo', 
                safeValue(historical_date), 
                safeValue(location), 
                safeValue(contributor_name), 
                safeValue(source), 
                safeValue(tags), 
                safeValue(status) || 'active'
            ];
            
            if (mediaFile) {
                updateQuery += ', media_url = ?';
                updateParams.push(mediaFile);
            }
            
            updateQuery += ' WHERE id = ?';
            updateParams.push(id);
            
            console.log('📊 Update query:', updateQuery);
            console.log('📊 Update params:', updateParams);
            
            await db.execute(updateQuery, updateParams);
            console.log('✅ Heritage item updated:', id);
            res.json({ success: true, message: 'Heritage item updated successfully', itemId: id });
        } else {
            // Create new heritage item
            console.log('➕ Creating new heritage item');
            const insertQuery = 'INSERT INTO heritage_gallery (title, description, category, media_type, historical_date, location, contributor_name, source, tags, status, media_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const insertParams = [
                safeValue(title),
                safeValue(description),
                safeValue(category) || 'traditional_crafts',
                safeValue(media_type) || 'photo',
                safeValue(historical_date),
                safeValue(location),
                safeValue(contributor_name),
                safeValue(source),
                safeValue(tags),
                safeValue(status) || 'active',
                mediaFile
            ];
            
            console.log('📊 Insert query:', insertQuery);
            console.log('📊 Insert params:', insertParams);
            
            const [result] = await db.execute(insertQuery, insertParams);
            console.log('✅ Heritage item created:', result.insertId);
            res.json({ success: true, message: 'Heritage item created successfully', itemId: result.insertId });
        }
    } catch (error) {
        console.error('❌ Error saving heritage item:', error);
        console.error('❌ Error stack:', error.stack);
        res.status(500).json({ success: false, message: 'Failed to save heritage item: ' + error.message });
    }
});

// Admin Map Places Management
app.get('/admin/map-places', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        // Fetch all map places
        let places = [];
        try {
            const [placesResult] = await db.execute(
                'SELECT * FROM map_places ORDER BY created_at DESC'
            );
            places = placesResult;
        } catch (error) {
            console.log('Map places table not found or error:', error.message);
            places = [];
        }
        
        const templatePath = path.join(__dirname, 'views/admin-map-places.xian');
        const html = renderTemplate(templatePath, {
            title: 'Manage Map Places - Admin',
            user: req.session.user,
            places: places
        });
        res.send(html);
    } catch (error) {
        console.error('Admin map places error:', error);
        const templatePath = path.join(__dirname, 'views/admin-map-places.xian');
        const html = renderTemplate(templatePath, {
            title: 'Manage Map Places - Admin',
            user: req.session.user,
            places: []
        });
        res.send(html);
    }
});

app.get('/admin/map-place/new', requireAuth, requireRole('admin'), (req, res) => {
    const templatePath = path.join(__dirname, 'views/admin-map-place-form.xian');
    const html = renderTemplate(templatePath, {
        title: 'Add Map Place - Admin',
        user: req.session.user,
        editMode: false
    });
    res.send(html);
});

app.get('/admin/map-place/:id/edit', requireAuth, requireRole('admin'), (req, res) => {
    const templatePath = path.join(__dirname, 'views/admin-map-place-form.xian');
    const html = renderTemplate(templatePath, {
        title: 'Edit Map Place - Admin',
        user: req.session.user,
        editMode: true,
        placeId: req.params.id
    });
    res.send(html);
});

// Admin Messages & Feedback
app.get('/admin/messages', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        // Fetch all messages
        let messages = [];
        try {
            const [messagesResult] = await db.execute(
                'SELECT * FROM messages ORDER BY created_at DESC'
            );
            messages = messagesResult;
        } catch (error) {
            console.log('Messages table not found or error:', error.message);
            messages = [];
        }
        
        const templatePath = path.join(__dirname, 'views/admin-messages.xian');
        const html = renderTemplate(templatePath, {
            title: 'Messages - Admin',
            user: req.session.user,
            messages: messages
        });
        res.send(html);
    } catch (error) {
        console.error('Admin messages error:', error);
        const templatePath = path.join(__dirname, 'views/admin-messages.xian');
        const html = renderTemplate(templatePath, {
            title: 'Messages - Admin',
            user: req.session.user,
            messages: []
        });
        res.send(html);
    }
});

app.get('/admin/feedback', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        // Get filter from query params
        const currentStatus = req.query.status || 'all';
        
        // Fetch all feedback
        let feedback = [];
        try {
            const [feedbackResult] = await db.execute(
                'SELECT * FROM feedback ORDER BY created_at DESC'
            );
            feedback = feedbackResult;
        } catch (error) {
            console.log('Feedback table not found or error:', error.message);
            feedback = [];
        }
        
        // Calculate stats
        const stats = {
            total: feedback.length,
            pending: feedback.filter(f => f.status === 'pending').length,
            reviewed: feedback.filter(f => f.status === 'reviewed').length,
            avg_rating: feedback.length > 0 ? (feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / feedback.length) : 0
        };
        
        const templatePath = path.join(__dirname, 'views/admin-feedback.xian');
        const html = renderTemplate(templatePath, {
            title: 'User Feedback - Admin',
            user: req.session.user,
            feedback: feedback,
            stats: stats,
            currentStatus: currentStatus
        });
        res.send(html);
    } catch (error) {
        console.error('Admin feedback error:', error);
        const templatePath = path.join(__dirname, 'views/admin-feedback.xian');
        const html = renderTemplate(templatePath, {
            title: 'User Feedback - Admin',
            user: req.session.user,
            feedback: [],
            stats: { total: 0, pending: 0, reviewed: 0, avg_rating: 0 },
            currentStatus: 'all'
        });
        res.send(html);
    }
});

// Admin Analytics & Reports
app.get('/admin/analytics', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        let totalUsers = 0;
        let totalDestinations = 0;
        let totalEvents = 0;
        let totalProducts = 0;
        let monthlyUsers = [];
        let popularDestinations = [];
        
        try {
            const [usersResult] = await db.execute('SELECT COUNT(*) as count FROM users');
            totalUsers = usersResult[0].count;
        } catch (error) {
            console.log('Users table error:', error.message);
        }
        
        try {
            const [destinationsResult] = await db.execute('SELECT COUNT(*) as count FROM destinations');
            totalDestinations = destinationsResult[0].count;
        } catch (error) {
            console.log('Destinations table error:', error.message);
        }
        
        try {
            const [eventsResult] = await db.execute('SELECT COUNT(*) as count FROM events');
            totalEvents = eventsResult[0].count;
        } catch (error) {
            console.log('Events table error:', error.message);
        }
        
        try {
            const [productsResult] = await db.execute('SELECT COUNT(*) as count FROM artisan_products');
            totalProducts = productsResult[0].count;
        } catch (error) {
            console.log('Products table error:', error.message);
        }
        
        // Get monthly user growth data
        try {
            const [monthlyResult] = await db.execute(`
                SELECT 
                    DATE_FORMAT(created_at, '%Y-%m') as month,
                    COUNT(*) as count
                FROM users
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
                GROUP BY DATE_FORMAT(created_at, '%Y-%m')
                ORDER BY month ASC
            `);
            monthlyUsers = monthlyResult;
        } catch (error) {
            console.log('Monthly users query error:', error.message);
            monthlyUsers = [];
        }
        
        // Get popular destinations (by views or favorites)
        try {
            const [popularResult] = await db.execute(`
                SELECT 
                    id,
                    name,
                    location,
                    views
                FROM destinations
                ORDER BY views DESC
                LIMIT 10
            `);
            popularDestinations = popularResult;
        } catch (error) {
            console.log('Popular destinations query error:', error.message);
            // Try without views column if it doesn't exist
            try {
                const [fallbackResult] = await db.execute(`
                    SELECT 
                        id,
                        name,
                        location
                    FROM destinations
                    LIMIT 10
                `);
                popularDestinations = fallbackResult.map(d => ({ ...d, views: 0 }));
            } catch (fallbackError) {
                console.log('Fallback destinations query error:', fallbackError.message);
                popularDestinations = [];
            }
        }
        
        const metrics = {
            totalUsers: totalUsers,
            totalDestinations: totalDestinations,
            totalEvents: totalEvents,
            totalProducts: totalProducts,
            totalRevenue: 0,
            activeUsers: 0
        };
        
        const templatePath = path.join(__dirname, 'views/admin-analytics.xian');
        const html = renderTemplate(templatePath, {
            title: 'Analytics - Admin',
            user: req.session.user,
            metrics: metrics,
            monthlyUsers: monthlyUsers,
            popularDestinations: popularDestinations
        });
        res.send(html);
    } catch (error) {
        console.error('Admin analytics error:', error);
        res.send(renderTemplate(path.join(__dirname, 'views/admin-analytics.xian'), {
            title: 'Analytics - Admin',
            user: req.session.user,
            metrics: { totalUsers: 0, totalDestinations: 0, totalEvents: 0, totalProducts: 0, totalRevenue: 0, activeUsers: 0 },
            monthlyUsers: [],
            popularDestinations: []
        }));
    }
});

// Admin Moderation
app.get('/admin/moderate', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        let pendingReviews = [];
        let pendingProducts = [];
        
        try {
            const [reviewsResult] = await db.execute(
                'SELECT * FROM reviews WHERE status = "pending" ORDER BY created_at DESC'
            );
            pendingReviews = reviewsResult;
        } catch (error) {
            console.log('Reviews table error:', error.message);
        }
        
        try {
            const [productsResult] = await db.execute(
                'SELECT * FROM artisan_products WHERE status = "pending" ORDER BY created_at DESC'
            );
            pendingProducts = productsResult;
        } catch (error) {
            console.log('Products table error:', error.message);
        }
        
        const templatePath = path.join(__dirname, 'views/admin-moderate.xian');
        const html = renderTemplate(templatePath, {
            title: 'Content Moderation - Admin',
            user: req.session.user,
            pendingReviews: pendingReviews,
            pendingProducts: pendingProducts
        });
        res.send(html);
    } catch (error) {
        console.error('Admin moderate error:', error);
        res.send(renderTemplate(path.join(__dirname, 'views/admin-moderate.xian'), {
            title: 'Content Moderation - Admin',
            user: req.session.user,
            pendingReviews: [],
            pendingProducts: []
        }));
    }
});

// Admin Settings
app.get('/admin/settings', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        let settings = {
            site_title: 'HeritageLink',
            contact_email: 'admin@heritagelink.com',
            site_description: 'Discover Gloria, Oriental Mindoro',
            maintenance_mode: false
        };
        
        try {
            const [settingsResult] = await db.execute('SELECT * FROM settings LIMIT 1');
            if (settingsResult.length > 0) {
                settings = settingsResult[0];
            }
        } catch (error) {
            console.log('Settings table error:', error.message);
        }
        
        const templatePath = path.join(__dirname, 'views/admin-settings.xian');
        const html = renderTemplate(templatePath, {
            title: 'System Settings - Admin',
            user: req.session.user,
            settings: settings
        });
        res.send(html);
    } catch (error) {
        console.error('Admin settings error:', error);
        res.send(renderTemplate(path.join(__dirname, 'views/admin-settings.xian'), {
            title: 'System Settings - Admin',
            user: req.session.user,
            settings: { site_title: 'HeritageLink', contact_email: 'admin@heritagelink.com', site_description: 'Discover Gloria, Oriental Mindoro', maintenance_mode: false }
        }));
    }
});

app.get('/artisan', requireAuth, requireRole('artisan'), async (req, res) => {
    try {
        const artisanId = req.session.user.id;
        
        // Get product count
        const [productResult] = await db.execute(
            'SELECT COUNT(*) as count FROM artisan_products WHERE artisan_id = ? AND status = "active"',
            [artisanId]
        );
        
        // Get order count (if orders table exists)
        let orderCount = 0;
        try {
            const [orderResult] = await db.execute(
                'SELECT COUNT(*) as count FROM orders WHERE artisan_id = ? AND status = "pending"',
                [artisanId]
            );
            orderCount = orderResult[0].count;
        } catch (error) {
            // Orders table might not exist
            orderCount = 0;
        }
        
        const templatePath = path.join(__dirname, 'views/artisan-dashboard.xian');
        const html = renderTemplate(templatePath, {
            title: 'Artisan Dashboard - HeritageLink',
            user: req.session.user,
            productCount: productResult[0].count,
            orderCount: orderCount,
            reviewCount: 12,
            earnings: 15750
        });
        res.send(html);
    } catch (error) {
        console.error('Artisan dashboard error:', error);
        const templatePath = path.join(__dirname, 'views/artisan-dashboard.xian');
        const html = renderTemplate(templatePath, {
            title: 'Artisan Dashboard - HeritageLink',
            user: req.session.user,
            productCount: 0,
            orderCount: 0,
            reviewCount: 0,
            earnings: 0
        });
        res.send(html);
    }
});

// Artisan Profile Management
app.get('/artisan/profile', requireAuth, requireRole('artisan'), async (req, res) => {
    try {
        const artisanId = req.session.user.id;
        
        // Fetch artisan profile data
        const [users] = await db.execute(
            'SELECT * FROM users WHERE id = ?',
            [artisanId]
        );
        
        const user = users[0] || req.session.user;
        
        const templatePath = path.join(__dirname, 'views/artisan-profile.xian');
        const html = renderTemplate(templatePath, {
            title: 'My Profile - Artisan',
            user: user
        });
        res.send(html);
    } catch (error) {
        console.error('Error loading artisan profile:', error);
        res.status(500).send('Error loading profile');
    }
});

// Update artisan profile
app.post('/artisan/profile', requireAuth, requireRole('artisan'), upload.single('profile_photo'), async (req, res) => {
    try {
        console.log('📝 Profile update request body:', req.body);
        console.log('📎 Profile photo:', req.file);
        
        const artisanId = req.session.user.id;
        const { name, email, phone, bio, specialization, business_name, address } = req.body;
        
        // Handle profile photo upload
        const profilePhoto = req.file ? `uploads/profiles/${req.file.filename}` : null;
        
        // Convert undefined to null for database
        const safeValue = (val) => val === undefined || val === '' ? null : val;
        
        // Validate required fields
        if (!name || !email) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name and email are required' 
            });
        }
        
        // Build update query with only existing columns
        let updateQuery = 'UPDATE users SET name = ?, email = ?, phone = ?, bio = ?, specialization = ?, business_name = ?, address = ?';
        let updateParams = [
            safeValue(name),
            safeValue(email),
            safeValue(phone),
            safeValue(bio),
            safeValue(specialization),
            safeValue(business_name),
            safeValue(address)
        ];
        
        // If new photo uploaded, update photo field
        if (profilePhoto) {
            updateQuery += ', profile_photo = ?';
            updateParams.push(profilePhoto);
        }
        
        updateQuery += ' WHERE id = ?';
        updateParams.push(artisanId);
        
        console.log('📊 Update query:', updateQuery);
        console.log('📊 Update params:', updateParams);
        
        await db.execute(updateQuery, updateParams);
        
        // Update session data
        req.session.user.name = name;
        req.session.user.email = email;
        
        console.log('✅ Profile updated for artisan:', artisanId);
        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        console.error('❌ Error updating profile:', error);
        console.error('❌ Error stack:', error.stack);
        res.status(500).json({ success: false, message: 'Failed to update profile: ' + error.message });
    }
});

// Artisan Products Management
app.get('/artisan/products', requireAuth, requireRole('artisan'), async (req, res) => {
    try {
        // Fetch products for the current artisan
        const [products] = await db.execute(
            'SELECT * FROM artisan_products WHERE artisan_id = ? ORDER BY created_at DESC',
            [req.session.user.id]
        );
        
        const templatePath = path.join(__dirname, 'views/artisan-products.xian');
        const html = renderTemplate(templatePath, {
            title: 'My Products - Artisan',
            user: req.session.user,
            products: products || []
        });
        res.send(html);
    } catch (error) {
        console.error('Artisan products error:', error);
        res.status(500).send('Error loading products');
    }
});

app.get('/artisan/product/new', requireAuth, requireRole('artisan'), (req, res) => {
    const templatePath = path.join(__dirname, 'views/artisan-product-form.xian');
    const html = renderTemplate(templatePath, {
        title: 'Add New Product - Artisan',
        user: req.session.user,
        editMode: false,
        product: null
    });
    res.send(html);
});

app.get('/artisan/product/:id/edit', requireAuth, requireRole('artisan'), async (req, res) => {
    try {
        const productId = req.params.id;
        const artisanId = req.session.user.id;
        
        // Fetch the product from database
        const [products] = await db.execute(
            'SELECT * FROM artisan_products WHERE id = ? AND artisan_id = ?',
            [productId, artisanId]
        );
        
        if (products.length === 0) {
            return res.status(404).send('Product not found or you do not have permission to edit it');
        }
        
        const product = products[0];
        
        const templatePath = path.join(__dirname, 'views/artisan-product-form.xian');
        const html = renderTemplate(templatePath, {
            title: 'Edit Product - Artisan',
            user: req.session.user,
            editMode: true,
            product: product,
            productId: productId
        });
        res.send(html);
    } catch (error) {
        console.error('Error loading product for edit:', error);
        res.status(500).send('Error loading product');
    }
});

// Alias route for /artisan/products/edit/:id
app.get('/artisan/products/edit/:id', requireAuth, requireRole('artisan'), async (req, res) => {
    try {
        const productId = req.params.id;
        const artisanId = req.session.user.id;
        
        // Fetch the product from database
        const [products] = await db.execute(
            'SELECT * FROM artisan_products WHERE id = ? AND artisan_id = ?',
            [productId, artisanId]
        );
        
        if (products.length === 0) {
            return res.status(404).send('Product not found or you do not have permission to edit it');
        }
        
        const product = products[0];
        
        const templatePath = path.join(__dirname, 'views/artisan-product-form.xian');
        const html = renderTemplate(templatePath, {
            title: 'Edit Product - Artisan',
            user: req.session.user,
            editMode: true,
            product: product,
            productId: productId
        });
        res.send(html);
    } catch (error) {
        console.error('Error loading product for edit:', error);
        res.status(500).send('Error loading product');
    }
});

// Save artisan product (create or update)
app.post('/artisan/products/save', requireAuth, requireRole('artisan'), upload.array('images', 5), async (req, res) => {
    try {
        console.log('📝 Product save request body:', req.body);
        console.log('📎 Product save files:', req.files);
        
        const { id, name, description, category, price_range, external_link, status } = req.body;
        const artisanId = req.session.user.id;
        
        // Handle multiple image uploads
        let images = [];
        if (req.files && req.files.length > 0) {
            images = req.files.map(file => `uploads/products/${file.filename}`);
        }
        
        // Convert undefined to null for database
        const safeValue = (val) => val === undefined || val === '' ? null : val;
        
        // Validate required fields
        if (!name) {
            return res.status(400).json({ 
                success: false, 
                message: 'Product name is required' 
            });
        }
        
        if (id) {
            // Update existing product
            console.log('🔄 Updating product:', id);
            let updateQuery = 'UPDATE artisan_products SET name = ?, description = ?, category = ?, price_range = ?, external_link = ?';
            let updateParams = [
                safeValue(name), 
                safeValue(description), 
                safeValue(category), 
                safeValue(price_range), 
                safeValue(external_link)
            ];
            
            // If new images uploaded, update images field
            if (images.length > 0) {
                updateQuery += ', images = ?';
                updateParams.push(JSON.stringify(images));
            }
            
            updateQuery += ' WHERE id = ? AND artisan_id = ?';
            updateParams.push(id, artisanId);
            
            console.log('📊 Update query:', updateQuery);
            console.log('📊 Update params:', updateParams);
            
            await db.execute(updateQuery, updateParams);
            console.log('✅ Product updated:', id);
            res.json({ success: true, message: 'Product updated successfully', productId: id });
        } else {
            // Create new product
            console.log('➕ Creating new product');
            const insertQuery = 'INSERT INTO artisan_products (artisan_id, name, description, category, price_range, external_link, images) VALUES (?, ?, ?, ?, ?, ?, ?)';
            const insertParams = [
                artisanId,
                safeValue(name),
                safeValue(description),
                safeValue(category),
                safeValue(price_range),
                safeValue(external_link),
                images.length > 0 ? JSON.stringify(images) : null
            ];
            
            console.log('📊 Insert query:', insertQuery);
            console.log('📊 Insert params:', insertParams);
            
            const [result] = await db.execute(insertQuery, insertParams);
            console.log('✅ Product created:', result.insertId);
            res.json({ success: true, message: 'Product created successfully', productId: result.insertId });
        }
    } catch (error) {
        console.error('❌ Error saving product:', error);
        console.error('❌ Error stack:', error.stack);
        res.status(500).json({ success: false, message: 'Failed to save product: ' + error.message });
    }
});

// Artisan Workshop Forms
app.get('/artisan/workshop/new', requireAuth, requireRole('artisan'), (req, res) => {
    const templatePath = path.join(__dirname, 'views/artisan-workshop-form.xian');
    const html = renderTemplate(templatePath, {
        title: 'Create Workshop - Artisan',
        user: req.session.user,
        editMode: false,
        workshop: null
    });
    res.send(html);
});

app.get('/artisan/workshop/:id/edit', requireAuth, requireRole('artisan'), async (req, res) => {
    try {
        const workshopId = req.params.id;
        const artisanId = req.session.user.id;
        
        // Fetch the workshop from database
        const [workshops] = await db.execute(
            'SELECT * FROM workshops WHERE id = ? AND artisan_id = ?',
            [workshopId, artisanId]
        );
        
        if (workshops.length === 0) {
            return res.status(404).send('Workshop not found or you do not have permission to edit it');
        }
        
        const workshop = workshops[0];
        
        const templatePath = path.join(__dirname, 'views/artisan-workshop-form.xian');
        const html = renderTemplate(templatePath, {
            title: 'Edit Workshop - Artisan',
            user: req.session.user,
            editMode: true,
            workshop: workshop,
            workshopId: workshopId
        });
        res.send(html);
    } catch (error) {
        console.error('Error loading workshop for edit:', error);
        res.status(500).send('Error loading workshop');
    }
});

// Alias route for /artisan/workshops/edit/:id
app.get('/artisan/workshops/edit/:id', requireAuth, requireRole('artisan'), async (req, res) => {
    try {
        const workshopId = req.params.id;
        const artisanId = req.session.user.id;
        
        // Fetch the workshop from database
        const [workshops] = await db.execute(
            'SELECT * FROM workshops WHERE id = ? AND artisan_id = ?',
            [workshopId, artisanId]
        );
        
        if (workshops.length === 0) {
            return res.status(404).send('Workshop not found or you do not have permission to edit it');
        }
        
        const workshop = workshops[0];
        
        const templatePath = path.join(__dirname, 'views/artisan-workshop-form.xian');
        const html = renderTemplate(templatePath, {
            title: 'Edit Workshop - Artisan',
            user: req.session.user,
            editMode: true,
            workshop: workshop,
            workshopId: workshopId
        });
        res.send(html);
    } catch (error) {
        console.error('Error loading workshop for edit:', error);
        res.status(500).send('Error loading workshop');
    }
});

// Save workshop (create or update)
app.post('/artisan/workshops/save', requireAuth, requireRole('artisan'), upload.single('workshop_image'), async (req, res) => {
    try {
        console.log('📝 Workshop save request body:', req.body);
        console.log('📎 Workshop save file:', req.file);
        
        const { id, title, description, workshop_date, workshop_time, location, max_participants, fee, status } = req.body;
        const artisanId = req.session.user.id;
        
        // Handle image upload
        const workshopImage = req.file ? `uploads/workshops/${req.file.filename}` : null;
        
        // Convert undefined to null for database
        const safeValue = (val) => val === undefined || val === '' ? null : val;
        
        // Validate required fields
        if (!title || !workshop_date) {
            return res.status(400).json({ 
                success: false, 
                message: 'Title and workshop date are required' 
            });
        }
        
        if (id) {
            // Update existing workshop
            console.log('🔄 Updating workshop:', id);
            let updateQuery = 'UPDATE workshops SET title = ?, description = ?, workshop_date = ?, workshop_time = ?, location = ?, max_participants = ?, fee = ?, status = ?';
            let updateParams = [
                safeValue(title), 
                safeValue(description), 
                safeValue(workshop_date), 
                safeValue(workshop_time), 
                safeValue(location), 
                safeValue(max_participants) || 10, 
                safeValue(fee) || 0, 
                safeValue(status) || 'active'
            ];
            
            // If new image uploaded, update image field
            if (workshopImage) {
                updateQuery += ', image_url = ?';
                updateParams.push(workshopImage);
            }
            
            updateQuery += ' WHERE id = ? AND artisan_id = ?';
            updateParams.push(id, artisanId);
            
            console.log('📊 Update query:', updateQuery);
            console.log('📊 Update params:', updateParams);
            
            await db.execute(updateQuery, updateParams);
            console.log('✅ Workshop updated:', id);
            res.json({ success: true, message: 'Workshop updated successfully', workshopId: id });
        } else {
            // Create new workshop
            console.log('➕ Creating new workshop');
            const insertQuery = 'INSERT INTO workshops (artisan_id, title, description, workshop_date, workshop_time, location, max_participants, fee, status, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const insertParams = [
                artisanId,
                safeValue(title),
                safeValue(description),
                safeValue(workshop_date),
                safeValue(workshop_time),
                safeValue(location),
                safeValue(max_participants) || 10,
                safeValue(fee) || 0,
                safeValue(status) || 'active',
                workshopImage
            ];
            
            console.log('📊 Insert query:', insertQuery);
            console.log('📊 Insert params:', insertParams);
            
            const [result] = await db.execute(insertQuery, insertParams);
            console.log('✅ Workshop created:', result.insertId);
            res.json({ success: true, message: 'Workshop created successfully', workshopId: result.insertId });
        }
    } catch (error) {
        console.error('❌ Error saving workshop:', error);
        console.error('❌ Error stack:', error.stack);
        res.status(500).json({ success: false, message: 'Failed to save workshop: ' + error.message });
    }
});

// Artisan Messages - WITH DATA FETCHING
app.get('/artisan/messages', requireAuth, requireRole('artisan'), async (req, res) => {
    try {
        console.log('💬 Loading artisan messages for user:', req.session.user.id);
        
        // Fetch messages for the artisan (both sent and received)
        let conversations = [];
        let conversationMessages = [];
        
        try {
            const [messageResult] = await db.execute(
                'SELECT m.*, sender.name as sender_name, sender.profile_photo as sender_photo, receiver.name as receiver_name, receiver.profile_photo as receiver_photo FROM messages m LEFT JOIN users sender ON m.sender_id = sender.id LEFT JOIN users receiver ON m.receiver_id = receiver.id WHERE m.sender_id = ? OR m.receiver_id = ? ORDER BY m.created_at DESC',
                [req.session.user.id, req.session.user.id]
            );
            conversations = messageResult;
            conversationMessages = messageResult;
            console.log('✅ Found', messageResult.length, 'messages');
        } catch (error) {
            console.log('⚠️ Messages table error:', error.message);
            conversations = [];
            conversationMessages = [];
        }
        
        const templatePath = path.join(__dirname, 'views/artisan-messages.xian');
        const html = renderTemplate(templatePath, {
            title: 'Messages - Artisan',
            user: req.session.user,
            conversations: conversations,
            conversationMessages: conversationMessages
        });
        res.send(html);
    } catch (error) {
        console.error('❌ Artisan messages error:', error);
        const templatePath = path.join(__dirname, 'views/artisan-messages.xian');
        const html = renderTemplate(templatePath, {
            title: 'Messages - Artisan',
            user: req.session.user,
            conversations: [],
            conversationMessages: []
        });
        res.send(html);
    }
});

// Artisan Orders - WITH DATA FETCHING
app.get('/artisan/orders', requireAuth, requireRole('artisan'), async (req, res) => {
    try {
        // Fetch orders for the artisan (if orders table exists)
        let orders = [];
        try {
            const [orderResult] = await db.execute(`
                SELECT o.*, u.name as customer_name, ap.name as product_name 
                FROM orders o 
                JOIN users u ON o.user_id = u.id 
                JOIN artisan_products ap ON o.product_id = ap.id 
                WHERE ap.artisan_id = ? 
                ORDER BY o.created_at DESC
            `, [req.session.user.id]);
            orders = orderResult;
        } catch (error) {
            // Orders table might not exist
            orders = [];
        }
        
        const templatePath = path.join(__dirname, 'views/artisan-orders.xian');
        const html = renderTemplate(templatePath, {
            title: 'Orders - Artisan',
            user: req.session.user,
            orders: orders
        });
        res.send(html);
    } catch (error) {
        console.error('Artisan orders error:', error);
        const templatePath = path.join(__dirname, 'views/artisan-orders.xian');
        const html = renderTemplate(templatePath, {
            title: 'Orders - Artisan',
            user: req.session.user,
            orders: []
        });
        res.send(html);
    }
});

// Artisan Portfolio - WITH DATA FETCHING
app.get('/artisan/portfolio', requireAuth, requireRole('artisan'), async (req, res) => {
    try {
        // Fetch artisan's products for portfolio
        const [products] = await db.execute(
            'SELECT * FROM artisan_products WHERE artisan_id = ? ORDER BY created_at DESC',
            [req.session.user.id]
        );
        
        const templatePath = path.join(__dirname, 'views/artisan-portfolio.xian');
        const html = renderTemplate(templatePath, {
            title: 'My Portfolio - Artisan',
            user: req.session.user,
            portfolio: products || [],
            products: products || []
        });
        res.send(html);
    } catch (error) {
        console.error('Artisan portfolio error:', error);
        const templatePath = path.join(__dirname, 'views/artisan-portfolio.xian');
        const html = renderTemplate(templatePath, {
            title: 'My Portfolio - Artisan',
            user: req.session.user,
            portfolio: [],
            products: []
        });
        res.send(html);
    }
});

// Artisan Workshops - WITH DATA FETCHING
app.get('/artisan/workshops', requireAuth, requireRole('artisan'), async (req, res) => {
    try {
        // Fetch workshops for the artisan
        const [workshops] = await db.execute(
            'SELECT * FROM workshops WHERE artisan_id = ? ORDER BY workshop_date DESC',
            [req.session.user.id]
        );
        
        const templatePath = path.join(__dirname, 'views/artisan-workshops.xian');
        const html = renderTemplate(templatePath, {
            title: 'My Workshops - Artisan',
            user: req.session.user,
            workshops: workshops || []
        });
        res.send(html);
    } catch (error) {
        console.error('Artisan workshops error:', error);
        const templatePath = path.join(__dirname, 'views/artisan-workshops.xian');
        const html = renderTemplate(templatePath, {
            title: 'My Workshops - Artisan',
            user: req.session.user,
            workshops: []
        });
        res.send(html);
    }
});

app.get('/dashboard', requireAuth, async (req, res) => {
    try {
        // Fetch user statistics and recent activity
        const userId = req.session.user.id;
        
        // Get user orders (if orders table exists)
        let userOrders = [];
        try {
            const [orders] = await db.execute(`
                SELECT o.*, ap.name as product_name 
                FROM orders o 
                JOIN artisan_products ap ON o.product_id = ap.id 
                WHERE o.user_id = ? 
                ORDER BY o.created_at DESC 
                LIMIT 5
            `, [userId]);
            userOrders = orders;
        } catch (error) {
            // Orders table might not exist yet
            userOrders = [];
        }
        
        const templatePath = path.join(__dirname, 'views/user-dashboard.xian');
        const html = renderTemplate(templatePath, {
            title: 'Dashboard - HeritageLink',
            user: req.session.user,
            visitedDestinations: 5,
            eventsAttended: 3,
            reviewsWritten: 8,
            artisansMet: 4,
            userOrders: userOrders
        });
        res.send(html);
    } catch (error) {
        console.error('User dashboard error:', error);
        const templatePath = path.join(__dirname, 'views/user-dashboard.xian');
        const html = renderTemplate(templatePath, {
            title: 'Dashboard - HeritageLink',
            user: req.session.user,
            visitedDestinations: 0,
            eventsAttended: 0,
            reviewsWritten: 0,
            artisansMet: 0,
            userOrders: []
        });
        res.send(html);
    }
});

// Alias route for /user/dashboard
app.get('/user/dashboard', requireAuth, async (req, res) => {
    try {
        // Fetch user statistics and recent activity
        const userId = req.session.user.id;
        
        // Get user orders (if orders table exists)
        let userOrders = [];
        try {
            const [orders] = await db.execute(`
                SELECT o.*, ap.name as product_name 
                FROM orders o 
                JOIN artisan_products ap ON o.product_id = ap.id 
                WHERE o.user_id = ? 
                ORDER BY o.created_at DESC 
                LIMIT 5
            `, [userId]);
            userOrders = orders;
        } catch (error) {
            // Orders table might not exist yet
            userOrders = [];
        }
        
        const templatePath = path.join(__dirname, 'views/user-dashboard.xian');
        const html = renderTemplate(templatePath, {
            title: 'Dashboard - HeritageLink',
            user: req.session.user,
            visitedDestinations: 5,
            eventsAttended: 3,
            reviewsWritten: 8,
            artisansMet: 4,
            userOrders: userOrders
        });
        res.send(html);
    } catch (error) {
        console.error('User dashboard error:', error);
        const templatePath = path.join(__dirname, 'views/user-dashboard.xian');
        const html = renderTemplate(templatePath, {
            title: 'Dashboard - HeritageLink',
            user: req.session.user,
            visitedDestinations: 0,
            eventsAttended: 0,
            reviewsWritten: 0,
            artisansMet: 0,
            userOrders: []
        });
        res.send(html);
    }
});

// Destinations route
app.get('/destinations', async (req, res) => {
    try {
        // Fetch active destinations
        const [destinations] = await db.execute(
            'SELECT * FROM destinations WHERE status = "active" ORDER BY name'
        );
        
        const templatePath = path.join(__dirname, 'views/destinations.xian');
        const html = renderTemplate(templatePath, {
            title: 'Destinations - HeritageLink',
            user: req.session.user,
            destinations: destinations || []
        });
        res.send(html);
    } catch (error) {
        console.error('Destinations error:', error);
        const templatePath = path.join(__dirname, 'views/destinations.xian');
        const html = renderTemplate(templatePath, {
            title: 'Destinations - HeritageLink',
            user: req.session.user,
            destinations: []
        });
        res.send(html);
    }
});

// Individual destination detail route
app.get('/destinations/:id', async (req, res) => {
    try {
        const destinationId = req.params.id;
        console.log('📍 Loading destination:', destinationId);
        
        // Fetch destination details
        const [destinations] = await db.execute(
            'SELECT * FROM destinations WHERE id = ? LIMIT 1',
            [destinationId]
        );
        
        if (!destinations || destinations.length === 0) {
            console.log('❌ Destination not found:', destinationId);
            return res.status(404).send('Destination not found');
        }
        
        const destination = destinations[0];
        console.log('✅ Destination found:', destination.name);
        
        // Fetch images for this destination (with error handling)
        let destinationImages = [];
        try {
            const [images] = await db.execute(
                'SELECT * FROM destination_images WHERE destination_id = ? ORDER BY is_primary DESC, created_at ASC',
                [destinationId]
            );
            destinationImages = images || [];
            console.log('📸 Images found:', destinationImages.length);
        } catch (imgError) {
            console.log('⚠️ destination_images table may not exist, using fallback');
            // Table might not exist, continue with empty array
        }
        
        // If no images in destination_images table, create array from destination's image_url or photo
        if (destinationImages.length === 0 && (destination.image_url || destination.photo)) {
            destinationImages = [{
                url: destination.image_url || destination.photo,
                image_url: destination.image_url || destination.photo,
                photo: destination.image_url || destination.photo,
                is_primary: 1
            }];
            console.log('📸 Using fallback image from destination record');
        }
        
        // Fetch reviews for this destination (with error handling)
        let reviews = [];
        try {
            const [reviewsData] = await db.execute(
                'SELECT r.*, u.username, u.profile_photo FROM reviews r LEFT JOIN users u ON r.user_id = u.id WHERE r.destination_id = ? ORDER BY r.created_at DESC',
                [destinationId]
            );
            reviews = reviewsData || [];
            console.log('⭐ Reviews found:', reviews.length);
        } catch (reviewError) {
            console.log('⚠️ Error fetching reviews:', reviewError.message);
            // Continue without reviews
        }
        
        // Fetch related destinations (same category/type) - with error handling
        let relatedDests = [];
        try {
            const [related] = await db.execute(
                'SELECT * FROM destinations WHERE id != ? AND (site_type = ? OR category = ?) AND status = \'active\' ORDER BY RAND() LIMIT 3',
                [destinationId, destination.site_type || '', destination.category || '']
            );
            relatedDests = related || [];
            console.log('🔗 Related destinations found:', relatedDests.length);
        } catch (relatedError) {
            console.log('⚠️ Error fetching related destinations:', relatedError.message);
            // Continue without related destinations
        }
        
        // Parse amenities and facilities safely
        let amenities = [];
        let facilities = [];
        try {
            if (destination.amenities) {
                amenities = typeof destination.amenities === 'string' ? JSON.parse(destination.amenities) : destination.amenities;
            }
        } catch (e) {
            console.log('⚠️ Error parsing amenities');
        }
        try {
            if (destination.facilities) {
                facilities = typeof destination.facilities === 'string' ? JSON.parse(destination.facilities) : destination.facilities;
            }
        } catch (e) {
            console.log('⚠️ Error parsing facilities');
        }
        
        const templatePath = path.join(__dirname, 'views/destination.xian');
        const html = renderTemplate(templatePath, {
            title: `${destination.name} - HeritageLink`,
            user: req.session.user,
            destination: destination,
            images: destinationImages,
            reviews: reviews,
            relatedDestinations: relatedDests,
            amenities: amenities,
            facilities: facilities
        });
        res.send(html);
    } catch (error) {
        console.error('❌ Destination detail error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).send(`Error loading destination details: ${error.message}`);
    }
});

// Events routes
app.get('/events', (req, res) => {
    const templatePath = path.join(__dirname, 'views/events.xian');
    const html = renderTemplate(templatePath, {
        title: 'Events - HeritageLink',
        user: req.session.user
    });
    res.send(html);
});

app.get('/event/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        console.log('🎉 Loading event:', eventId);
        
        // Fetch event details
        const [events] = await db.execute(
            'SELECT * FROM events WHERE id = ? LIMIT 1',
            [eventId]
        );
        
        if (!events || events.length === 0) {
            return res.status(404).send('Event not found');
        }
        
        const event = events[0];
        console.log('✅ Event found:', event.title);
        
        // Create images array from event photo/image
        let images = [];
        if (event.image_url || event.photo) {
            images = [{
                url: event.image_url || event.photo,
                image_url: event.image_url || event.photo,
                photo: event.image_url || event.photo
            }];
        }
        
        const templatePath = path.join(__dirname, 'views/event.xian');
        const html = renderTemplate(templatePath, {
            title: `${event.title} - HeritageLink`,
            user: req.session.user,
            event: event,
            eventId: req.params.id,
            images: images
        });
        res.send(html);
    } catch (error) {
        console.error('❌ Event detail error:', error);
        res.status(500).send('Error loading event details');
    }
});

// Alias route for /events/:id (plural)
app.get('/events/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        console.log('🎉 Loading event (plural route):', eventId);
        
        // Fetch event details
        const [events] = await db.execute(
            'SELECT * FROM events WHERE id = ? LIMIT 1',
            [eventId]
        );
        
        if (!events || events.length === 0) {
            return res.status(404).send('Event not found');
        }
        
        const event = events[0];
        console.log('✅ Event found:', event.title);
        
        // Create images array from event photo/image
        let images = [];
        if (event.image_url || event.photo) {
            images = [{
                url: event.image_url || event.photo,
                image_url: event.image_url || event.photo,
                photo: event.image_url || event.photo
            }];
        }
        
        const templatePath = path.join(__dirname, 'views/event.xian');
        const html = renderTemplate(templatePath, {
            title: `${event.title} - HeritageLink`,
            user: req.session.user,
            event: event,
            eventId: req.params.id,
            images: images
        });
        res.send(html);
    } catch (error) {
        console.error('❌ Event detail error:', error);
        res.status(500).send('Error loading event details');
    }
});

// Heritage Gallery routes
app.get('/heritage-gallery', async (req, res) => {
    try {
        console.log('📚 Loading heritage gallery...');
        
        // Fetch heritage items from database
        const [items] = await db.execute(
            'SELECT * FROM heritage_items WHERE status = \'active\' ORDER BY created_at DESC'
        );
        
        console.log('✅ Heritage items found:', items.length);
        
        // Calculate stats
        const stats = {
            total: items.length,
            photos: items.filter(item => item.media_type === 'photo').length,
            videos: items.filter(item => item.media_type === 'video').length,
            audio: items.filter(item => item.media_type === 'audio').length,
            documents: items.filter(item => item.media_type === 'document').length
        };
        
        console.log('📊 Heritage stats:', stats);
        
        const templatePath = path.join(__dirname, 'views/heritage-gallery.xian');
        const html = renderTemplate(templatePath, {
            title: 'Heritage Gallery - HeritageLink',
            user: req.session.user,
            items: items || [],
            stats: stats
        });
        res.send(html);
    } catch (error) {
        console.error('❌ Heritage gallery error:', error);
        console.error('Error stack:', error.stack);
        const templatePath = path.join(__dirname, 'views/heritage-gallery.xian');
        const html = renderTemplate(templatePath, {
            title: 'Heritage Gallery - HeritageLink',
            user: req.session.user,
            items: [],
            stats: { total: 0, photos: 0, videos: 0, audio: 0, documents: 0 }
        });
        res.send(html);
    }
});

app.get('/heritage-item/:id', (req, res) => {
    const templatePath = path.join(__dirname, 'views/heritage-item.xian');
    const html = renderTemplate(templatePath, {
        title: 'Heritage Item - HeritageLink',
        user: req.session.user,
        itemId: req.params.id
    });
    res.send(html);
});

// Artisan/Showcase routes
// Products showcase handler function
async function handleProductsShowcase(req, res) {
    try {
        // Fetch active products with artisan information
        const [products] = await db.execute(`
            SELECT ap.*, u.name as artisan_name 
            FROM artisan_products ap 
            JOIN users u ON ap.artisan_id = u.id 
            WHERE ap.status = 'active' 
            ORDER BY ap.created_at DESC
        `);
        
        // Parse images for each product
        const parsedProducts = (products || []).map(p => {
            if (p.images && typeof p.images === 'string') {
                try {
                    p.images = JSON.parse(p.images);
                } catch (e) {
                    p.images = [];
                }
            }
            return p;
        });
        
        // Get unique categories
        const categories = [...new Set(parsedProducts.map(p => p.category).filter(Boolean))]
            .map(cat => ({ id: cat, name: cat, icon: 'fa-tag' }));
        
        const templatePath = path.join(__dirname, 'views/products-showcase.xian');
        const html = renderTemplate(templatePath, {
            title: 'Artisan Showcase - HeritageLink',
            user: req.session.user,
            products: parsedProducts,
            categories: categories || [],
            filters: {
                search: req.query.search || '',
                category: req.query.category || '',
                min_price: req.query.min_price || '',
                max_price: req.query.max_price || ''
            }
        });
        res.send(html);
    } catch (error) {
        console.error('Showcase error:', error);
        const templatePath = path.join(__dirname, 'views/products-showcase.xian');
        const html = renderTemplate(templatePath, {
            title: 'Artisan Showcase - HeritageLink',
            user: req.session.user,
            products: [],
            categories: [],
            filters: { search: '', category: '', min_price: '', max_price: '' }
        });
        res.send(html);
    }
}

app.get('/showcase', handleProductsShowcase);

app.get('/artisans', (req, res) => {
    const templatePath = path.join(__dirname, 'views/artisans.xian');
    const html = renderTemplate(templatePath, {
        title: 'Artisans - HeritageLink',
        user: req.session.user
    });
    res.send(html);
});

app.get('/artisan/:id', (req, res) => {
    const templatePath = path.join(__dirname, 'views/artisan-profile-public.xian');
    const html = renderTemplate(templatePath, {
        title: 'Artisan Profile - HeritageLink',
        user: req.session.user,
        artisanId: req.params.id
    });
    res.send(html);
});

app.get('/product/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        console.log('🛍️ Loading product:', productId);
        
        // Fetch product details
        const [products] = await db.execute(
            'SELECT ap.*, u.name as artisan_name, u.profile_photo as artisan_photo FROM artisan_products ap LEFT JOIN users u ON ap.artisan_id = u.id WHERE ap.id = ? LIMIT 1',
            [productId]
        );
        
        if (!products || products.length === 0) {
            return res.status(404).send('Product not found');
        }
        
        const product = products[0];
        console.log('✅ Product found:', product.name);
        
        // Parse images if it's a JSON string
        if (product.images && typeof product.images === 'string') {
            try {
                product.images = JSON.parse(product.images);
            } catch (e) {
                product.images = [];
            }
        }
        
        // Fetch related products from same artisan
        let relatedProducts = [];
        try {
            const [related] = await db.execute(
                'SELECT * FROM artisan_products WHERE artisan_id = ? AND id != ? AND status = \'active\' ORDER BY created_at DESC LIMIT 4',
                [product.artisan_id, productId]
            );
            relatedProducts = (related || []).map(p => {
                // Parse images if it's a JSON string
                if (p.images && typeof p.images === 'string') {
                    try {
                        p.images = JSON.parse(p.images);
                    } catch (e) {
                        p.images = [];
                    }
                }
                return p;
            });
        } catch (error) {
            console.log('⚠️ Error fetching related products:', error.message);
        }
        
        const templatePath = path.join(__dirname, 'views/product-detail.xian');
        const html = renderTemplate(templatePath, {
            title: `${product.name} - HeritageLink`,
            user: req.session.user,
            product: product,
            productId: req.params.id,
            relatedProducts: relatedProducts
        });
        res.send(html);
    } catch (error) {
        console.error('❌ Product detail error:', error);
        res.status(500).send('Error loading product details');
    }
});

// Alias route for /showcase/products/:id
app.get('/showcase/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        console.log('🛍️ Loading product (showcase route):', productId);
        
        // Fetch product details
        const [products] = await db.execute(
            'SELECT ap.*, u.name as artisan_name, u.profile_photo as artisan_photo FROM artisan_products ap LEFT JOIN users u ON ap.artisan_id = u.id WHERE ap.id = ? LIMIT 1',
            [productId]
        );
        
        if (!products || products.length === 0) {
            return res.status(404).send('Product not found');
        }
        
        const product = products[0];
        console.log('✅ Product found:', product.name);
        
        // Parse images if it's a JSON string
        if (product.images && typeof product.images === 'string') {
            try {
                product.images = JSON.parse(product.images);
            } catch (e) {
                product.images = [];
            }
        }
        
        // Fetch related products from same artisan
        let relatedProducts = [];
        try {
            const [related] = await db.execute(
                'SELECT * FROM artisan_products WHERE artisan_id = ? AND id != ? AND status = \'active\' ORDER BY created_at DESC LIMIT 4',
                [product.artisan_id, productId]
            );
            relatedProducts = (related || []).map(p => {
                // Parse images if it's a JSON string
                if (p.images && typeof p.images === 'string') {
                    try {
                        p.images = JSON.parse(p.images);
                    } catch (e) {
                        p.images = [];
                    }
                }
                return p;
            });
        } catch (error) {
            console.log('⚠️ Error fetching related products:', error.message);
        }
        
        const templatePath = path.join(__dirname, 'views/product-detail.xian');
        const html = renderTemplate(templatePath, {
            title: `${product.name} - HeritageLink`,
            user: req.session.user,
            product: product,
            productId: req.params.id,
            relatedProducts: relatedProducts
        });
        res.send(html);
    } catch (error) {
        console.error('❌ Product detail error:', error);
        res.status(500).send('Error loading product details');
    }
});

// Products listing route (must come after /showcase/products/:id)
app.get('/showcase/products', handleProductsShowcase);

// Workshops routes
app.get('/workshops', async (req, res) => {
    try {
        console.log('🎓 Loading workshops...');
        
        // Fetch workshops from database
        const [workshops] = await db.execute(
            'SELECT w.*, u.name as artisan_name FROM workshops w LEFT JOIN users u ON w.artisan_id = u.id WHERE w.status = \'active\' ORDER BY w.workshop_date ASC'
        );
        
        console.log('✅ Workshops found:', workshops.length);
        
        const templatePath = path.join(__dirname, 'views/workshops.xian');
        const html = renderTemplate(templatePath, {
            title: 'Workshops - HeritageLink',
            user: req.session.user,
            workshops: workshops || []
        });
        res.send(html);
    } catch (error) {
        console.error('❌ Workshops error:', error);
        console.error('Error stack:', error.stack);
        const templatePath = path.join(__dirname, 'views/workshops.xian');
        const html = renderTemplate(templatePath, {
            title: 'Workshops - HeritageLink',
            user: req.session.user,
            workshops: []
        });
        res.send(html);
    }
});

// Feedback route
app.get('/feedback', (req, res) => {
    const templatePath = path.join(__dirname, 'views/feedback.xian');
    const html = renderTemplate(templatePath, {
        title: 'Feedback - HeritageLink',
        user: req.session.user
    });
    res.send(html);
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/');
    });
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.json({ success: false, message: 'Logout failed' });
        }
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

// User Dashboard routes
app.get('/user/profile', requireAuth, (req, res) => {
    const templatePath = path.join(__dirname, 'views/user-profile.xian');
    const html = renderTemplate(templatePath, {
        title: 'My Profile - HeritageLink',
        user: req.session.user,
        success: req.query.success || null,
        error: req.query.error || null
    });
    res.send(html);
});

app.get('/user/favorites', requireAuth, async (req, res) => {
    try {
        let favorites = [];
        try {
            const [favoritesResult] = await db.execute(
                'SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC',
                [req.session.user.id]
            );
            favorites = favoritesResult;
        } catch (error) {
            console.log('Favorites table not found:', error.message);
        }
        
        const templatePath = path.join(__dirname, 'views/user-favorites.xian');
        const html = renderTemplate(templatePath, {
            title: 'My Favorites - HeritageLink',
            user: req.session.user,
            favorites: favorites
        });
        res.send(html);
    } catch (error) {
        console.error('User favorites error:', error);
        res.send(renderTemplate(path.join(__dirname, 'views/user-favorites.xian'), {
            title: 'My Favorites - HeritageLink',
            user: req.session.user,
            favorites: []
        }));
    }
});

app.get('/user/orders', requireAuth, async (req, res) => {
    try {
        let orders = [];
        try {
            const [ordersResult] = await db.execute(
                'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
                [req.session.user.id]
            );
            orders = ordersResult;
        } catch (error) {
            console.log('Orders table not found:', error.message);
        }
        
        const templatePath = path.join(__dirname, 'views/user-orders.xian');
        const html = renderTemplate(templatePath, {
            title: 'My Orders - HeritageLink',
            user: req.session.user,
            orders: orders
        });
        res.send(html);
    } catch (error) {
        console.error('User orders error:', error);
        res.send(renderTemplate(path.join(__dirname, 'views/user-orders.xian'), {
            title: 'My Orders - HeritageLink',
            user: req.session.user,
            orders: []
        }));
    }
});

app.get('/user/workshops', requireAuth, async (req, res) => {
    try {
        let workshops = [];
        try {
            const [workshopsResult] = await db.execute(
                'SELECT * FROM workshop_registrations WHERE user_id = ? ORDER BY created_at DESC',
                [req.session.user.id]
            );
            workshops = workshopsResult;
        } catch (error) {
            console.log('Workshop registrations table not found:', error.message);
        }
        
        const templatePath = path.join(__dirname, 'views/user-workshops.xian');
        const html = renderTemplate(templatePath, {
            title: 'My Workshops - HeritageLink',
            user: req.session.user,
            workshops: workshops
        });
        res.send(html);
    } catch (error) {
        console.error('User workshops error:', error);
        res.send(renderTemplate(path.join(__dirname, 'views/user-workshops.xian'), {
            title: 'My Workshops - HeritageLink',
            user: req.session.user,
            workshops: []
        }));
    }
});

app.get('/user/reviews', requireAuth, async (req, res) => {
    try {
        let reviews = [];
        try {
            const [reviewsResult] = await db.execute(
                'SELECT * FROM reviews WHERE user_id = ? ORDER BY created_at DESC',
                [req.session.user.id]
            );
            reviews = reviewsResult;
        } catch (error) {
            console.log('Reviews table not found:', error.message);
        }
        
        const templatePath = path.join(__dirname, 'views/user-reviews.xian');
        const html = renderTemplate(templatePath, {
            title: 'My Reviews - HeritageLink',
            user: req.session.user,
            reviews: reviews
        });
        res.send(html);
    } catch (error) {
        console.error('User reviews error:', error);
        res.send(renderTemplate(path.join(__dirname, 'views/user-reviews.xian'), {
            title: 'My Reviews - HeritageLink',
            user: req.session.user,
            reviews: []
        }));
    }
});

app.get('/user/messages', requireAuth, async (req, res) => {
    try {
        console.log('💬 Loading user messages for user:', req.session.user.id);
        
        let conversations = [];
        let conversationMessages = [];
        try {
            const [messagesResult] = await db.execute(
                'SELECT m.*, sender.name as sender_name, sender.profile_photo as sender_photo, receiver.name as receiver_name, receiver.profile_photo as receiver_photo FROM messages m LEFT JOIN users sender ON m.sender_id = sender.id LEFT JOIN users receiver ON m.receiver_id = receiver.id WHERE m.sender_id = ? OR m.receiver_id = ? ORDER BY m.created_at DESC',
                [req.session.user.id, req.session.user.id]
            );
            conversations = messagesResult;
            conversationMessages = messagesResult;
            console.log('✅ Found', messagesResult.length, 'messages');
        } catch (error) {
            console.log('⚠️ Messages table error:', error.message);
        }
        
        const templatePath = path.join(__dirname, 'views/user-messages.xian');
        const html = renderTemplate(templatePath, {
            title: 'Messages - HeritageLink',
            user: req.session.user,
            conversations: conversations,
            conversationMessages: conversationMessages
        });
        res.send(html);
    } catch (error) {
        console.error('❌ User messages error:', error);
        res.send(renderTemplate(path.join(__dirname, 'views/user-messages.xian'), {
            title: 'Messages - HeritageLink',
            user: req.session.user,
            conversations: [],
            conversationMessages: []
        }));
    }
});

app.get('/user/gallery', requireAuth, async (req, res) => {
    try {
        let gallery = [];
        let photos = [];
        try {
            const [galleryResult] = await db.execute(
                'SELECT * FROM user_gallery WHERE user_id = ? ORDER BY created_at DESC',
                [req.session.user.id]
            );
            gallery = galleryResult;
            photos = galleryResult; // Alias for template compatibility
        } catch (error) {
            console.log('User gallery table not found:', error.message);
        }
        
        const templatePath = path.join(__dirname, 'views/user-gallery.xian');
        const html = renderTemplate(templatePath, {
            title: 'My Gallery - HeritageLink',
            user: req.session.user,
            gallery: gallery,
            photos: photos,
            success: null,
            error: null
        });
        res.send(html);
    } catch (error) {
        console.error('User gallery error:', error);
        res.send(renderTemplate(path.join(__dirname, 'views/user-gallery.xian'), {
            title: 'My Gallery - HeritageLink',
            user: req.session.user,
            gallery: [],
            photos: [],
            success: null,
            error: null
        }));
    }
});

app.get('/user/feedback', requireAuth, (req, res) => {
    const templatePath = path.join(__dirname, 'views/user-feedback.xian');
    const html = renderTemplate(templatePath, {
        title: 'My Feedback - HeritageLink',
        user: req.session.user
    });
    res.send(html);
});

app.get('/notifications', requireAuth, (req, res) => {
    const templatePath = path.join(__dirname, 'views/notifications.xian');
    const html = renderTemplate(templatePath, {
        title: 'Notifications - HeritageLink',
        user: req.session.user
    });
    res.send(html);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).send('Internal Server Error');
});

// 404 handler
app.use((req, res) => {
    res.status(404).send('Page Not Found');
});

// Initialize and start server
async function startServer() {
    console.log('🚀 Starting HeritageLink Unified Server (SQLite)...');
    
    // Initialize database
    await initializeDatabase();
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🌟 HeritageLink Unified Server running on port ${PORT}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔗 Website: http://localhost:${PORT}`);
        console.log(`🔗 Health check: http://localhost:${PORT}/health`);
        console.log(`🔗 Admin: http://localhost:${PORT}/admin`);
        console.log(`🔗 API: http://localhost:${PORT}/api`);
        console.log('');
        console.log('✅ Frontend: Integrated (.xian templates)');
        console.log('✅ Backend: API endpoints active');
        console.log('✅ Database: MySQL (phpMyAdmin compatible)');
        console.log('✅ Authentication: Session-based');
        console.log('✅ File uploads: Configured');
        console.log('');
        console.log('🎯 MySQL server deployment complete!');
        console.log('🔗 phpMyAdmin: http://localhost/phpmyadmin');
        console.log('📊 Database: heritagelink (MySQL)');
    });
}

startServer();

export default app;