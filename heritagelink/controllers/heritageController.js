import { db } from '../models/db.js';
import { HeritageGallery } from '../models/heritageGalleryMods.js';

class HeritageController {
    // Public: Get heritage gallery page
    async getGallery(req, res) {
        try {
            const items = await HeritageGallery.findAll({ status: 'published' });
            const stats = await HeritageGallery.getStats();

            res.render('heritage-gallery', {
                title: 'Heritage Gallery - HeritageLink',
                user: req.session.user,
                items: items || [],
                stats
            });
        } catch (err) {
            console.error('Heritage gallery error:', err);
            res.render('heritage-gallery', {
                title: 'Heritage Gallery - HeritageLink',
                user: req.session.user,
                items: [],
                stats: { total: 0, photos: 0, videos: 0, audio: 0, documents: 0 }
            });
        }
    }

    // Public: Get single heritage item
    async getItem(req, res) {
        try {
            const item = await HeritageGallery.findById(req.params.id);
            
            if (!item || item.status === 'deleted') {
                return res.status(404).render('error', {
                    title: 'Not Found',
                    message: 'Heritage item not found'
                });
            }

            // Increment view count
            await HeritageGallery.incrementViews(req.params.id);

            res.render('heritage-item', {
                title: `${item.title} - Heritage Gallery`,
                user: req.session.user,
                item
            });
        } catch (err) {
            console.error('Heritage item error:', err);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Failed to load heritage item'
            });
        }
    }

    // Admin: Get heritage gallery management page
    async adminGallery(req, res) {
        try {
            const items = await HeritageGallery.findAll();
            const stats = await HeritageGallery.getStats();

            res.render('admin-heritage-gallery', {
                title: 'Heritage Gallery - Admin',
                user: req.session.user,
                items: items || [],
                stats,
                success: req.query.success,
                error: req.query.error
            });
        } catch (err) {
            console.error('Admin heritage gallery error:', err);
            res.render('admin-heritage-gallery', {
                title: 'Heritage Gallery - Admin',
                user: req.session.user,
                items: [],
                stats: { total: 0, photos: 0, videos: 0, audio: 0, documents: 0 },
                error: 'Failed to load heritage items'
            });
        }
    }

    // Admin: Show add form
    async addForm(req, res) {
        res.render('admin-heritage-form', {
            title: 'Add Heritage Item - Admin',
            user: req.session.user,
            item: null
        });
    }

    // Admin: Show edit form
    async editForm(req, res) {
        try {
            const item = await HeritageGallery.findById(req.params.id);
            
            if (!item) {
                return res.redirect('/admin/heritage-gallery?error=Item not found');
            }

            res.render('admin-heritage-form', {
                title: 'Edit Heritage Item - Admin',
                user: req.session.user,
                item
            });
        } catch (err) {
            console.error('Edit heritage form error:', err);
            res.redirect('/admin/heritage-gallery?error=Failed to load item');
        }
    }

    // Admin: Save heritage item (create or update)
    async saveItem(req, res) {
        try {
            const {
                id, title, description, category, media_type, media_url,
                contributor_name, source, historical_date, location,
                tags, transcript, duration, status
            } = req.body;

            // Handle file upload
            let finalMediaUrl = media_url;
            let thumbnailUrl = null;

            if (req.file) {
                finalMediaUrl = '/uploads/heritage/' + req.file.filename;
                
                // Generate thumbnail path for images
                if (media_type === 'photo') {
                    thumbnailUrl = finalMediaUrl;
                } else {
                    // Use default thumbnails for other media types
                    thumbnailUrl = `/uploads/heritage/thumbs/${media_type}-default.jpg`;
                }
            }

            const itemData = {
                title,
                description,
                category,
                media_type,
                media_url: finalMediaUrl,
                thumbnail_url: thumbnailUrl,
                contributor_name,
                source,
                historical_date,
                location,
                tags,
                transcript,
                duration,
                status: status || 'published',
                created_by: req.session.user.id
            };

            if (id) {
                // Update existing
                await HeritageGallery.update(id, itemData);
                res.redirect('/admin/heritage-gallery?success=Heritage item updated successfully');
            } else {
                // Create new
                await HeritageGallery.create(itemData);
                res.redirect('/admin/heritage-gallery?success=Heritage item created successfully');
            }
        } catch (err) {
            console.error('Save heritage item error:', err);
            res.redirect('/admin/heritage-gallery?error=' + encodeURIComponent('Failed to save: ' + err.message));
        }
    }

    // Admin: Delete heritage item
    async deleteItem(req, res) {
        try {
            await HeritageGallery.delete(req.params.id);
            res.redirect('/admin/heritage-gallery?success=Heritage item deleted successfully');
        } catch (err) {
            console.error('Delete heritage item error:', err);
            res.redirect('/admin/heritage-gallery?error=Failed to delete item');
        }
    }

    // API: Get all heritage items (JSON)
    async apiGetAll(req, res) {
        try {
            const filters = {
                category: req.query.category,
                media_type: req.query.media_type,
                search: req.query.search,
                status: 'published'
            };

            const items = await HeritageGallery.findAll(filters);
            res.json({ success: true, items });
        } catch (err) {
            console.error('API heritage error:', err);
            res.status(500).json({ success: false, error: 'Failed to fetch heritage items' });
        }
    }

    // API: Get single heritage item (JSON)
    async apiGetOne(req, res) {
        try {
            const item = await HeritageGallery.findById(req.params.id);
            
            if (!item || item.status === 'deleted') {
                return res.status(404).json({ success: false, error: 'Item not found' });
            }

            await HeritageGallery.incrementViews(req.params.id);
            res.json({ success: true, item });
        } catch (err) {
            console.error('API heritage item error:', err);
            res.status(500).json({ success: false, error: 'Failed to fetch item' });
        }
    }

    // API: Get statistics
    async apiGetStats(req, res) {
        try {
            const stats = await HeritageGallery.getStats();
            res.json({ success: true, stats });
        } catch (err) {
            console.error('API heritage stats error:', err);
            res.status(500).json({ success: false, error: 'Failed to fetch stats' });
        }
    }
}

export default new HeritageController();
