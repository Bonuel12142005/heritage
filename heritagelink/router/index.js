// router/index.js
import express from 'express';
import authController from '../controllers/authController.js';
import { Destination, DestinationImage } from '../models/destinationMods.js';
import adminController from '../controllers/adminController.js';
import { isAdmin } from '../middleware/auth.js';
import { getDB, db } from '../models/db.js';
import upload from '../config/upload.js';

const router = express.Router();

// Mock user data for testing - CORRECT EMAILS
const mockUsers = [
    {
        id: 1,
        username: 'admin',
        name: 'Administrator',
        email: 'admin@heritagelink.com',
        password: 'admin123',
        role: 'admin',
        status: 'active',
        created_at: new Date()
    },
    {
        id: 2,
        username: 'juan_artisan',
        name: 'Juan Artisan',
        email: 'artisan@heritagelink.com',
        password: 'artisan123',
        role: 'artisan',
        status: 'active',
        created_at: new Date()
    },
    {
        id: 3,
        username: 'maria_user',
        name: 'Maria User',
        email: 'user@heritagelink.com',
        password: 'user123',
        role: 'user',
        status: 'active',
        created_at: new Date()
    }
];

// Home route
router.get('/', (req, res) => {
  res.render('home', { 
    title: 'HeritageLink - Gloria, Oriental Mindoro',
    user: req.session.user 
  });
});

// Auth routes
router.post('/api/login', authController.login);
router.post('/api/register', authController.register);

// ... rest of your router code remains the same, just change .gis to .ejs in render calls

// Public pages
router.get('/destinations', (req, res) => {
  res.render('destinations', { 
    title: 'Destinations - HeritageLink',
    user: req.session.user 
  });
});

// Destination detail page
router.get('/destinations/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const destination = await Destination.findById(id);
        if (!destination) {
            return res.status(404).render('error', { title: 'Not Found', message: 'Destination not found' });
        }

        let images = [];
        try {
            images = await DestinationImage.findByDestination(id);
        } catch (imgErr) {
            console.warn('Could not load destination images:', imgErr && imgErr.message ? imgErr.message : imgErr);
        }

        res.render('destination', {
            title: destination.name || 'Destination',
            user: req.session.user,
            destination,
            images
        });
    } catch (err) {
        console.error('Error rendering destination detail:', err);
        res.status(500).render('error', { title: 'Error', message: 'Failed to load destination' });
    }
});

router.get('/events', async (req, res) => {
    try {
        // Try to load events server-side so the page can render immediately with DB data
        const { Event } = await import('../models/eventMods.js');
        const evs = await Event.findAll();
        const events = Array.isArray(evs) ? evs.filter(e => (e.status !== 'deleted' && e.status !== 'removed')) : [];
        res.render('events', { 
            title: 'Events Calendar - HeritageLink',
            user: req.session.user,
            initialEvents: events
        });
    } catch (err) {
        console.warn('Failed to load events server-side, rendering page without initial data:', err && err.message ? err.message : err);
        res.render('events', { title: 'Events Calendar - HeritageLink', user: req.session.user });
    }
});

router.get('/artisans', (req, res) => {
  res.render('artisans', { 
    title: 'Local Artisans - HeritageLink',
    user: req.session.user 
  });
});

// Auth pages
router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.render('login', { title: 'Login - HeritageLink' });
});

router.get('/register', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.render('register', { title: 'Register - HeritageLink' });
});

// Dashboard routing
router.get('/dashboard', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  
  if (req.session.user.role === 'admin') {
    res.redirect('/admin/dashboard');
  } else if (req.session.user.role === 'artisan') {
    res.redirect('/artisan/dashboard');
  } else {
    res.redirect('/user/dashboard');
  }
});

// Dashboard pages
router.get('/admin/dashboard', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/login');
    }

    try {
        const pool = await getDB();
        
        // Get fresh user data including profile photo
        const [adminUsers] = await pool.execute('SELECT * FROM users WHERE id = ?', [req.session.user.id]);
        const userData = adminUsers[0] || req.session.user;
        
        // Update session with latest data
        if (adminUsers[0]) {
            req.session.user.profile_photo = adminUsers[0].profile_photo;
            req.session.user.name = adminUsers[0].name;
        }
        
        const [users] = await pool.execute('SELECT role, COUNT(*) as cnt FROM users GROUP BY role');
        const roleCounts = {};
        users.forEach(r => { roleCounts[r.role] = r.cnt; });

        const [dRow] = await pool.execute("SELECT COUNT(*) as cnt FROM destinations WHERE status = 'active'");
        const [eRow] = await pool.execute("SELECT COUNT(*) as cnt FROM events WHERE status = 'active'");
        const [prRow] = await pool.execute("SELECT COUNT(*) as cnt FROM reviews WHERE status = 'pending'");
        const [ppRow] = await pool.execute("SELECT COUNT(*) as cnt FROM products WHERE status = 'pending'");

        const stats = {
            totalUsers: roleCounts['user'] || 0,
            totalArtisans: roleCounts['artisan'] || 0,
            totalDestinations: dRow[0] ? dRow[0].cnt : 0,
            totalEvents: eRow[0] ? eRow[0].cnt : 0,
            pendingReviews: prRow[0] ? prRow[0].cnt : 0,
            pendingProducts: ppRow[0] ? ppRow[0].cnt : 0
        };

        res.render('admin-dashboard', {
            title: 'Admin Dashboard - HeritageLink',
            user: userData,
            ...stats
        });
    } catch (err) {
        console.error('Failed to load admin dashboard stats:', err);
        // fallback to zeros so the page still loads
        res.render('admin-dashboard', {
            title: 'Admin Dashboard - HeritageLink',
            user: req.session.user,
            totalUsers: 0,
            totalArtisans: 0,
            totalDestinations: 0,
            totalEvents: 0,
            pendingReviews: 0,
            pendingProducts: 0
        });
    }
});

// Admin analytics
router.get('/admin/analytics', isAdmin, adminController.getAnalytics.bind(adminController));

// Admin settings
router.get('/admin/settings', isAdmin, adminController.getSettings.bind(adminController));
router.post('/admin/settings/save', isAdmin, adminController.saveSettings.bind(adminController));

// Admin - Destination management routes
router.get('/admin/destinations', isAdmin, adminController.manageDestinations.bind(adminController));
router.get('/admin/destinations/add', isAdmin, adminController.addDestination.bind(adminController));
router.get('/admin/destinations/edit/:id', isAdmin, adminController.editDestination.bind(adminController));
router.post('/admin/destinations/save', isAdmin, ...adminController.saveDestination);
router.post('/admin/destinations/:id/delete', isAdmin, adminController.deleteDestination.bind(adminController));

// Admin - User management routes
router.get('/admin/users', isAdmin, adminController.manageUsers.bind(adminController));
router.get('/admin/users/add', isAdmin, adminController.addUserForm.bind(adminController));
router.get('/admin/users/edit/:id', isAdmin, adminController.editUserForm.bind(adminController));
router.post('/admin/users/save', isAdmin, adminController.saveUser.bind(adminController));
router.post('/admin/users/:userId/status', isAdmin, adminController.updateUserStatus.bind(adminController));
router.post('/admin/users/:id/delete', isAdmin, adminController.deleteUser.bind(adminController));

// Moderation actions
router.get('/admin/moderate', isAdmin, adminController.moderateContent.bind(adminController));
router.post('/admin/products/:productId/approve', isAdmin, adminController.approveProduct.bind(adminController));
router.post('/admin/products/:productId/reject', isAdmin, adminController.rejectProduct.bind(adminController));
router.post('/admin/reviews/:reviewId/approve', isAdmin, adminController.approveReview.bind(adminController));
router.post('/admin/reviews/:reviewId/reject', isAdmin, adminController.rejectReview.bind(adminController));

// Admin - Event management routes
router.get('/admin/events', isAdmin, adminController.manageEvents.bind(adminController));
router.get('/admin/events/add', isAdmin, adminController.addEvent.bind(adminController));
router.get('/admin/events/edit/:id', isAdmin, adminController.editEvent.bind(adminController));
router.post('/admin/events/save', isAdmin, ...adminController.saveEvent);
router.post('/admin/events/:id/delete', isAdmin, adminController.deleteEvent.bind(adminController));

// Admin - Heritage Gallery management routes
import heritageController from '../controllers/heritageController.js';

router.get('/admin/heritage-gallery', isAdmin, heritageController.adminGallery.bind(heritageController));
router.get('/admin/heritage-gallery/add', isAdmin, heritageController.addForm.bind(heritageController));
router.get('/admin/heritage-gallery/edit/:id', isAdmin, heritageController.editForm.bind(heritageController));
router.post('/admin/heritage-gallery/save', isAdmin, upload.single('media_file'), heritageController.saveItem.bind(heritageController));
router.post('/admin/heritage-gallery/:id/delete', isAdmin, heritageController.deleteItem.bind(heritageController));

// Public Heritage Gallery routes
router.get('/heritage-gallery', heritageController.getGallery.bind(heritageController));
router.get('/heritage-gallery/:id', heritageController.getItem.bind(heritageController));

// Interactive Map routes
import mapController from '../controllers/mapController.js';

router.get('/map', mapController.getMapPage.bind(mapController));
router.get('/places/:id', mapController.getPlaceDetail.bind(mapController));

// Map API routes
router.get('/api/map/places', mapController.apiGetPlaces.bind(mapController));
router.get('/api/map/places/:id', mapController.apiGetPlace.bind(mapController));
router.get('/api/map/nearby', mapController.apiGetNearby.bind(mapController));
router.get('/api/map/routes', mapController.apiGetRoutes.bind(mapController));
router.get('/api/map/routes/:id', mapController.apiGetRoute.bind(mapController));

// Admin Map Places management
router.get('/admin/map-places', isAdmin, mapController.adminPlaces.bind(mapController));
router.get('/admin/map-places/add', isAdmin, mapController.addPlaceForm.bind(mapController));
router.get('/admin/map-places/edit/:id', isAdmin, mapController.editPlaceForm.bind(mapController));
router.post('/admin/map-places/save', isAdmin, upload.single('image'), mapController.savePlace.bind(mapController));
router.post('/admin/map-places/:id/delete', isAdmin, mapController.deletePlace.bind(mapController));

// Artisan & Product Showcase routes
import showcaseController from '../controllers/showcaseController.js';

router.get('/showcase', showcaseController.getShowcase.bind(showcaseController));
router.get('/showcase/artisans', showcaseController.getAllArtisans.bind(showcaseController));
router.get('/showcase/artisans/:id', showcaseController.getArtisanProfile.bind(showcaseController));
router.get('/showcase/products', showcaseController.getAllProducts.bind(showcaseController));
router.get('/showcase/products/:id', showcaseController.getProductDetail.bind(showcaseController));

// Showcase API routes
router.get('/api/showcase/artisans', showcaseController.apiGetArtisans.bind(showcaseController));
router.get('/api/showcase/artisans/:id', showcaseController.apiGetArtisan.bind(showcaseController));
router.get('/api/showcase/products', showcaseController.apiGetProducts.bind(showcaseController));
router.get('/api/showcase/products/:id', showcaseController.apiGetProduct.bind(showcaseController));
router.get('/api/showcase/categories', showcaseController.apiGetCategories.bind(showcaseController));

// Notification routes
import notificationController from '../controllers/notificationController.js';

router.get('/notifications', notificationController.getNotificationsPage.bind(notificationController));
router.get('/api/notifications', notificationController.apiGetNotifications.bind(notificationController));
router.get('/api/notifications/count', notificationController.apiGetUnreadCount.bind(notificationController));
router.post('/api/notifications/:id/read', notificationController.apiMarkAsRead.bind(notificationController));
router.post('/api/notifications/read-all', notificationController.apiMarkAllAsRead.bind(notificationController));
router.delete('/api/notifications/:id', notificationController.apiDelete.bind(notificationController));
router.delete('/api/notifications/all', notificationController.apiDeleteAll.bind(notificationController));

// Heritage Gallery API routes
router.get('/api/heritage', heritageController.apiGetAll.bind(heritageController));
router.get('/api/heritage/:id', heritageController.apiGetOne.bind(heritageController));
router.get('/api/heritage/stats', heritageController.apiGetStats.bind(heritageController));

// Admin Messages
router.get('/admin/messages', isAdmin, async (req, res) => {
    try {
        const conversationUserId = req.query.conversation;
        
        // Get all messages where admin is receiver
        const [receivedMessages] = await db.query(`
            SELECT m.*, u.name as sender_name, u.email as sender_email, u.role as sender_role
            FROM messages m 
            JOIN users u ON m.sender_id = u.id 
            WHERE m.receiver_id = ? 
            ORDER BY m.created_at DESC
        `, [req.session.user.id]);
        
        // Get all messages where admin is sender (replies)
        const [sentMessages] = await db.query(`
            SELECT m.*, u.name as receiver_name, u.email as receiver_email, u.role as receiver_role
            FROM messages m 
            JOIN users u ON m.receiver_id = u.id 
            WHERE m.sender_id = ? 
            ORDER BY m.created_at DESC
        `, [req.session.user.id]);
        
        // Group messages into conversations
        const conversations = [];
        const conversationMap = new Map();
        
        // Add received messages to conversations
        receivedMessages.forEach(msg => {
            if (!conversationMap.has(msg.sender_id)) {
                conversationMap.set(msg.sender_id, {
                    id: msg.sender_id,
                    sender_name: msg.sender_name,
                    sender_role: msg.sender_role,
                    last_message: msg.message,
                    created_at: msg.created_at
                });
            }
        });
        
        // Add sent messages to conversations
        sentMessages.forEach(msg => {
            if (!conversationMap.has(msg.receiver_id)) {
                conversationMap.set(msg.receiver_id, {
                    id: msg.receiver_id,
                    sender_name: msg.receiver_name,
                    sender_role: msg.receiver_role,
                    last_message: msg.message,
                    created_at: msg.created_at
                });
            }
        });
        
        conversationMap.forEach(conv => conversations.push(conv));
        
        // Get conversation messages if a conversation is selected
        let conversationMessages = [];
        let selectedUserId = null;
        let selectedUserName = null;
        let selectedUserRole = null;
        
        if (conversationUserId) {
            selectedUserId = conversationUserId;
            
            // Get all messages between admin and selected user
            const [convMessages] = await db.query(`
                SELECT m.*, 
                       sender.name as sender_name,
                       receiver.name as receiver_name
                FROM messages m
                JOIN users sender ON m.sender_id = sender.id
                JOIN users receiver ON m.receiver_id = receiver.id
                WHERE (m.sender_id = ? AND m.receiver_id = ?)
                   OR (m.sender_id = ? AND m.receiver_id = ?)
                ORDER BY m.created_at ASC
            `, [req.session.user.id, conversationUserId, conversationUserId, req.session.user.id]);
            
            conversationMessages = convMessages;
            
            // Get selected user info
            const [userInfo] = await db.query('SELECT name, role FROM users WHERE id = ?', [conversationUserId]);
            if (userInfo.length > 0) {
                selectedUserName = userInfo[0].name;
                selectedUserRole = userInfo[0].role;
            }
        } else if (conversations.length > 0) {
            // Load first conversation by default
            selectedUserId = conversations[0].id;
            selectedUserName = conversations[0].sender_name;
            selectedUserRole = conversations[0].sender_role;
            
            const [convMessages] = await db.query(`
                SELECT m.*, 
                       sender.name as sender_name,
                       receiver.name as receiver_name
                FROM messages m
                JOIN users sender ON m.sender_id = sender.id
                JOIN users receiver ON m.receiver_id = receiver.id
                WHERE (m.sender_id = ? AND m.receiver_id = ?)
                   OR (m.sender_id = ? AND m.receiver_id = ?)
                ORDER BY m.created_at ASC
            `, [req.session.user.id, selectedUserId, selectedUserId, req.session.user.id]);
            
            conversationMessages = convMessages;
        }
        
        res.render('admin-messages', {
            title: 'Messages - HeritageLink',
            user: req.session.user,
            messages: receivedMessages || [],
            conversations: conversations,
            conversationMessages: conversationMessages,
            selectedUserId: selectedUserId,
            selectedUserName: selectedUserName,
            selectedUserRole: selectedUserRole
        });
    } catch (err) {
        console.error('Admin messages error:', err);
        res.render('admin-messages', {
            title: 'Messages - HeritageLink',
            user: req.session.user,
            messages: [],
            conversations: [],
            conversationMessages: [],
            selectedUserId: null,
            selectedUserName: null,
            selectedUserRole: null
        });
    }
});

// Artisan middleware
const isArtisan = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'artisan') {
        return res.redirect('/login');
    }
    next();
};

// Artisan Dashboard
router.get('/artisan/dashboard', isArtisan, async (req, res) => {
    try {
        // Get fresh user data including profile photo
        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [req.session.user.id]);
        const userData = users[0] || req.session.user;
        
        // Update session with latest data
        if (users[0]) {
            req.session.user.profile_photo = users[0].profile_photo;
            req.session.user.name = users[0].name;
        }
        
        const { Product } = await import('../models/productMods.js');
        const products = await Product.findAll({ artisan_id: req.session.user.id });
        
        // Get actual artisan stats from database
        let orderCount = 0;
        let earnings = 0;
        try {
            const [orders] = await db.query('SELECT COUNT(*) as count, SUM(total_price) as total FROM orders WHERE product_id IN (SELECT id FROM products WHERE artisan_id = ?)', [req.session.user.id]);
            orderCount = orders[0]?.count || 0;
            earnings = orders[0]?.total || 0;
        } catch (err) {
            console.log('Orders table query failed:', err.message);
        }
        
        // Get portfolio count
        let portfolioCount = 0;
        try {
            const [portfolio] = await db.query('SELECT COUNT(*) as count FROM portfolio WHERE artisan_id = ?', [req.session.user.id]);
            portfolioCount = portfolio[0]?.count || 0;
        } catch (err) {
            console.log('Portfolio count query failed:', err.message);
        }
        
        const dashboardData = {
            productCount: products.length,
            orderCount: orderCount,
            reviewCount: portfolioCount,
            earnings: Math.round(earnings * 100) / 100
        };

        res.render('artisan-dashboard', {
            title: 'Artisan Dashboard - HeritageLink',
            user: userData,
            ...dashboardData
        });
    } catch (err) {
        console.error('Artisan dashboard error:', err);
        res.render('artisan-dashboard', {
            title: 'Artisan Dashboard - HeritageLink',
            user: req.session.user,
            productCount: 0,
            orderCount: 0,
            reviewCount: 0,
            earnings: 0
        });
    }
});

// Artisan Products
router.get('/artisan/products', isArtisan, async (req, res) => {
    try {
        const { Product } = await import('../models/productMods.js');
        const products = await Product.findAll({ artisan_id: req.session.user.id });
        
        res.render('artisan-products', {
            title: 'My Products - HeritageLink',
            user: req.session.user,
            products: products || [],
            success: req.query.success
        });
    } catch (err) {
        console.error('Artisan products error:', err);
        res.render('artisan-products', {
            title: 'My Products - HeritageLink',
            user: req.session.user,
            products: [],
            error: 'Failed to load products'
        });
    }
});

// Add Product Form
router.get('/artisan/products/add', isArtisan, (req, res) => {
    res.render('artisan-product-form', {
        title: 'Add Product - HeritageLink',
        user: req.session.user,
        product: null
    });
});

// Edit Product Form
router.get('/artisan/products/edit/:id', isArtisan, async (req, res) => {
    try {
        const { Product } = await import('../models/productMods.js');
        const product = await Product.findById(req.params.id);
        res.render('artisan-product-form', {
            title: 'Edit Product - HeritageLink',
            user: req.session.user,
            product: product
        });
    } catch (err) {
        res.redirect('/artisan/products?error=Product not found');
    }
});

// Save Product (with photo upload)
router.post('/artisan/products/save', isArtisan, upload.array('images', 5), async (req, res) => {
    try {
        console.log('💾 Saving product...');
        console.log('📝 Body:', req.body);
        console.log('📸 Files:', req.files);
        
        const { Product } = await import('../models/productMods.js');
        const productData = {
            name: req.body.name,
            description: req.body.description,
            price: parseFloat(req.body.price),
            artisan_id: req.session.user.id,
            category: req.body.category || null
        };
        
        // Handle photo upload
        if (req.files && req.files.length > 0) {
            productData.product_image = 'uploads/products/' + req.files[0].filename;
            console.log('📸 Image uploaded:', productData.product_image);
        }
        
        if (req.body.id) {
            // Update existing product
            console.log('✏️ Updating product ID:', req.body.id);
            await Product.update(req.body.id, productData);
            console.log('✅ Product updated');
        } else {
            // Create new product
            console.log('➕ Creating new product');
            const productId = await Product.create(productData);
            console.log('✅ Product created with ID:', productId);
        }
        
        res.redirect('/artisan/products?success=Product saved successfully');
    } catch (err) {
        console.error('❌ Save product error:', err);
        console.error('Error details:', err.message);
        res.redirect('/artisan/products?error=' + encodeURIComponent('Failed to save product: ' + err.message));
    }
});

// Delete Product
router.post('/artisan/products/:id/delete', isArtisan, async (req, res) => {
    try {
        const { Product } = await import('../models/productMods.js');
        await Product.delete(req.params.id);
        res.redirect('/artisan/products?success=Product deleted');
    } catch (err) {
        res.redirect('/artisan/products?error=Failed to delete product');
    }
});

// Artisan Orders
router.get('/artisan/orders', isArtisan, async (req, res) => {
    try {
        // Fetch orders for this artisan (you can implement actual order fetching later)
        const orders = []; // TODO: Implement order fetching from database
        
        res.render('artisan-orders', {
            title: 'Orders - HeritageLink',
            user: req.session.user,
            orders: orders
        });
    } catch (err) {
        console.error('Artisan orders error:', err);
        res.render('artisan-orders', {
            title: 'Orders - HeritageLink',
            user: req.session.user,
            orders: []
        });
    }
});

// Artisan Profile
router.get('/artisan/profile', isArtisan, async (req, res) => {
    try {
        // Get full user data including profile fields
        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [req.session.user.id]);
        const userData = users[0] || req.session.user;
        
        res.render('artisan-profile', {
            title: 'My Profile - HeritageLink',
            user: userData,
            success: req.query.success,
            error: req.query.error
        });
    } catch (err) {
        console.error('Profile error:', err);
        res.render('artisan-profile', {
            title: 'My Profile - HeritageLink',
            user: req.session.user,
            error: 'Failed to load profile'
        });
    }
});

// Save Artisan Profile (with photo upload)
router.post('/artisan/profile', isArtisan, upload.single('profile_photo'), async (req, res) => {
    try {
        const { name, email, phone, address, bio, specialization, business_name, contact_number } = req.body;
        
        console.log('💾 Saving profile for user:', req.session.user.id);
        console.log('📝 Data:', { name, email, phone, address, bio, specialization, business_name });
        
        // Build update query dynamically
        let updateFields = [];
        let updateValues = [];
        
        if (name) { updateFields.push('name = ?'); updateValues.push(name); }
        if (email) { updateFields.push('email = ?'); updateValues.push(email); }
        if (phone || contact_number) { updateFields.push('phone = ?'); updateValues.push(phone || contact_number); }
        if (address) { updateFields.push('address = ?'); updateValues.push(address); }
        if (bio) { updateFields.push('bio = ?'); updateValues.push(bio); }
        if (specialization) { updateFields.push('specialization = ?'); updateValues.push(specialization); }
        if (business_name) { updateFields.push('business_name = ?'); updateValues.push(business_name); }
        
        // Handle photo upload
        if (req.file) {
            const photoPath = 'uploads/profiles/' + req.file.filename;
            updateFields.push('profile_photo = ?');
            updateValues.push(photoPath);
            console.log('📸 Photo uploaded:', photoPath);
        }
        
        // Add user ID to values
        updateValues.push(req.session.user.id);
        
        if (updateFields.length > 0) {
            const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
            const [result] = await db.query(query, updateValues);
            console.log('✅ Profile updated, affected rows:', result.affectedRows);
        }
        
        // Update session
        req.session.user.name = name || req.session.user.name;
        req.session.user.email = email || req.session.user.email;
        if (req.file) {
            req.session.user.profile_photo = 'uploads/profiles/' + req.file.filename;
        }
        
        res.redirect('/artisan/profile?success=' + encodeURIComponent('Profile updated successfully!'));
    } catch (err) {
        console.error('❌ Save profile error:', err);
        console.error('Error details:', err.message, err.code);
        res.redirect('/artisan/profile?error=' + encodeURIComponent('Failed to save profile: ' + err.message));
    }
});

// Artisan Workshops
router.get('/artisan/workshops', isArtisan, async (req, res) => {
    try {
        // Fetch workshops for this artisan
        let workshops = [];
        try {
            const [rows] = await db.query('SELECT * FROM workshops WHERE artisan_id = ? ORDER BY workshop_date DESC', [req.session.user.id]);
            workshops = rows || [];
        } catch (dbErr) {
            console.log('Workshops table not found, using empty array');
        }
        
        res.render('artisan-workshops', {
            title: 'Workshops - HeritageLink',
            user: req.session.user,
            workshops: workshops,
            success: req.query.success,
            error: req.query.error
        });
    } catch (err) {
        console.error('Artisan workshops error:', err);
        res.render('artisan-workshops', {
            title: 'Workshops - HeritageLink',
            user: req.session.user,
            workshops: []
        });
    }
});

// Add Workshop Form
router.get('/artisan/workshops/add', isArtisan, (req, res) => {
    res.render('artisan-workshop-form', {
        title: 'Add Workshop - HeritageLink',
        user: req.session.user,
        workshop: null
    });
});

// Edit Workshop Form
router.get('/artisan/workshops/edit/:id', isArtisan, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM workshops WHERE id = ? AND artisan_id = ?', [req.params.id, req.session.user.id]);
        if (!rows || !rows[0]) {
            return res.redirect('/artisan/workshops?error=Workshop not found');
        }
        res.render('artisan-workshop-form', {
            title: 'Edit Workshop - HeritageLink',
            user: req.session.user,
            workshop: rows[0]
        });
    } catch (err) {
        res.redirect('/artisan/workshops?error=Failed to load workshop');
    }
});

// Save Workshop
router.post('/artisan/workshops/save', isArtisan, upload.single('workshop_image'), async (req, res) => {
    try {
        const { id, title, description, workshop_date, workshop_time, location, max_participants, fee, duration, latitude, longitude, status } = req.body;
        
        // Handle image upload
        let imagePath = null;
        if (req.file) {
            imagePath = 'uploads/workshops/' + req.file.filename;
        }
        
        // Validate status
        const validStatus = ['active', 'ongoing', 'completed', 'cancelled'].includes(status) ? status : 'active';
        
        if (id) {
            // Update
            let query, params;
            if (imagePath) {
                query = 'UPDATE workshops SET title = ?, description = ?, workshop_date = ?, workshop_time = ?, location = ?, max_participants = ?, fee = ?, duration = ?, latitude = ?, longitude = ?, image_path = ?, status = ? WHERE id = ? AND artisan_id = ?';
                params = [title, description, workshop_date, workshop_time, location, max_participants || 0, fee || 0, duration, latitude || null, longitude || null, imagePath, validStatus, id, req.session.user.id];
            } else {
                query = 'UPDATE workshops SET title = ?, description = ?, workshop_date = ?, workshop_time = ?, location = ?, max_participants = ?, fee = ?, duration = ?, latitude = ?, longitude = ?, status = ? WHERE id = ? AND artisan_id = ?';
                params = [title, description, workshop_date, workshop_time, location, max_participants || 0, fee || 0, duration, latitude || null, longitude || null, validStatus, id, req.session.user.id];
            }
            await db.query(query, params);
            res.redirect('/artisan/workshops?success=Workshop updated successfully');
        } else {
            // Create
            await db.query(
                'INSERT INTO workshops (artisan_id, title, description, workshop_date, workshop_time, location, max_participants, fee, duration, latitude, longitude, image_path, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [req.session.user.id, title, description, workshop_date, workshop_time, location, max_participants || 0, fee || 0, duration, latitude || null, longitude || null, imagePath, validStatus]
            );
            res.redirect('/artisan/workshops?success=Workshop created successfully');
        }
    } catch (err) {
        console.error('Save workshop error:', err);
        res.redirect('/artisan/workshops?error=Failed to save workshop: ' + err.message);
    }
});

// Delete Workshop
router.post('/artisan/workshops/:id/delete', isArtisan, async (req, res) => {
    try {
        await db.query('DELETE FROM workshops WHERE id = ? AND artisan_id = ?', [req.params.id, req.session.user.id]);
        res.redirect('/artisan/workshops?success=Workshop deleted');
    } catch (err) {
        res.redirect('/artisan/workshops?error=Failed to delete workshop');
    }
});

// Artisan Portfolio
router.get('/artisan/portfolio/add', isArtisan, (req, res) => {
    // Redirect to portfolio page - upload is done via the form on that page
    res.redirect('/artisan/portfolio');
});

router.get('/artisan/portfolio', isArtisan, async (req, res) => {
    try {
        // Fetch portfolio items for this artisan
        const [portfolio] = await db.query(
            'SELECT * FROM portfolio WHERE artisan_id = ? ORDER BY created_at DESC',
            [req.session.user.id]
        );
        
        res.render('artisan-portfolio', {
            title: 'Portfolio - HeritageLink',
            user: req.session.user,
            portfolio: portfolio || [],
            success: req.query.success,
            error: req.query.error
        });
    } catch (err) {
        console.error('Artisan portfolio error:', err);
        res.render('artisan-portfolio', {
            title: 'Portfolio - HeritageLink',
            user: req.session.user,
            portfolio: [],
            error: 'Failed to load portfolio'
        });
    }
});

// Upload Portfolio Images
router.post('/artisan/portfolio/upload', isArtisan, upload.single('portfolio_image'), async (req, res) => {
    try {
        const { title, description } = req.body;
        
        if (!req.file) {
            return res.redirect('/artisan/portfolio?error=No image selected');
        }

        const imagePath = 'uploads/portfolio/' + req.file.filename;
        
        // Insert portfolio item with title and description
        await db.query(
            'INSERT INTO portfolio (artisan_id, image_path, title, description, created_at) VALUES (?, ?, ?, ?, NOW())',
            [req.session.user.id, imagePath, title || req.file.originalname, description || '']
        );

        res.redirect('/artisan/portfolio?success=' + encodeURIComponent('Portfolio item added successfully!'));
    } catch (err) {
        console.error('Portfolio upload error:', err);
        res.redirect('/artisan/portfolio?error=Failed to upload image: ' + err.message);
    }
});

// Delete Portfolio Item
router.post('/artisan/portfolio/:id/delete', isArtisan, async (req, res) => {
    try {
        await db.query('DELETE FROM portfolio WHERE id = ? AND artisan_id = ?', [req.params.id, req.session.user.id]);
        res.redirect('/artisan/portfolio?success=Image deleted successfully');
    } catch (err) {
        console.error('Portfolio delete error:', err);
        res.redirect('/artisan/portfolio?error=Failed to delete image');
    }
});

// Artisan Messages
router.get('/artisan/messages', isArtisan, async (req, res) => {
    try {
        const conversationUserId = req.query.conversation;
        
        // Get all messages where artisan is receiver
        const [receivedMessages] = await db.query(`
            SELECT m.*, u.name as sender_name, u.email as sender_email 
            FROM messages m 
            JOIN users u ON m.sender_id = u.id 
            WHERE m.receiver_id = ? 
            ORDER BY m.created_at DESC
        `, [req.session.user.id]);
        
        // Get all messages where artisan is sender (replies)
        const [sentMessages] = await db.query(`
            SELECT m.*, u.name as receiver_name, u.email as receiver_email 
            FROM messages m 
            JOIN users u ON m.receiver_id = u.id 
            WHERE m.sender_id = ? 
            ORDER BY m.created_at DESC
        `, [req.session.user.id]);
        
        // Group messages into conversations
        const conversations = [];
        const conversationMap = new Map();
        
        // Add received messages to conversations
        receivedMessages.forEach(msg => {
            if (!conversationMap.has(msg.sender_id)) {
                conversationMap.set(msg.sender_id, {
                    id: msg.sender_id,
                    sender_name: msg.sender_name,
                    last_message: msg.message,
                    created_at: msg.created_at
                });
            }
        });
        
        // Add sent messages to conversations
        sentMessages.forEach(msg => {
            if (!conversationMap.has(msg.receiver_id)) {
                conversationMap.set(msg.receiver_id, {
                    id: msg.receiver_id,
                    sender_name: msg.receiver_name,
                    last_message: msg.message,
                    created_at: msg.created_at
                });
            }
        });
        
        conversationMap.forEach(conv => conversations.push(conv));
        
        // Get conversation messages if a conversation is selected
        let conversationMessages = [];
        let selectedUserId = null;
        let selectedUserName = null;
        
        if (conversationUserId) {
            selectedUserId = conversationUserId;
            
            // Get all messages between artisan and selected user
            const [convMessages] = await db.query(`
                SELECT m.*, 
                       sender.name as sender_name,
                       receiver.name as receiver_name
                FROM messages m
                JOIN users sender ON m.sender_id = sender.id
                JOIN users receiver ON m.receiver_id = receiver.id
                WHERE (m.sender_id = ? AND m.receiver_id = ?)
                   OR (m.sender_id = ? AND m.receiver_id = ?)
                ORDER BY m.created_at ASC
            `, [req.session.user.id, conversationUserId, conversationUserId, req.session.user.id]);
            
            conversationMessages = convMessages;
            
            // Get selected user name
            const [userInfo] = await db.query('SELECT name FROM users WHERE id = ?', [conversationUserId]);
            if (userInfo.length > 0) {
                selectedUserName = userInfo[0].name;
            }
        } else if (conversations.length > 0) {
            // Load first conversation by default
            selectedUserId = conversations[0].id;
            selectedUserName = conversations[0].sender_name;
            
            const [convMessages] = await db.query(`
                SELECT m.*, 
                       sender.name as sender_name,
                       receiver.name as receiver_name
                FROM messages m
                JOIN users sender ON m.sender_id = sender.id
                JOIN users receiver ON m.receiver_id = receiver.id
                WHERE (m.sender_id = ? AND m.receiver_id = ?)
                   OR (m.sender_id = ? AND m.receiver_id = ?)
                ORDER BY m.created_at ASC
            `, [req.session.user.id, selectedUserId, selectedUserId, req.session.user.id]);
            
            conversationMessages = convMessages;
        }
        
        res.render('artisan-messages', {
            title: 'Messages - HeritageLink',
            user: req.session.user,
            messages: receivedMessages || [],
            conversations: conversations,
            conversationMessages: conversationMessages,
            selectedUserId: selectedUserId,
            selectedUserName: selectedUserName
        });
    } catch (err) {
        console.error('Messages error:', err);
        res.render('artisan-messages', {
            title: 'Messages - HeritageLink',
            user: req.session.user,
            messages: [],
            conversations: []
        });
    }
});

// Get list of artisans
router.get('/api/artisans/list', async (req, res) => {
    try {
        console.log('📋 Fetching artisans list...');
        
        // First check all users with artisan role
        const [allArtisans] = await db.query(`SELECT id, name, email, role, status, bio, specialization FROM users WHERE role = 'artisan'`);
        console.log(`🔍 Total artisan accounts in database: ${allArtisans.length}`);
        console.log('Artisan accounts:', allArtisans);
        
        const [artisans] = await db.query(`
            SELECT u.id, u.name, u.email, u.bio, u.specialization, u.profile_photo,
                   COUNT(p.id) as product_count
            FROM users u
            LEFT JOIN products p ON u.id = p.artisan_id AND p.status = 'approved'
            WHERE u.role = 'artisan' AND u.status = 'active'
            GROUP BY u.id
            ORDER BY u.name ASC
        `);
        
        console.log(`✅ Found ${artisans.length} active artisans to display`);
        console.log('Artisans to display:', artisans);
        
        res.json({ success: true, artisans: artisans || [] });
    } catch (err) {
        console.error('❌ List artisans error:', err);
        res.status(500).json({ success: false, message: 'Failed to load artisans: ' + err.message });
    }
});

// Send Message API - Simplified version
router.post('/api/messages/send', async (req, res) => {
    try {
        console.log('📨 ========== MESSAGE SEND REQUEST ==========');
        console.log('Session exists:', !!req.session);
        console.log('Session user:', req.session.user);
        console.log('Request body:', req.body);
        
        // Check if logged in
        if (!req.session || !req.session.user) {
            console.log('❌ Not logged in');
            return res.status(401).json({ 
                success: false, 
                message: 'Please login first',
                needsRelogin: true 
            });
        }
        
        const { receiver_id, subject, message } = req.body;
        
        // Validate inputs
        if (!receiver_id || !subject || !message) {
            console.log('❌ Missing fields');
            return res.status(400).json({ success: false, message: 'Please fill in all fields' });
        }
        
        // Get fresh user data from database by email (most reliable)
        console.log('🔍 Looking up sender by email:', req.session.user.email);
        const [senderRows] = await db.query('SELECT id, name, email, role FROM users WHERE email = ?', [req.session.user.email]);
        
        if (!senderRows || senderRows.length === 0) {
            console.log('❌ Sender email not found in database');
            return res.status(400).json({ 
                success: false, 
                message: 'Your account was not found. Please logout and login again.',
                needsRelogin: true 
            });
        }
        
        const sender = senderRows[0];
        console.log('✅ Sender found:', sender);
        
        // Update session with correct user data
        req.session.user = sender;
        
        // Verify receiver exists
        console.log('🔍 Looking up receiver:', receiver_id);
        const [receiverRows] = await db.query('SELECT id, name FROM users WHERE id = ?', [receiver_id]);
        
        if (!receiverRows || receiverRows.length === 0) {
            console.log('❌ Receiver not found');
            return res.status(400).json({ success: false, message: 'Artisan not found' });
        }
        
        console.log('✅ Receiver found:', receiverRows[0]);
        
        // Insert message
        console.log('💾 Inserting message...');
        const [result] = await db.query(
            'INSERT INTO messages (sender_id, receiver_id, subject, message) VALUES (?, ?, ?, ?)',
            [sender.id, receiver_id, subject, message]
        );
        
        console.log('✅ ========== MESSAGE SENT! ID:', result.insertId, '==========');
        
        res.json({ success: true, message: 'Message sent successfully!', messageId: result.insertId });
        
    } catch (err) {
        console.error('❌ ========== MESSAGE SEND ERROR ==========');
        console.error('Error:', err);
        console.error('Stack:', err.stack);
        res.status(500).json({ 
            success: false, 
            message: 'Server error: ' + err.message 
        });
    }
});

// Mark message as read
router.post('/api/messages/:id/read', async (req, res) => {
    try {
        await db.query('UPDATE messages SET is_read = 1 WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

// User Dashboard

router.get('/user/dashboard', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'user') {
        return res.redirect('/login');
    }

    try {
        // Get fresh user data including profile photo
        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [req.session.user.id]);
        const userData = users[0] || req.session.user;
        
        // Update session with latest data
        if (users[0]) {
            req.session.user.profile_photo = users[0].profile_photo;
            req.session.user.name = users[0].name;
        }

        // Get actual user stats from database
        const [reviewsCount] = await db.query('SELECT COUNT(*) as count FROM reviews WHERE user_id = ?', [req.session.user.id]);
        const [favoritesCount] = await db.query('SELECT COUNT(*) as count FROM favorites WHERE user_id = ?', [req.session.user.id]);
        const [galleryCount] = await db.query('SELECT COUNT(*) as count FROM user_gallery WHERE user_id = ?', [req.session.user.id]);
        
        // Get event RSVPs count (if table exists)
        let eventsCount = 0;
        try {
            const [rsvps] = await db.query('SELECT COUNT(*) as count FROM event_rsvps WHERE user_id = ?', [req.session.user.id]);
            eventsCount = rsvps[0]?.count || 0;
        } catch (err) {
            console.log('Event RSVPs table not available yet');
        }

        // Get workshops registered count
        let workshopsCount = 0;
        try {
            const [workshops] = await db.query('SELECT COUNT(*) as count FROM workshop_registrations WHERE user_id = ?', [req.session.user.id]);
            workshopsCount = workshops[0]?.count || 0;
        } catch (err) {
            console.log('Workshop registrations table not available yet');
        }

        const userStats = {
            visitedDestinations: favoritesCount[0]?.count || 0,
            eventsAttended: eventsCount,
            reviewsWritten: reviewsCount[0]?.count || 0,
            artisansMet: galleryCount[0]?.count || 0,
            workshopsRegistered: workshopsCount
        };

        // Get featured artisan products
        let products = [];
        try {
            const [productRows] = await db.query(`
                SELECT p.*, u.name as artisan_name, u.id as artisan_id
                FROM products p
                JOIN users u ON p.artisan_id = u.id
                WHERE p.status = 'active' AND u.role = 'artisan'
                ORDER BY p.created_at DESC
                LIMIT 6
            `);
            products = productRows || [];
        } catch (err) {
            console.log('Products not available:', err.message);
        }

        res.render('user-dashboard', {
            title: 'User Dashboard - HeritageLink',
            user: userData,
            products: products,
            ...userStats
        });
    } catch (err) {
        console.error('User dashboard error:', err);
        res.render('user-dashboard', {
            title: 'User Dashboard - HeritageLink',
            user: req.session.user,
            visitedDestinations: 0,
            eventsAttended: 0,
            reviewsWritten: 0,
            artisansMet: 0
        });
    }
});

// User Profile
router.get('/user/profile', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'user') {
        return res.redirect('/login');
    }
    
    try {
        // Get full user data including profile fields
        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [req.session.user.id]);
        const userData = users[0] || req.session.user;
        
        res.render('user-profile', {
            title: 'My Profile - HeritageLink',
            user: userData,
            success: req.query.success,
            error: req.query.error
        });
    } catch (err) {
        console.error('User profile error:', err);
        res.render('user-profile', {
            title: 'My Profile - HeritageLink',
            user: req.session.user,
            error: 'Failed to load profile'
        });
    }
});

// Save User Profile (with photo upload)
router.post('/user/profile', upload.single('profile_photo'), async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'user') {
        return res.redirect('/login');
    }
    
    try {
        const { name, email, phone, address, bio } = req.body;
        
        console.log('💾 Saving user profile for:', req.session.user.id);
        console.log('📝 Data:', { name, email, phone, address });
        
        // Build update query dynamically
        let updateFields = [];
        let updateValues = [];
        
        if (name) { updateFields.push('name = ?'); updateValues.push(name); }
        if (email) { updateFields.push('email = ?'); updateValues.push(email); }
        if (phone) { updateFields.push('phone = ?'); updateValues.push(phone); }
        if (address) { updateFields.push('address = ?'); updateValues.push(address); }
        if (bio) { updateFields.push('bio = ?'); updateValues.push(bio); }
        
        // Handle photo upload
        if (req.file) {
            const photoPath = 'uploads/profiles/' + req.file.filename;
            updateFields.push('profile_photo = ?');
            updateValues.push(photoPath);
            console.log('📸 Photo uploaded:', photoPath);
        }
        
        // Add user ID to values
        updateValues.push(req.session.user.id);
        
        if (updateFields.length > 0) {
            const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
            const [result] = await db.query(query, updateValues);
            console.log('✅ Profile updated, affected rows:', result.affectedRows);
        }
        
        // Update session
        req.session.user.name = name || req.session.user.name;
        req.session.user.email = email || req.session.user.email;
        if (req.file) {
            req.session.user.profile_photo = 'uploads/profiles/' + req.file.filename;
        }
        
        res.redirect('/user/profile?success=' + encodeURIComponent('Profile updated successfully!'));
    } catch (err) {
        console.error('❌ Save user profile error:', err);
        res.redirect('/user/profile?error=' + encodeURIComponent('Failed to save profile: ' + err.message));
    }
});

// User Messages
router.get('/user/messages', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'user') {
        return res.redirect('/login');
    }
    
    try {
        const conversationUserId = req.query.conversation;
        
        // Get all messages where user is receiver
        const [receivedMessages] = await db.query(`
            SELECT m.*, u.name as sender_name, u.email as sender_email 
            FROM messages m 
            JOIN users u ON m.sender_id = u.id 
            WHERE m.receiver_id = ? 
            ORDER BY m.created_at DESC
        `, [req.session.user.id]);
        
        // Get all messages where user is sender (replies)
        const [sentMessages] = await db.query(`
            SELECT m.*, u.name as receiver_name, u.email as receiver_email 
            FROM messages m 
            JOIN users u ON m.receiver_id = u.id 
            WHERE m.sender_id = ? 
            ORDER BY m.created_at DESC
        `, [req.session.user.id]);
        
        // Group messages into conversations
        const conversations = [];
        const conversationMap = new Map();
        
        // Add received messages to conversations
        receivedMessages.forEach(msg => {
            if (!conversationMap.has(msg.sender_id)) {
                conversationMap.set(msg.sender_id, {
                    id: msg.sender_id,
                    sender_name: msg.sender_name,
                    last_message: msg.message,
                    created_at: msg.created_at
                });
            }
        });
        
        // Add sent messages to conversations
        sentMessages.forEach(msg => {
            if (!conversationMap.has(msg.receiver_id)) {
                conversationMap.set(msg.receiver_id, {
                    id: msg.receiver_id,
                    sender_name: msg.receiver_name,
                    last_message: msg.message,
                    created_at: msg.created_at
                });
            }
        });
        
        conversationMap.forEach(conv => conversations.push(conv));
        
        // Get conversation messages if a conversation is selected
        let conversationMessages = [];
        let selectedUserId = null;
        let selectedUserName = null;
        
        if (conversationUserId) {
            selectedUserId = conversationUserId;
            
            // Get all messages between user and selected artisan
            const [convMessages] = await db.query(`
                SELECT m.*, 
                       sender.name as sender_name,
                       receiver.name as receiver_name
                FROM messages m
                JOIN users sender ON m.sender_id = sender.id
                JOIN users receiver ON m.receiver_id = receiver.id
                WHERE (m.sender_id = ? AND m.receiver_id = ?)
                   OR (m.sender_id = ? AND m.receiver_id = ?)
                ORDER BY m.created_at ASC
            `, [req.session.user.id, conversationUserId, conversationUserId, req.session.user.id]);
            
            conversationMessages = convMessages;
            
            // Get selected user name
            const [userInfo] = await db.query('SELECT name FROM users WHERE id = ?', [conversationUserId]);
            if (userInfo.length > 0) {
                selectedUserName = userInfo[0].name;
            }
        } else if (conversations.length > 0) {
            // Load first conversation by default
            selectedUserId = conversations[0].id;
            selectedUserName = conversations[0].sender_name;
            
            const [convMessages] = await db.query(`
                SELECT m.*, 
                       sender.name as sender_name,
                       receiver.name as receiver_name
                FROM messages m
                JOIN users sender ON m.sender_id = sender.id
                JOIN users receiver ON m.receiver_id = receiver.id
                WHERE (m.sender_id = ? AND m.receiver_id = ?)
                   OR (m.sender_id = ? AND m.receiver_id = ?)
                ORDER BY m.created_at ASC
            `, [req.session.user.id, selectedUserId, selectedUserId, req.session.user.id]);
            
            conversationMessages = convMessages;
        }
        
        res.render('user-messages', {
            title: 'My Messages - HeritageLink',
            user: req.session.user,
            messages: receivedMessages || [],
            conversations: conversations,
            conversationMessages: conversationMessages,
            selectedUserId: selectedUserId,
            selectedUserName: selectedUserName
        });
    } catch (err) {
        console.error('User messages error:', err);
        res.render('user-messages', {
            title: 'My Messages - HeritageLink',
            user: req.session.user,
            messages: [],
            conversations: [],
            conversationMessages: [],
            selectedUserId: null,
            selectedUserName: null
        });
    }
});

// User Reviews
router.get('/user/reviews', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'user') {
        return res.redirect('/login');
    }
    
    try {
        // Get user's reviews
        const [reviews] = await db.query(`
            SELECT r.*, d.name as destination_name 
            FROM reviews r 
            LEFT JOIN destinations d ON r.destination_id = d.id 
            WHERE r.user_id = ? 
            ORDER BY r.created_at DESC
        `, [req.session.user.id]);
        
        res.render('user-reviews', {
            title: 'My Reviews - HeritageLink',
            user: req.session.user,
            reviews: reviews || []
        });
    } catch (err) {
        console.error('User reviews error:', err);
        res.render('user-reviews', {
            title: 'My Reviews - HeritageLink',
            user: req.session.user,
            reviews: []
        });
    }
});

// User Workshops (registered workshops)
router.get('/user/workshops', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'user') {
        return res.redirect('/login');
    }
    
    try {
        // Get user's registered workshops
        const [workshops] = await db.query(`
            SELECT w.*, wr.registered_at, wr.status as registration_status, u.name as artisan_name
            FROM workshop_registrations wr
            JOIN workshops w ON wr.workshop_id = w.id
            LEFT JOIN users u ON w.artisan_id = u.id
            WHERE wr.user_id = ?
            ORDER BY w.workshop_date DESC
        `, [req.session.user.id]);
        
        res.render('user-workshops', {
            title: 'My Workshops - HeritageLink',
            user: req.session.user,
            workshops: workshops || []
        });
    } catch (err) {
        console.error('User workshops error:', err);
        res.render('user-workshops', {
            title: 'My Workshops - HeritageLink',
            user: req.session.user,
            workshops: []
        });
    }
});

// User Favorites
router.get('/user/favorites', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'user') {
        return res.redirect('/login');
    }
    
    try {
        // Get user's favorite destinations
        const [favorites] = await db.query(`
            SELECT d.*, f.created_at as favorited_at 
            FROM favorites f 
            JOIN destinations d ON f.destination_id = d.id 
            WHERE f.user_id = ? 
            ORDER BY f.created_at DESC
        `, [req.session.user.id]);
        
        res.render('user-favorites', {
            title: 'My Favorites - HeritageLink',
            user: req.session.user,
            favorites: favorites || []
        });
    } catch (err) {
        console.error('User favorites error:', err);
        res.render('user-favorites', {
            title: 'My Favorites - HeritageLink',
            user: req.session.user,
            favorites: []
        });
    }
});

// User Gallery
router.get('/user/gallery', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'user') {
        return res.redirect('/login');
    }
    
    try {
        // Get user's uploaded photos
        const [photos] = await db.query(`
            SELECT * FROM user_gallery 
            WHERE user_id = ? 
            ORDER BY created_at DESC
        `, [req.session.user.id]);
        
        res.render('user-gallery', {
            title: 'My Gallery - HeritageLink',
            user: req.session.user,
            photos: photos || [],
            success: req.query.success,
            error: req.query.error
        });
    } catch (err) {
        console.error('User gallery error:', err);
        res.render('user-gallery', {
            title: 'My Gallery - HeritageLink',
            user: req.session.user,
            photos: [],
            error: 'Failed to load gallery'
        });
    }
});

// Upload Gallery Photos
router.post('/user/gallery/upload', upload.array('gallery_images', 10), async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'user') {
        return res.redirect('/login');
    }
    
    try {
        if (!req.files || req.files.length === 0) {
            return res.redirect('/user/gallery?error=No images selected');
        }

        // Insert each uploaded image into user_gallery table
        for (const file of req.files) {
            const imagePath = 'uploads/gallery/' + file.filename;
            const caption = req.body.caption || '';
            await db.query(
                'INSERT INTO user_gallery (user_id, image_path, caption, created_at) VALUES (?, ?, ?, NOW())',
                [req.session.user.id, imagePath, caption]
            );
        }

        res.redirect('/user/gallery?success=' + encodeURIComponent(`${req.files.length} photo(s) uploaded successfully`));
    } catch (err) {
        console.error('Gallery upload error:', err);
        res.redirect('/user/gallery?error=Failed to upload photos');
    }
});

// Delete Gallery Photo
router.post('/user/gallery/:id/delete', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'user') {
        return res.redirect('/login');
    }
    
    try {
        await db.query('DELETE FROM user_gallery WHERE id = ? AND user_id = ?', [req.params.id, req.session.user.id]);
        res.redirect('/user/gallery?success=Photo deleted successfully');
    } catch (err) {
        console.error('Gallery delete error:', err);
        res.redirect('/user/gallery?error=Failed to delete photo');
    }
});

// Remove from Favorites
router.post('/user/favorites/:id/remove', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'user') {
        return res.redirect('/login');
    }
    
    try {
        await db.query('DELETE FROM favorites WHERE destination_id = ? AND user_id = ?', [req.params.id, req.session.user.id]);
        res.redirect('/user/favorites?success=Removed from favorites');
    } catch (err) {
        console.error('Remove favorite error:', err);
        res.redirect('/user/favorites?error=Failed to remove from favorites');
    }
});

// Add to Favorites
router.post('/user/favorites/:id/add', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'user') {
        return res.status(401).json({ success: false, message: 'Please login first' });
    }
    
    try {
        await db.query(
            'INSERT IGNORE INTO favorites (user_id, destination_id, created_at) VALUES (?, ?, NOW())',
            [req.session.user.id, req.params.id]
        );
        res.json({ success: true, message: 'Added to favorites' });
    } catch (err) {
        console.error('Add favorite error:', err);
        res.status(500).json({ success: false, message: 'Failed to add to favorites' });
    }
});

// API routes
router.get('/api/admin/info', async (req, res) => {
    try {
        // Get first admin user
        const [admins] = await db.query('SELECT id FROM users WHERE role = "admin" LIMIT 1');
        if (admins.length > 0) {
            res.json({ success: true, adminId: admins[0].id });
        } else {
            res.json({ success: true, adminId: 1 }); // Default to ID 1
        }
    } catch (err) {
        console.error('Error getting admin info:', err);
        res.json({ success: true, adminId: 1 }); // Default to ID 1
    }
});

router.get('/api/admin/stats', (req, res) => {
    (async () => {
        try {
            const pool = await getDB();
            const [users] = await pool.execute('SELECT role, COUNT(*) as cnt FROM users GROUP BY role');
            const roleCounts = {};
            users.forEach(r => { roleCounts[r.role] = r.cnt; });

            const [dRow] = await pool.execute("SELECT COUNT(*) as cnt FROM destinations WHERE status = 'active'");
            const [eRow] = await pool.execute("SELECT COUNT(*) as cnt FROM events WHERE status = 'active'");
            const [prRow] = await pool.execute("SELECT COUNT(*) as cnt FROM reviews WHERE status = 'pending'");
            const [ppRow] = await pool.execute("SELECT COUNT(*) as cnt FROM products WHERE status = 'pending'");

            const stats = {
                totalUsers: roleCounts['user'] || 0,
                totalArtisans: roleCounts['artisan'] || 0,
                totalDestinations: dRow[0] ? dRow[0].cnt : 0,
                totalEvents: eRow[0] ? eRow[0].cnt : 0,
                pendingReviews: prRow[0] ? prRow[0].cnt : 0,
                pendingProducts: ppRow[0] ? ppRow[0].cnt : 0
            };

            res.json({ success: true, ...stats });
        } catch (err) {
            console.error('API /api/admin/stats error:', err);
            res.status(500).json({ success: false, message: 'Failed to load stats' });
        }
    })();
});

router.get('/api/admin/users', async (req, res) => {
    try {
        // Get real users from database
        const [users] = await db.query('SELECT id, name, username, email, role, status, created_at FROM users ORDER BY created_at DESC');
        res.json({ success: true, users: users || [] });
    } catch (err) {
        console.error('API /api/admin/users error:', err);
        res.status(500).json({ success: false, message: 'Failed to load users' });
    }
});

router.get('/api/artisan/products', async (req, res) => {
    try {
        const { Product } = await import('../models/productMods.js');
        // Try to return products marked 'available' or all if none
        let products = await Product.findAll({ status: 'available' }).catch(() => []);
        if (!products || products.length === 0) {
            // fall back to any non-deleted products
            products = await Product.findAll().catch(() => []);
        }
        return res.json({ success: true, products });
    } catch (err) {
        console.error('API /api/artisan/products error:', err && err.message ? err.message : err);
        return res.status(500).json({ success: false, message: 'Failed to load artisan products' });
    }
});

// Purchase endpoint: create an order for a product
router.post('/api/products/:id/buy', async (req, res) => {
    try {
        const prodId = Number(req.params.id);
        if (!prodId) return res.status(400).json({ success: false, message: 'Invalid product id' });

        const { name, email, quantity } = req.body || {};
        if (!name || !email) return res.status(400).json({ success: false, message: 'Name and email are required' });

        const { Product } = await import('../models/productMods.js');
        const product = await Product.findById(prodId);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

        const qty = Number(quantity) >= 1 ? Number(quantity) : 1;
        const price = Number(product.price || product.price_range || 0);
        const total = Math.round((price * qty) * 100) / 100;

        const pool = await getDB();
        const [result] = await pool.execute('INSERT INTO orders (product_id, user_name, user_email, quantity, total_price, status) VALUES (?, ?, ?, ?, ?, ?)', [prodId, name, email, qty, total, 'pending']);

        return res.json({ success: true, orderId: result.insertId, total });
    } catch (err) {
        console.error('API /api/products/:id/buy error:', err);
        return res.status(500).json({ success: false, message: 'Failed to create order' });
    }
});

// Public API for destinations used by the public UI
router.get('/api/destinations', async (req, res) => {
    try {
        const destinations = await Destination.findAll();
        res.json(destinations);
    } catch (error) {
        console.error('API /api/destinations error:', error);
        res.status(500).json({ success: false, message: 'Failed to load destinations' });
    }
});

// Debug endpoint to check DB connectivity and counts
router.get('/debug/db', async (req, res) => {
    try {
        const pool = await getDB();
        const [dRes] = await pool.execute('SELECT COUNT(*) as cnt FROM destinations');
        const [uRes] = await pool.execute('SELECT COUNT(*) as cnt FROM users');
        const [eRes] = await pool.execute('SELECT COUNT(*) as cnt FROM events');
        res.json({ success: true, counts: { destinations: dRes[0].cnt, users: uRes[0].cnt, events: eRes[0].cnt } });
    } catch (err) {
        console.error('Debug DB error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

router.get('/api/user/reviews', (req, res) => {
    const reviews = [
        { id: 1, destination: 'Gloria Plaza', rating: 5, comment: 'Beautiful place!', date: '2024-01-15' },
        { id: 2, destination: 'Mount Halcon', rating: 4, comment: 'Great hiking experience', date: '2024-01-10' }
    ];
    
    res.json({ success: true, reviews });
});

// Public API for events used by the public UI
router.get('/api/events', async (req, res) => {
    // Try to load events from DB; if anything fails return a safe fallback array
    const fallback = [
        { id: 1, title: 'Cultural Festival', event_date: '2025-12-25', location: 'Town Plaza', organizer: 'Gloria Cultural Office', description: 'Annual cultural festival with performances and food.' },
        { id: 2, title: 'Artisan Market', event_date: '2025-11-30', location: 'Public Market', organizer: 'Local Artisans', description: 'Handmade crafts and demonstrations.' }
    ];

    try {
        // prefer model-based loading
        const { Event } = await import('../models/eventMods.js');
        // Load events without assuming a specific status string — return any non-deleted events.
        // Event.findAll() will return all events; filters (search/presentation) happen client-side.
        const evs = await Event.findAll();
        // If DB returns array, filter out rows explicitly marked deleted (safety).
        const filtered = Array.isArray(evs) ? evs.filter(e => (e.status !== 'deleted' && e.status !== 'removed')) : [];
        return res.json(filtered.length ? filtered : fallback);
    } catch (err) {
        console.error('API /api/events - failed to load Event model or fetch events:', err && err.message ? err.message : err);
        // return fallback so the client can still render
        return res.json(fallback);
    }
});

// Public event detail page (loads images and RSVP count)
router.get('/events/:id', async (req, res) => {
    try {
        const { Event } = await import('../models/eventMods.js');
        const { EventImage } = await import('../models/eventImageMods.js');
        const { EventRsvp } = await import('../models/eventRsvpMods.js');

        const id = req.params.id;
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).render('error', { title: 'Not Found', message: 'Event not found' });
        }

        const images = await EventImage.findByEvent(id).catch(err => { console.warn('Failed to load event images', err); return []; });
        const rsvpCount = await EventRsvp.countByEvent(id).catch(err => { console.warn('Failed to count RSVPs', err); return 0; });

        res.render('event', { title: event.title || 'Event', user: req.session.user, event, images, rsvpCount });
    } catch (err) {
        console.error('Error rendering event detail:', err);
        res.status(500).render('error', { title: 'Error', message: 'Failed to load event' });
    }
});

// RSVP API: persist RSVPs
router.post('/api/events/:id/rsvp', async (req, res) => {
    try {
        const eventId = req.params.id;
        const { name, email, phone, guests } = req.body;
        if (!name || name.trim().length === 0) return res.status(400).json({ success: false, message: 'Name is required' });

        const { EventRsvp } = await import('../models/eventRsvpMods.js');
        const id = await EventRsvp.create({ event_id: eventId, name: name.trim(), email: email || null, phone: phone || null, guests: Number(guests) || 1 });
        res.json({ success: true, id });
    } catch (err) {
        console.error('API /api/events/:id/rsvp error:', err);
        res.status(500).json({ success: false, message: 'Failed to save RSVP' });
    }
});

// ==================== FEEDBACK & REVIEW SYSTEM ====================
import feedbackController from '../controllers/feedbackController.js';

// Public feedback page
router.get('/feedback', feedbackController.getFeedbackPage.bind(feedbackController));
router.post('/feedback/submit', feedbackController.submitFeedback.bind(feedbackController));

// Review submission API
router.post('/api/reviews', feedbackController.submitReview.bind(feedbackController));
router.get('/api/destinations/:id/reviews', feedbackController.getDestinationReviews.bind(feedbackController));
router.post('/api/reviews/:id/helpful', feedbackController.voteReviewHelpful.bind(feedbackController));

// User feedback history
router.get('/user/feedback', feedbackController.getUserFeedback.bind(feedbackController));

// Admin feedback management
router.get('/admin/feedback', isAdmin, feedbackController.adminFeedbackPage.bind(feedbackController));
router.post('/admin/feedback/:id/respond', isAdmin, feedbackController.adminRespondFeedback.bind(feedbackController));
router.post('/admin/feedback/:id/delete', isAdmin, feedbackController.adminDeleteFeedback.bind(feedbackController));
router.get('/api/admin/feedback/stats', isAdmin, feedbackController.apiFeedbackStats.bind(feedbackController));

// ============================================
// PUBLIC WORKSHOPS ROUTES
// ============================================

// Public Workshops Page
router.get('/workshops', async (req, res) => {
    res.render('workshops', {
        title: 'Artisan Workshops',
        user: req.session.user
    });
});

// API: Get all public workshops
router.get('/api/workshops', async (req, res) => {
    try {
        // Fetch ALL workshops from database (no status filter)
        const [workshops] = await db.query(`
            SELECT w.*, u.name as artisan_name, u.profile_photo as artisan_photo
            FROM workshops w
            LEFT JOIN users u ON w.artisan_id = u.id
            ORDER BY w.workshop_date ASC
        `);
        console.log('Workshops fetched:', workshops ? workshops.length : 0);
        res.json({ success: true, workshops: workshops || [] });
    } catch (err) {
        console.error('Get workshops error:', err);
        res.json({ success: true, workshops: [] });
    }
});

// API: Get single workshop
router.get('/api/workshops/:id', async (req, res) => {
    try {
        const [workshops] = await db.query(`
            SELECT w.*, u.name as artisan_name, u.profile_photo as artisan_photo, u.bio as artisan_bio
            FROM workshops w
            LEFT JOIN users u ON w.artisan_id = u.id
            WHERE w.id = ?
        `, [req.params.id]);
        
        if (!workshops || workshops.length === 0) {
            return res.status(404).json({ success: false, message: 'Workshop not found' });
        }
        
        res.json({ success: true, workshop: workshops[0] });
    } catch (err) {
        console.error('Get workshop error:', err);
        res.status(500).json({ success: false, message: 'Failed to load workshop' });
    }
});

// API: Register for workshop
router.post('/api/workshops/:id/register', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'Please login to register' });
    }
    
    try {
        const workshopId = req.params.id;
        const userId = req.session.user.id;
        
        // Check if workshop exists and has capacity
        const [workshops] = await db.query('SELECT * FROM workshops WHERE id = ?', [workshopId]);
        if (!workshops || workshops.length === 0) {
            return res.status(404).json({ success: false, message: 'Workshop not found' });
        }
        
        const workshop = workshops[0];
        
        // Check capacity
        if (workshop.max_participants && (workshop.current_participants || 0) >= workshop.max_participants) {
            return res.status(400).json({ success: false, message: 'Workshop is full' });
        }
        
        // Check if already registered
        const [existing] = await db.query('SELECT * FROM workshop_registrations WHERE workshop_id = ? AND user_id = ?', [workshopId, userId]);
        if (existing && existing.length > 0) {
            return res.status(400).json({ success: false, message: 'You are already registered for this workshop' });
        }
        
        // Register user
        await db.query('INSERT INTO workshop_registrations (workshop_id, user_id, registered_at) VALUES (?, ?, NOW())', [workshopId, userId]);
        
        // Update participant count
        await db.query('UPDATE workshops SET current_participants = COALESCE(current_participants, 0) + 1 WHERE id = ?', [workshopId]);
        
        res.json({ success: true, message: 'Successfully registered for workshop!' });
    } catch (err) {
        console.error('Workshop registration error:', err);
        res.status(500).json({ success: false, message: 'Failed to register: ' + err.message });
    }
});

// API: Cancel workshop registration
router.post('/api/workshops/:id/cancel', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'Please login first' });
    }
    
    try {
        const workshopId = req.params.id;
        const userId = req.session.user.id;
        
        // Check if registration exists
        const [existing] = await db.query('SELECT * FROM workshop_registrations WHERE workshop_id = ? AND user_id = ?', [workshopId, userId]);
        if (!existing || existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Registration not found' });
        }
        
        // Delete registration
        await db.query('DELETE FROM workshop_registrations WHERE workshop_id = ? AND user_id = ?', [workshopId, userId]);
        
        // Update participant count
        await db.query('UPDATE workshops SET current_participants = GREATEST(COALESCE(current_participants, 1) - 1, 0) WHERE id = ?', [workshopId]);
        
        res.json({ success: true, message: 'Registration cancelled successfully' });
    } catch (err) {
        console.error('Cancel registration error:', err);
        res.status(500).json({ success: false, message: 'Failed to cancel: ' + err.message });
    }
});

export default router;

// Logout routes (used by UI links)
router.get('/logout', (req, res) => {
    try {
        if (req.session) {
            req.session.destroy(err => {
                if (err) {
                    console.error('Error destroying session on logout:', err);
                }
                res.clearCookie('connect.sid');
                return res.redirect('/login');
            });
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Logout error:', error);
        res.redirect('/login');
    }
});

router.get('/api/logout', authController.logout);