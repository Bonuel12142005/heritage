// main index.js
import express from 'express';
import path from 'path';
import session from 'express-session';
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import { createServer } from 'net';
import { migrate } from './migrate.js';
import router from './router/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Function to find available port
async function findAvailablePort(startPort = 3000) {
    for (let port = startPort; port <= 4000; port++) {
        try {
            const isAvailable = await checkPort(port);
            if (isAvailable) {
                return port;
            }
        } catch (error) {
            continue;
        }
    }
    return 8080; // Fallback port
}

function checkPort(port) {
    return new Promise((resolve, reject) => {
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
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// Custom .xian view engine using EJS
app.engine('xian', (filePath, options, callback) => {
    // Configure EJS to use .xian extension for includes
    const ejsOptions = {
        views: [path.join(__dirname, 'views')],
        filename: filePath
    };
    ejs.renderFile(filePath, options, ejsOptions, callback);
});

// View engine setup - use .xian extension
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'xian');

// Add user to all views middleware
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// Routes
app.use('/', router);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Server error:', err);
    res.status(500).render('error', {
        title: 'Error - HeritageLink',
        message: 'Something went wrong on our server. Please try again later.'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('error', {
        title: 'Page Not Found - HeritageLink',
        message: 'The page you are looking for does not exist.'
    });
});

// Initialize database and start server
async function startServer() {
    try {
        console.log('🔄 Starting database migration...');
        await migrate();
        console.log('✅ Database migration completed');
        
        const PORT = await findAvailablePort(3000);
        
        app.listen(PORT, () => {
            console.log('🎉 HeritageLink Server running on port ' + PORT);
            console.log('📍 Admin Dashboard: http://localhost:' + PORT + '/admin/dashboard');
            console.log('📍 User Login: http://localhost:' + PORT + '/login');
            console.log('📍 User Register: http://localhost:' + PORT + '/register');
            console.log('\n📝 Test Accounts:');
            console.log('   👑 Admin: admin@heritagelink.com / admin123');
            console.log('   🛠️  Artisan: artisan@heritagelink.com / artisan123');
            console.log('   👤 User: user@heritagelink.com / user123');
            console.log('\n🔧 Using mock database - no real connection required');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        console.log('🔄 Starting server with mock data only...');
        
        // Start server even if migration fails (mock data will be used)
        const PORT = await findAvailablePort(3000);
        
        app.listen(PORT, () => {
            console.log('🎉 HeritageLink Server running on port ' + PORT + ' (Mock Mode)');
            console.log('📍 Admin Dashboard: http://localhost:' + PORT + '/admin/dashboard');
            console.log('📍 User Login: http://localhost:' + PORT + '/login');
            console.log('📍 User Register: http://localhost:' + PORT + '/register');
            console.log('\n📝 Test Accounts:');
            console.log('   👑 Admin: admin@heritagelink.com / admin123');
            console.log('   🛠️  Artisan: artisan@heritagelink.com / artisan123');
            console.log('   👤 User: user@heritagelink.com / user123');
            console.log('\n⚠️  Running in mock data mode - no database connection');
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

startServer();