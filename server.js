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
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/assets', express.static(path.join(__dirname, 'public')));

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
        const [totalArtisans] = await db.execute('SELECT COUNT(*) as count FROM users WHERE role = "artisan"');
        
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
        editMode: false
    });
    res.send(html);
});

app.get('/admin/event/:id/edit', requireAuth, requireRole('admin'), (req, res) => {
    const templatePath = path.join(__dirname, 'views/admin-event-form.xian');
    const html = renderTemplate(templatePath, {
        title: 'Edit Event - Admin',
        user: req.session.user,
        editMode: true,
        eventId: req.params.id
    });
    res.send(html);
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
        editMode: false
    });
    res.send(html);
});

app.get('/admin/heritage/:id/edit', requireAuth, requireRole('admin'), (req, res) => {
    const templatePath = path.join(__dirname, 'views/admin-heritage-form.xian');
    const html = renderTemplate(templatePath, {
        title: 'Edit Heritage Item - Admin',
        user: req.session.user,
        editMode: true,
        heritageId: req.params.id
    });
    res.send(html);
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
app.get('/artisan/profile', requireAuth, requireRole('artisan'), (req, res) => {
    const templatePath = path.join(__dirname, 'views/artisan-profile.xian');
    const html = renderTemplate(templatePath, {
        title: 'My Profile - Artisan',
        user: req.session.user
    });
    res.send(html);
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
        editMode: false
    });
    res.send(html);
});

app.get('/artisan/product/:id/edit', requireAuth, requireRole('artisan'), (req, res) => {
    const templatePath = path.join(__dirname, 'views/artisan-product-form.xian');
    const html = renderTemplate(templatePath, {
        title: 'Edit Product - Artisan',
        user: req.session.user,
        editMode: true,
        productId: req.params.id
    });
    res.send(html);
});

// Artisan Workshop Forms
app.get('/artisan/workshop/new', requireAuth, requireRole('artisan'), (req, res) => {
    const templatePath = path.join(__dirname, 'views/artisan-workshop-form.xian');
    const html = renderTemplate(templatePath, {
        title: 'Create Workshop - Artisan',
        user: req.session.user,
        editMode: false
    });
    res.send(html);
});

app.get('/artisan/workshop/:id/edit', requireAuth, requireRole('artisan'), (req, res) => {
    const templatePath = path.join(__dirname, 'views/artisan-workshop-form.xian');
    const html = renderTemplate(templatePath, {
        title: 'Edit Workshop - Artisan',
        user: req.session.user,
        editMode: true,
        workshopId: req.params.id
    });
    res.send(html);
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
app.get('/showcase', async (req, res) => {
    try {
        // Fetch active products with artisan information
        const [products] = await db.execute(`
            SELECT ap.*, u.name as artisan_name 
            FROM artisan_products ap 
            JOIN users u ON ap.artisan_id = u.id 
            WHERE ap.status = 'active' 
            ORDER BY ap.created_at DESC
        `);
        
        // Get unique categories
        const categories = [...new Set(products.map(p => p.category).filter(Boolean))]
            .map(cat => ({ id: cat, name: cat, icon: 'fa-tag' }));
        
        const templatePath = path.join(__dirname, 'views/products-showcase.xian');
        const html = renderTemplate(templatePath, {
            title: 'Artisan Showcase - HeritageLink',
            user: req.session.user,
            products: products || [],
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
});

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

app.get('/product/:id', (req, res) => {
    const templatePath = path.join(__dirname, 'views/product-detail.xian');
    const html = renderTemplate(templatePath, {
        title: 'Product Details - HeritageLink',
        user: req.session.user,
        productId: req.params.id
    });
    res.send(html);
});

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