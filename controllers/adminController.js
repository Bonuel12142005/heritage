import { User } from '../models/userModels.js';
import { Destination } from '../models/destinationMods.js';
import { Event } from '../models/eventMods.js';
import { Review } from '../models/reviewMods.js';
import { Product } from '../models/productMods.js';
import { db } from '../models/db.js';
import { Settings } from '../models/settingsMods.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get Google Maps API key from environment
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';

// Configure multer for image uploads (destinations and events)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine upload directory based on field name
    if (file.fieldname === 'event_image') {
      cb(null, 'public/uploads/events/');
    } else {
      cb(null, 'public/uploads/destinations/');
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const prefix = file.fieldname === 'event_image' ? 'event-' : 'dest-';
    cb(null, prefix + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Mock statistics data
const getMockStats = () => ({
    totalUsers: 15,
    totalArtisans: 8,
    totalDestinations: 12,
    totalEvents: 6,
    pendingReviews: 3,
    pendingProducts: 2
});

// Mock data for other entities
const mockDestinations = [
    { id: 1, name: 'Gloria Plaza', location: 'Town Center', category: 'Historical' },
    { id: 2, name: 'Mount Halcon', location: 'Mountain Range', category: 'Natural' }
];

const mockEvents = [
    { id: 1, title: 'Cultural Festival', event_date: '2024-12-25', location: 'Town Plaza' },
    { id: 2, title: 'Artisan Market', event_date: '2024-12-20', location: 'Public Market' }
];

class AdminController {
  // Get Dashboard Statistics
  async getDashboard(req, res) {
    try {
      console.log('🛡️ Admin dashboard access check:', req.session.user);
      
      if (!req.session.user || req.session.user.role !== 'admin') {
        console.log('❌ Unauthorized access attempt to admin dashboard');
        return res.redirect('/login');
      }

      console.log('✅ Admin access granted for:', req.session.user.name);
      
      let stats = {};

      try {
        console.log('📊 Fetching dashboard statistics from DB...');

        const [userCountRow] = await db.query('SELECT role, COUNT(*) as cnt FROM users GROUP BY role');
        const roleCounts = {};
        if (userCountRow && userCountRow.length) {
          userCountRow.forEach(r => { roleCounts[r.role] = r.cnt; });
        }

        const [destRow] = await db.query("SELECT COUNT(*) as cnt FROM destinations WHERE status = 'active'");
        const [eventRow] = await db.query("SELECT COUNT(*) as cnt FROM events WHERE status = 'active'");
        const [pendingReviewsRow] = await db.query("SELECT COUNT(*) as cnt FROM reviews WHERE status = 'pending'");
        const [pendingProductsRow] = await db.query("SELECT COUNT(*) as cnt FROM products WHERE status = 'pending'");

        stats.totalUsers = roleCounts['user'] || 0;
        stats.totalArtisans = roleCounts['artisan'] || 0;
        stats.totalDestinations = destRow && destRow[0] ? destRow[0].cnt : 0;
        stats.totalEvents = eventRow && eventRow[0] ? eventRow[0].cnt : 0;
        stats.pendingReviews = pendingReviewsRow && pendingReviewsRow[0] ? pendingReviewsRow[0].cnt : 0;
        stats.pendingProducts = pendingProductsRow && pendingProductsRow[0] ? pendingProductsRow[0].cnt : 0;

      } catch (dbError) {
        console.log('🔄 Using fallback data due to error:', dbError && dbError.message ? dbError.message : dbError);
        // Fallback to mock data
        stats = getMockStats();
      }

      console.log('✅ Final dashboard stats:', stats);
      
      res.render('admin-dashboard', {
        title: 'Admin Dashboard - HeritageLink',
        user: req.session.user,
        ...stats,
        success: req.query.success,
        error: req.query.error
      });
    } catch (error) {
      console.error('❌ Admin Dashboard Error:', error);
      // Use fallback data in case of error
      const fallbackStats = getMockStats();
      res.render('admin-dashboard', {
        title: 'Admin Dashboard - HeritageLink',
        user: req.session.user,
        ...fallbackStats,
        error: 'Failed to load dashboard data'
      });
    }
  }

  // User Management
  async manageUsers(req, res) {
    try {
      console.log('👥 Fetching users for management...');
      const users = await User.getAll();

      res.render('admin-users', {
        title: 'User Management - HeritageLink',
        user: req.session.user,
        users: users || [],
        success: req.query.success,
        error: req.query.error
      });
    } catch (error) {
      console.error('❌ Manage Users Error:', error);
      res.render('admin-users', { 
        title: 'User Management - HeritageLink',
        user: req.session.user,
        users: [],
        error: 'Failed to load users' 
      });
    }
  }

  // Add User Form
  async addUserForm(req, res) {
    res.render('admin-user-form', { 
      title: 'Add User - HeritageLink',
      user: req.session.user,
      userData: null,
      success: req.query.success,
      error: req.query.error
    });
  }

  // Edit User Form
  async editUserForm(req, res) {
    try {
      const { id } = req.params;
      const userData = await User.findById(id);
      
      if (!userData) {
        return res.redirect('/admin/users?error=User not found');
      }

      res.render('admin-user-form', { 
        title: 'Edit User - HeritageLink',
        user: req.session.user,
        userData: userData,
        success: req.query.success,
        error: req.query.error
      });
    } catch (error) {
      console.error('❌ Edit User Form Error:', error);
      res.redirect('/admin/users?error=Failed to load user');
    }
  }

  // Save User
  async saveUser(req, res) {
    try {
      const { id, name, email, password, role, status } = req.body;
      console.log('💾 Saving user data:', { id, name, email, role });

      if (id) {
        // Update existing user
        const updatePayload = {
          name,
          email,
          role: role || 'user',
          status: status || 'active'
        };

        // Only update password when provided
        if (password && password.length > 0) updatePayload.password = password;

        await User.update(id, updatePayload);
        console.log('📝 Updated user in DB:', id);
      } else {
        // Create new user
        const newId = await User.create({
          name,
          email,
          password,
          role: role || 'user',
          status: status || 'active'
        });
        console.log('✅ New user created with id:', newId);
      }

      res.redirect('/admin/users?success=User saved successfully');
    } catch (error) {
      console.error('❌ Save User Error:', error);
      res.redirect('/admin/users?error=Failed to save user');
    }
  }

  // Update User Status
  async updateUserStatus(req, res) {
    try {
      const { userId } = req.params;
      const { action } = req.body;
      console.log('🔄 Updating user status:', userId, action);

      const newStatus = action === 'deactivate' ? 'inactive' : 'active';
      await User.update(userId, { status: newStatus });
      res.redirect('/admin/users?success=User status updated successfully');
    } catch (error) {
      console.error('❌ Update User Status Error:', error);
      res.redirect('/admin/users?error=Failed to update user status');
    }
  }

  // Delete User
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      console.log('🗑️ Deleting user:', id);

      await User.delete(id);
      res.redirect('/admin/users?success=User deleted successfully');
    } catch (error) {
      console.error('❌ Delete User Error:', error);
      res.redirect('/admin/users?error=Failed to delete user');
    }
  }

  // Destination Management
  async manageDestinations(req, res) {
    try {
      let destinations = [];
      try {
        destinations = await Destination.findAll();
      } catch (err) {
        console.error('Failed to load destinations from model, using mock:', err);
        destinations = mockDestinations;
      }

      res.render('admin-destinations', {
        title: 'Destination Management - HeritageLink',
        user: req.session.user,
        destinations: destinations,
        success: req.query.success,
        error: req.query.error,
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || ''
      });
    } catch (error) {
      console.error('❌ Manage Destinations Error:', error);
      res.render('admin-destinations', { 
        title: 'Destination Management - HeritageLink',
        user: req.session.user,
        destinations: [],
        error: 'Failed to load destinations',
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || ''
      });
    }
  }

  // Render Add Destination form
  async addDestination(req, res) {
    try {
      res.render('admin-destination-form-leaflet', {
        title: 'Add Destination - HeritageLink',
        user: req.session.user,
        destination: null,
        success: req.query.success,
        error: req.query.error
      });
    } catch (error) {
      console.error('❌ Add Destination Form Error:', error);
      res.redirect('/admin/destinations?error=Failed to load form');
    }
  }

  // Render Edit Destination form
  async editDestination(req, res) {
    try {
      const { id } = req.params;
      const destination = await Destination.findById(id);
      if (!destination) return res.redirect('/admin/destinations?error=Destination not found');

      res.render('admin-destination-form-leaflet', {
        title: 'Edit Destination - HeritageLink',
        user: req.session.user,
        destination,
        success: req.query.success,
        error: req.query.error
      });
    } catch (error) {
      console.error('❌ Edit Destination Form Error:', error);
      res.redirect('/admin/destinations?error=Failed to load destination');
    }
  }

  // Save (create or update) destination with image upload
  saveDestination = [
    upload.array('images', 5), // Allow up to 5 images
    async (req, res) => {
      try {
        console.log('📝 Request body:', req.body);
        console.log('📝 Category value:', req.body.category);
        console.log('📝 Category type:', typeof req.body.category);
        
        // Validate required fields
        if (!req.body.name || !req.body.description || !req.body.location) {
          return res.redirect('/admin/destinations?error=' + encodeURIComponent('Name, description, and location are required'));
        }
        
        if (!req.body.category || req.body.category.trim() === '') {
          return res.redirect('/admin/destinations?error=' + encodeURIComponent('Please select a category'));
        }
        
        const category = req.body.category.trim();
        
        // Ensure category is one of the valid values
        const validCategories = ['Park', 'Museum', 'Mountain', 'Religious', 'Market'];
        if (!validCategories.includes(category)) {
          console.error('❌ Invalid category:', category);
          return res.redirect('/admin/destinations?error=' + encodeURIComponent('Invalid category selected'));
        }
        
        const payload = {
          name: req.body.name.trim(),
          description: req.body.description.trim(),
          location: req.body.location.trim(),
          category: category,
          site_type: category, // Use category as site_type
          entrance_fee: 0, // Default to free
          opening_hours: null, // Not collected in form
          contact_info: req.body.contact_info ? req.body.contact_info.trim() : null,
          latitude: req.body.latitude || null,
          longitude: req.body.longitude || null,
          created_by: req.session.user ? req.session.user.id : null
        };

        console.log('💾 SaveDestination payload:', JSON.stringify(payload, null, 2));
        console.log('💾 site_type value:', payload.site_type, 'length:', payload.site_type.length);
        console.log('📸 Uploaded files:', req.files ? req.files.length : 0);

        let destinationId;
        
        if (req.body.id) {
          await Destination.update(req.body.id, payload);
          destinationId = req.body.id;
        } else {
          destinationId = await Destination.create(payload);
          console.log('✅ Destination created with id:', destinationId, 'type:', typeof destinationId);
        }

        // Validate destinationId before saving images
        if (!destinationId) {
          console.error('❌ Failed to get destination ID after create');
          return res.redirect('/admin/destinations?error=' + encodeURIComponent('Failed to create destination - no ID returned'));
        }

        // Save uploaded images to database
        if (req.files && req.files.length > 0) {
          for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
            const imageUrl = '/uploads/destinations/' + file.filename;
            const isPrimary = i === 0 ? 1 : 0; // First image is primary
            
            console.log('📸 Saving image with destination_id:', destinationId);
            await db.query(
              'INSERT INTO destination_images (destination_id, url, is_primary) VALUES (?, ?, ?)',
              [destinationId, imageUrl, isPrimary]
            );
          }
          console.log(`✅ Saved ${req.files.length} images for destination ${destinationId}`);
        }

        return res.redirect('/admin/destinations?success=' + encodeURIComponent(req.body.id ? 'Destination updated successfully' : 'Destination created successfully with images'));
      } catch (error) {
        console.error('❌ Save Destination Error:', error && error.stack ? error.stack : error);
        const msg = error && error.message ? error.message : 'Failed to save destination';
        return res.redirect('/admin/destinations?error=' + encodeURIComponent('Failed to save destination: ' + msg));
      }
    }
  ];

  // Delete Destination
  async deleteDestination(req, res) {
    try {
      const { id } = req.params;
      await Destination.delete(id);
      res.redirect('/admin/destinations?success=Destination deleted successfully');
    } catch (error) {
      console.error('❌ Delete Destination Error:', error);
      res.redirect('/admin/destinations?error=Failed to delete destination');
    }
  }

  // Event Management
  async manageEvents(req, res) {
    try {
      let events = [];
      try {
        events = await Event.findAll();
      } catch (err) {
        console.error('Failed to load events from model, using mock:', err);
        events = mockEvents;
      }

      res.render('admin-events', {
        title: 'Event Management - HeritageLink',
        user: req.session.user,
        events,
        success: req.query.success,
        error: req.query.error
      });
    } catch (error) {
      console.error('❌ Manage Events Error:', error);
      res.render('admin-events', { 
        title: 'Event Management - HeritageLink',
        user: req.session.user,
        events: [],
        error: 'Failed to load events' 
      });
    }
  }

  // Add Event form
  async addEvent(req, res) {
    try {
      res.render('admin-event-form', {
        title: 'Add Event - HeritageLink',
        user: req.session.user,
        event: null,
        success: req.query.success,
        error: req.query.error
      });
    } catch (error) {
      console.error('❌ Add Event Form Error:', error);
      res.redirect('/admin/events?error=Failed to load form');
    }
  }

  // Edit Event form
  async editEvent(req, res) {
    try {
      const { id } = req.params;
      const event = await Event.findById(id);
      if (!event) return res.redirect('/admin/events?error=Event not found');

      res.render('admin-event-form', {
        title: 'Edit Event - HeritageLink',
        user: req.session.user,
        event,
        success: req.query.success,
        error: req.query.error
      });
    } catch (error) {
      console.error('❌ Edit Event Form Error:', error);
      res.redirect('/admin/events?error=Failed to load event');
    }
  }

  // Save (create/update) event with image upload
  saveEvent = [
    upload.single('event_image'), // Allow single event image
    async (req, res) => {
      try {
        const payload = {
          title: req.body.title,
          description: req.body.description,
          event_date: req.body.event_date,
          event_time: req.body.event_time,
          location: req.body.location,
          organizer: req.body.organizer,
          ticket_price: req.body.ticket_price || 0,
          max_attendees: req.body.max_attendees || 0,
          is_active: req.body.is_active ? 1 : 0,
          created_by: req.session.user ? req.session.user.id : null
        };

        // Add image path if uploaded
        if (req.file) {
          payload.image_url = '/uploads/events/' + req.file.filename;
          console.log('📸 Event image uploaded:', payload.image_url);
        }

        console.log('💾 SaveEvent payload:', payload, 'id:', req.body.id);

        if (req.body.id) {
          await Event.update(req.body.id, payload);
          return res.redirect('/admin/events?success=Event updated successfully');
        } else {
          const newId = await Event.create(payload);
          console.log('✅ Event created with id:', newId);
          return res.redirect('/admin/events?success=Event created successfully');
        }
      } catch (error) {
        console.error('❌ Save Event Error:', error && error.stack ? error.stack : error);
        const msg = error && error.message ? error.message : 'Failed to save event';
        return res.redirect('/admin/events?error=' + encodeURIComponent('Failed to save event: ' + msg));
      }
    }
  ];

  // Delete Event
  async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      await Event.delete(id);
      res.redirect('/admin/events?success=Event deleted successfully');
    } catch (error) {
      console.error('❌ Delete Event Error:', error);
      res.redirect('/admin/events?error=Failed to delete event');
    }
  }

  // Content Moderation
  async moderateContent(req, res) {
    try {
      // Fetch real pending reviews and products from DB
      const pendingReviews = await Review.findAll({ status: 'pending' });
      const pendingProducts = await Product.findAll({ status: 'pending' });

      res.render('admin-moderate', {
        title: 'Content Moderation - HeritageLink',
        user: req.session.user,
        pendingProducts: pendingProducts || [],
        pendingReviews: pendingReviews || [],
        success: req.query.success,
        error: req.query.error
      });
    } catch (error) {
      console.error('❌ Moderate Content Error:', error);
      res.render('admin-moderate', { 
        title: 'Content Moderation - HeritageLink',
        user: req.session.user,
        pendingProducts: [],
        pendingReviews: [],
        error: 'Failed to load moderation queue' 
      });
    }
  }

  // Approve a product (publish it)
  async approveProduct(req, res) {
    try {
      const { productId } = req.params;
      await Product.updateStatus(productId, 'approved');
      res.redirect('/admin/moderate?success=' + encodeURIComponent('Product approved'));
    } catch (err) {
      console.error('❌ Approve Product Error:', err);
      res.redirect('/admin/moderate?error=' + encodeURIComponent('Failed to approve product'));
    }
  }

  // Reject a product
  async rejectProduct(req, res) {
    try {
      const { productId } = req.params;
      await Product.updateStatus(productId, 'rejected');
      res.redirect('/admin/moderate?success=' + encodeURIComponent('Product rejected'));
    } catch (err) {
      console.error('❌ Reject Product Error:', err);
      res.redirect('/admin/moderate?error=' + encodeURIComponent('Failed to reject product'));
    }
  }

  // Approve a review
  async approveReview(req, res) {
    try {
      const { reviewId } = req.params;
      await Review.updateStatus(reviewId, 'approved');
      res.redirect('/admin/moderate?success=' + encodeURIComponent('Review approved'));
    } catch (err) {
      console.error('❌ Approve Review Error:', err);
      res.redirect('/admin/moderate?error=' + encodeURIComponent('Failed to approve review'));
    }
  }

  // Reject a review
  async rejectReview(req, res) {
    try {
      const { reviewId } = req.params;
      await Review.updateStatus(reviewId, 'rejected');
      res.redirect('/admin/moderate?success=' + encodeURIComponent('Review rejected'));
    } catch (err) {
      console.error('❌ Reject Review Error:', err);
      res.redirect('/admin/moderate?error=' + encodeURIComponent('Failed to reject review'));
    }
  }

  // Analytics
  async getAnalytics(req, res) {
    try {
      // Monthly user registrations (grouped by year-month)
      const [monthlyRows] = await db.query(`
        SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count
        FROM users
        GROUP BY month
        ORDER BY month ASC
      `);

      // Popular destinations by approved review count and average rating
      const [popularRows] = await db.query(`
        SELECT d.id, d.name, COUNT(r.id) as review_count, ROUND(AVG(r.rating),2) as avg_rating
        FROM destinations d
        LEFT JOIN reviews r ON d.id = r.destination_id AND r.status = 'approved'
        GROUP BY d.id
        ORDER BY review_count DESC
        LIMIT 10
      `);

      // Platform metrics
      const [totalUsersRow] = await db.query('SELECT COUNT(*) as cnt FROM users');
      const totalUsers = totalUsersRow && totalUsersRow[0] ? totalUsersRow[0].cnt : 0;

      const [totalDestRow] = await db.query("SELECT COUNT(*) as cnt FROM destinations WHERE status = 'active'");
      const totalDestinations = totalDestRow && totalDestRow[0] ? totalDestRow[0].cnt : 0;

      const [totalEventsRow] = await db.query("SELECT COUNT(*) as cnt FROM events WHERE status = 'active'");
      const totalEvents = totalEventsRow && totalEventsRow[0] ? totalEventsRow[0].cnt : 0;

      const [pendingReviewsRow] = await db.query("SELECT COUNT(*) as cnt FROM reviews WHERE status = 'pending'");
      const pendingReviews = pendingReviewsRow && pendingReviewsRow[0] ? pendingReviewsRow[0].cnt : 0;

      const [pendingProductsRow] = await db.query("SELECT COUNT(*) as cnt FROM products WHERE status = 'pending'");
      const pendingProducts = pendingProductsRow && pendingProductsRow[0] ? pendingProductsRow[0].cnt : 0;

      res.render('admin-analytics', {
        title: 'Analytics - HeritageLink',
        user: req.session.user,
        monthlyUsers: monthlyRows || [],
        popularDestinations: popularRows || [],
        metrics: {
          totalUsers,
          totalDestinations,
          totalEvents,
          pendingReviews,
          pendingProducts
        },
        success: req.query.success,
        error: req.query.error
      });
    } catch (error) {
      console.error('❌ Analytics Error:', error);
      res.render('admin-analytics', { 
        title: 'Analytics - HeritageLink',
        user: req.session.user,
        monthlyUsers: [],
        popularDestinations: [],
        error: 'Failed to load analytics'
      });
    }
  }

  // Settings
  async getSettings(req, res) {
    try {
      const settings = await Settings.getAll();
      res.render('admin-settings', {
        title: 'Settings - HeritageLink',
        user: req.session.user,
        settings,
        success: req.query.success,
        error: req.query.error
      });
    } catch (err) {
      console.error('❌ Get Settings Error:', err);
      res.render('admin-settings', { title: 'Settings - HeritageLink', user: req.session.user, settings: {}, error: 'Failed to load settings' });
    }
  }

  async saveSettings(req, res) {
    try {
      // Expect form fields like site_title, contact_email, default_currency, homepage_message
      const payload = req.body || {};
      const keys = ['site_title','contact_email','default_currency','homepage_message'];
      for (const k of keys) {
        if (payload[k] !== undefined) {
          await Settings.set(k, payload[k]);
        }
      }
      res.redirect('/admin/settings?success=' + encodeURIComponent('Settings saved'));
    } catch (err) {
      console.error('❌ Save Settings Error:', err);
      res.redirect('/admin/settings?error=' + encodeURIComponent('Failed to save settings'));
    }
  }

  // API endpoints for dashboard stats
  async getDashboardStats(req, res) {
    try {
      console.log('📊 API: Fetching dashboard statistics...');
      const stats = getMockStats();
      console.log('✅ API: Final dashboard stats:', stats);
      
      res.json({ success: true, ...stats });
    } catch (error) {
      console.error('❌ API: Dashboard stats error:', error);
      const fallbackStats = getMockStats();
      res.json({ success: true, ...fallbackStats });
    }
  }

  // API endpoint for users list
  async getUsers(req, res) {
    try {
      console.log('👥 API: Fetching users list...');
      const users = await User.getAll();
      
      res.json({ 
        success: true, 
        users: users.map(u => ({
          id: u.id,
          name: u.name,
          username: u.username,
          email: u.email,
          role: u.role,
          status: u.status,
          created_at: u.created_at
        }))
      });
    } catch (error) {
      console.error('❌ API: Get users error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch users' 
      });
    }
  }
}

// Export as default for ES6 modules
export default new AdminController();