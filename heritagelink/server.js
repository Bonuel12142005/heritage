// server.js - HeritageLink with .xian templating (EJS-based)
import express from 'express';
import path from 'path';
import session from 'express-session';
import flash from 'connect-flash';
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import { createServer } from 'net';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Function to find available port
async function findAvailablePort(startPort = 3000) {
    for (let port = startPort; port <= 4000; port++) {
        try {
            const isAvailable = await checkPort(port);
            if (isAvailable) return port;
        } catch (error) {
            continue;
        }
    }
    return 8080;
}

function checkPort(port) {
    return new Promise((resolve) => {
        const server = createServer();
        server.once('error', () => resolve(false));
        server.once('listening', () => {
            server.close(() => resolve(true));
        });
        server.listen(port);
    });
}

// Middleware - STATIC FILES FIRST
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: 'heritagelink-gloria-mindoro-2024',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, 
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}));

// Flash messages
app.use(flash());

// Custom .xian view engine using EJS
app.engine('xian', (filePath, options, callback) => {
    ejs.renderFile(filePath, options, {}, callback);
});

// View engine setup - use .xian extension
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'xian');

// Flash messages and user middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.user = req.session.user;
    next();
});

// Import router
import router from './router/index.js';

// Routes
app.use('/', router);

// Error handler
app.use((err, req, res, _next) => {
    console.error('❌ Server error:', err);
    
    if (req && req.accepts && req.accepts('html')) {
        try {
            return res.status(500).render('error', { 
                title: 'Error', 
                message: err && err.message ? err.message : 'Something went wrong on our server.' 
            });
        } catch (renderErr) {
            console.error('Error rendering error view:', renderErr);
        }
    }

    res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Something went wrong on our server.'
    });
});

// 404 handler
app.use((req, res) => {
    if (req && req.accepts && req.accepts('html')) {
        try {
            return res.status(404).render('error', { 
                title: 'Not Found', 
                message: 'The page you are looking for does not exist.' 
            });
        } catch (renderErr) {
            console.error('Error rendering 404 view:', renderErr);
        }
    }

    res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'The page you are looking for does not exist.'
    });
});


// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'HeritageLink API',
        engine: 'XianFire (.xian)'
    });
});

// Initialize and start server
async function startServer() {
    try {
        console.log('🔄 Starting HeritageLink server...');
        const PORT = await findAvailablePort(3000);
        
        app.listen(PORT, () => {
            console.log('🔥 HeritageLink running at http://localhost:' + PORT);
            console.log('📍 Using .xian view engine');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        const PORT = await findAvailablePort(3000);
        
        app.listen(PORT, () => {
            console.log('🔥 HeritageLink running at http://localhost:' + PORT + ' (Fallback Mode)');
        });
    }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));

// Start the server
startServer().catch(error => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
});

export default app;
