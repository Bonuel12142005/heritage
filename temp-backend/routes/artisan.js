import express from 'express';
import { db } from '../models/db.js';

const router = express.Router();

// Middleware to check artisan authentication
const requireArtisan = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'artisan') {
        return res.status(403).json({
            success: false,
            message: 'Artisan access required'
        });
    }
    next();
};

// Artisan dashboard data
router.get('/dashboard', requireArtisan, async (req, res) => {
    try {
        const artisanId = req.session.user.id;

        // Get artisan statistics
        const [productCount] = await db.execute(
            'SELECT COUNT(*) as count FROM products WHERE artisan_id = ?',
            [artisanId]
        );

        const [orderCount] = await db.execute(
            'SELECT COUNT(*) as count FROM orders WHERE artisan_id = ?',
            [artisanId]
        );

        // Get recent products
        const [recentProducts] = await db.execute(
            'SELECT * FROM products WHERE artisan_id = ? ORDER BY created_at DESC LIMIT 5',
            [artisanId]
        );

        res.json({
            success: true,
            data: {
                stats: {
                    products: productCount[0]?.count || 0,
                    orders: orderCount[0]?.count || 0,
                    revenue: 0 // Calculate from orders if needed
                },
                recentProducts: recentProducts || []
            }
        });
    } catch (error) {
        console.error('Artisan dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load dashboard data'
        });
    }
});

// Get artisan products
router.get('/products', requireArtisan, async (req, res) => {
    try {
        const artisanId = req.session.user.id;

        const [products] = await db.execute(
            'SELECT * FROM products WHERE artisan_id = ? ORDER BY created_at DESC',
            [artisanId]
        );

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

// Create product
router.post('/products', requireArtisan, async (req, res) => {
    try {
        const artisanId = req.session.user.id;
        const { name, description, price, category, product_image } = req.body;

        if (!name || !description || !price) {
            return res.status(400).json({
                success: false,
                message: 'Name, description, and price are required'
            });
        }

        const [result] = await db.execute(
            'INSERT INTO products (artisan_id, name, description, price, category, product_image) VALUES (?, ?, ?, ?, ?, ?)',
            [artisanId, name, description, price, category, product_image]
        );

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            productId: result.insertId
        });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create product'
        });
    }
});

// Update product
router.put('/products/:id', requireArtisan, async (req, res) => {
    try {
        const artisanId = req.session.user.id;
        const { id } = req.params;
        const { name, description, price, category, product_image, status } = req.body;

        // Verify product belongs to artisan
        const [products] = await db.execute(
            'SELECT id FROM products WHERE id = ? AND artisan_id = ?',
            [id, artisanId]
        );

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found or access denied'
            });
        }

        await db.execute(
            'UPDATE products SET name = ?, description = ?, price = ?, category = ?, product_image = ?, status = ? WHERE id = ? AND artisan_id = ?',
            [name, description, price, category, product_image, status, id, artisanId]
        );

        res.json({
            success: true,
            message: 'Product updated successfully'
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update product'
        });
    }
});

// Delete product
router.delete('/products/:id', requireArtisan, async (req, res) => {
    try {
        const artisanId = req.session.user.id;
        const { id } = req.params;

        // Verify product belongs to artisan
        const [products] = await db.execute(
            'SELECT id FROM products WHERE id = ? AND artisan_id = ?',
            [id, artisanId]
        );

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found or access denied'
            });
        }

        await db.execute('DELETE FROM products WHERE id = ? AND artisan_id = ?', [id, artisanId]);

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete product'
        });
    }
});

export default router;