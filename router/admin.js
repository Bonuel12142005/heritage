const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/auth');

// Apply admin middleware to all routes
router.use(isAdmin);

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// User Management
router.get('/users', adminController.manageUsers);
router.post('/users/:userId/status', adminController.updateUserStatus);

// Destination Management
router.get('/destinations', adminController.manageDestinations);
router.post('/destinations', adminController.addDestination);
router.post('/destinations/:id', adminController.updateDestination);
router.post('/destinations/:id/delete', adminController.deleteDestination);

// Event Management
router.get('/events', adminController.manageEvents);
router.post('/events', adminController.createEvent);

// Content Moderation
router.get('/moderate', adminController.moderateContent);
router.post('/products/:productId/approve', adminController.approveProduct);
router.post('/products/:productId/reject', adminController.rejectProduct);

module.exports = router;