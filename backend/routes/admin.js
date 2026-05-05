import express from 'express';
import { db } from '../models/db.js';

const router = express.Router();

// Middleware to check admin authentication
const requireAdmin = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
    }
    next();
};

// Admin dashboard data
router.get('/dashboard', requireAdmin, async (req, res) => {
    try {
        // Get dashboard statistics
        const [userCount] = await db.execute('SELECT COUNT(*) as count FROM users WHERE role = ?', ['user']);
        const [artisanCount] = await db.execute('SELECT COUNT(*) as count FROM users WHERE role = ?', ['artisan']);
        const [destinationCount] = await db.execute('SELECT COUNT(*) as count FROM destinations');
        const [productCount] = await db.execute('SELECT COUNT(*) as count FROM products');

        // Get recent users
        const [recentUsers] = await db.execute(
            'SELECT id, username, email, full_name, role, created_at FROM users ORDER BY created_at DESC LIMIT 5'
        );

        res.json({
            success: true,
            data: {
                stats: {
                    users: userCount[0]?.count || 0,
                    artisans: artisanCount[0]?.count || 0,
                    destinations: destinationCount[0]?.count || 0,
                    products: productCount[0]?.count || 0
                },
                recentUsers: recentUsers || []
            }
        });
    } catch (error) {
        console.error('Admin dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load dashboard data'
        });
    }
});

// Get all destinations
router.get('/destinations', requireAdmin, async (req, res) => {
    try {
        const [destinations] = await db.execute(
            'SELECT * FROM destinations ORDER BY created_at DESC'
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

// Create destination
router.post('/destinations', requireAdmin, async (req, res) => {
    try {
        const { name, description, location, category, image_url, latitude, longitude } = req.body;

        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'Name and description are required'
            });
        }

        const [result] = await db.execute(
            'INSERT INTO destinations (name, description, location, category, image_url, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, description, location, category, image_url, latitude, longitude]
        );

        res.status(201).json({
            success: true,
            message: 'Destination created successfully',
            destinationId: result.insertId
        });
    } catch (error) {
        console.error('Create destination error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create destination'
        });
    }
});

// Update destination
router.put('/destinations/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, location, category, image_url, latitude, longitude, status } = req.body;

        const [result] = await db.execute(
            'UPDATE destinations SET name = ?, description = ?, location = ?, category = ?, image_url = ?, latitude = ?, longitude = ?, status = ? WHERE id = ?',
            [name, description, location, category, image_url, latitude, longitude, status, id]
        );

        res.json({
            success: true,
            message: 'Destination updated successfully'
        });
    } catch (error) {
        console.error('Update destination error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update destination'
        });
    }
});

// Delete destination
router.delete('/destinations/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        await db.execute('DELETE FROM destinations WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Destination deleted successfully'
        });
    } catch (error) {
        console.error('Delete destination error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete destination'
        });
    }
});

// Get all users
router.get('/users', requireAdmin, async (req, res) => {
    try {
        const [users] = await db.execute(
            'SELECT id, username, email, full_name, role, created_at FROM users ORDER BY created_at DESC'
        );

        res.json({
            success: true,
            data: users || []
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load users'
        });
    }
});

export default router;