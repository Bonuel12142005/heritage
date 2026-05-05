import express from 'express';
import { db } from '../models/db.js';

const router = express.Router();

// Middleware to check user authentication
const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }
    next();
};

// User dashboard data
router.get('/dashboard', requireAuth, async (req, res) => {
    try {
        const userId = req.session.user.id;

        // Get user statistics (orders, favorites, etc.)
        const [orderCount] = await db.execute(
            'SELECT COUNT(*) as count FROM orders WHERE user_id = ?',
            [userId]
        );

        // Get recent destinations
        const [recentDestinations] = await db.execute(
            'SELECT * FROM destinations WHERE status = ? ORDER BY created_at DESC LIMIT 6',
            ['active']
        );

        // Get featured artisans
        const [featuredArtisans] = await db.execute(
            'SELECT id, username, full_name, specialization FROM users WHERE role = ? LIMIT 4',
            ['artisan']
        );

        res.json({
            success: true,
            data: {
                stats: {
                    orders: orderCount[0]?.count || 0,
                    favorites: 0, // Implement favorites if needed
                    reviews: 0 // Implement reviews if needed
                },
                recentDestinations: recentDestinations || [],
                featuredArtisans: featuredArtisans || []
            }
        });
    } catch (error) {
        console.error('User dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load dashboard data'
        });
    }
});

// Get user profile
router.get('/profile', requireAuth, async (req, res) => {
    try {
        const userId = req.session.user.id;

        const [users] = await db.execute(
            'SELECT id, username, email, full_name, phone, address, profile_photo, bio FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: users[0]
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load profile'
        });
    }
});

// Update user profile
router.put('/profile', requireAuth, async (req, res) => {
    try {
        const userId = req.session.user.id;
        const { full_name, phone, address, bio } = req.body;

        await db.execute(
            'UPDATE users SET full_name = ?, phone = ?, address = ?, bio = ? WHERE id = ?',
            [full_name, phone, address, bio, userId]
        );

        // Update session data
        req.session.user.full_name = full_name;

        res.json({
            success: true,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile'
        });
    }
});

// Get public destinations (no auth required)
router.get('/destinations', async (req, res) => {
    try {
        const [destinations] = await db.execute(
            'SELECT * FROM destinations WHERE status = ? ORDER BY created_at DESC',
            ['active']
        );

        res.json({
            success: true,
            data: destinations || []
        });
    } catch (error) {
        console.error('Get destinations error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load destinations'
        });
    }
});

// Get public artisans (no auth required)
router.get('/artisans', async (req, res) => {
    try {
        const [artisans] = await db.execute(
            'SELECT id, username, full_name, specialization, bio, profile_photo FROM users WHERE role = ?',
            ['artisan']
        );

        res.json({
            success: true,
            data: artisans || []
        });
    } catch (error) {
        console.error('Get artisans error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load artisans'
        });
    }
});

// Get public products (no auth required)
router.get('/products', async (req, res) => {
    try {
        const [products] = await db.execute(`
            SELECT p.*, u.username as artisan_name, u.full_name as artisan_full_name 
            FROM products p 
            JOIN users u ON p.artisan_id = u.id 
            WHERE p.status = ? 
            ORDER BY p.created_at DESC
        `, ['active']);

        res.json({
            success: true,
            data: products || []
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load products'
        });
    }
});

export default router;