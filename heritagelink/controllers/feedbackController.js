import { db } from '../models/db.js';
import { Feedback } from '../models/feedbackMods.js';
import { Review } from '../models/reviewMods.js';
import { Notification } from '../models/notificationMods.js';

class FeedbackController {
    // ==================== PUBLIC PAGES ====================
    
    // Feedback submission page
    async getFeedbackPage(req, res) {
        try {
            res.render('feedback', {
                title: 'Share Your Feedback - HeritageLink',
                user: req.session.user || null,
                success: req.query.success,
                error: req.query.error
            });
        } catch (err) {
            console.error('Feedback page error:', err);
            res.status(500).render('error', { title: 'Error', message: 'Failed to load feedback page' });
        }
    }

    // Submit feedback (public, can be anonymous)
    async submitFeedback(req, res) {
        try {
            const { category, subject, message, rating, is_anonymous } = req.body;

            // Validation
            if (!subject || !message) {
                return res.redirect('/feedback?error=' + encodeURIComponent('Subject and message are required'));
            }

            // Sanitize input (basic XSS prevention)
            const sanitize = (str) => str ? str.replace(/<[^>]*>/g, '').trim() : '';
            
            const feedbackData = {
                user_id: req.session.user ? req.session.user.id : null,
                category: category || 'general',
                subject: sanitize(subject).substring(0, 255),
                message: sanitize(message).substring(0, 5000),
                rating: rating ? parseInt(rating) : null,
                is_anonymous: is_anonymous === 'on' || is_anonymous === '1'
            };

            await Feedback.create(feedbackData);

            // Notify admins about new feedback
            try {
                const [admins] = await db.query("SELECT id FROM users WHERE role = 'admin'");
                for (const admin of admins) {
                    await Notification.create({
                        user_id: admin.id,
                        type: 'feedback',
                        title: 'New Feedback Received',
                        message: `New ${category} feedback: "${subject.substring(0, 50)}..."`,
                        link: '/admin/feedback'
                    });
                }
            } catch (notifErr) {
                console.log('Notification error (non-critical):', notifErr.message);
            }

            res.redirect('/feedback?success=' + encodeURIComponent('Thank you for your feedback! We appreciate your input.'));
        } catch (err) {
            console.error('Submit feedback error:', err);
            res.redirect('/feedback?error=' + encodeURIComponent('Failed to submit feedback. Please try again.'));
        }
    }

    // ==================== REVIEW SUBMISSION ====================

    // Submit a review for a destination
    async submitReview(req, res) {
        try {
            if (!req.session.user) {
                return res.status(401).json({ success: false, error: 'Please login to submit a review' });
            }

            const { destination_id, rating, title, comment, visit_date, would_recommend } = req.body;

            // Validation
            if (!destination_id || !rating || !comment) {
                return res.status(400).json({ success: false, error: 'Destination, rating, and comment are required' });
            }

            const ratingNum = parseInt(rating);
            if (ratingNum < 1 || ratingNum > 5) {
                return res.status(400).json({ success: false, error: 'Rating must be between 1 and 5' });
            }

            // Check if user already reviewed this destination
            const [existing] = await db.query(
                'SELECT id FROM reviews WHERE user_id = ? AND destination_id = ?',
                [req.session.user.id, destination_id]
            );

            if (existing && existing.length > 0) {
                return res.status(400).json({ success: false, error: 'You have already reviewed this destination' });
            }

            // Sanitize input
            const sanitize = (str) => str ? str.replace(/<[^>]*>/g, '').trim() : '';

            const reviewId = await Review.create({
                user_id: req.session.user.id,
                destination_id: parseInt(destination_id),
                rating: ratingNum,
                title: sanitize(title || '').substring(0, 255),
                comment: sanitize(comment).substring(0, 2000)
            });

            // Add optional fields if columns exist
            try {
                if (visit_date) {
                    await db.query('UPDATE reviews SET visit_date = ? WHERE id = ?', [visit_date, reviewId]);
                }
                if (would_recommend !== undefined) {
                    await db.query('UPDATE reviews SET would_recommend = ? WHERE id = ?', [would_recommend ? 1 : 0, reviewId]);
                }
            } catch (optErr) {
                console.log('Optional fields not available:', optErr.message);
            }

            // Handle image uploads if any
            if (req.files && req.files.length > 0) {
                for (const file of req.files) {
                    try {
                        await db.query(
                            'INSERT INTO review_images (review_id, image_path) VALUES (?, ?)',
                            [reviewId, 'uploads/reviews/' + file.filename]
                        );
                    } catch (imgErr) {
                        console.log('Review image save error:', imgErr.message);
                    }
                }
            }

            res.json({ success: true, message: 'Review submitted successfully! It will be visible after approval.', reviewId });
        } catch (err) {
            console.error('Submit review error:', err);
            res.status(500).json({ success: false, error: 'Failed to submit review' });
        }
    }

    // Get reviews for a destination (public API)
    async getDestinationReviews(req, res) {
        try {
            const { id } = req.params;
            const [reviews] = await db.query(`
                SELECT r.*, u.name as user_name, u.profile_photo
                FROM reviews r
                LEFT JOIN users u ON r.user_id = u.id
                WHERE r.destination_id = ? AND r.status = 'approved'
                ORDER BY r.created_at DESC
                LIMIT 50
            `, [id]);

            // Get average rating
            const [stats] = await db.query(`
                SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews
                FROM reviews
                WHERE destination_id = ? AND status = 'approved'
            `, [id]);

            res.json({
                success: true,
                reviews,
                stats: stats[0] || { avg_rating: 0, total_reviews: 0 }
            });
        } catch (err) {
            console.error('Get reviews error:', err);
            res.status(500).json({ success: false, error: 'Failed to fetch reviews' });
        }
    }

    // Vote review as helpful
    async voteReviewHelpful(req, res) {
        try {
            if (!req.session.user) {
                return res.status(401).json({ success: false, error: 'Please login to vote' });
            }

            const { id } = req.params;
            const userId = req.session.user.id;

            // Check if already voted
            const [existing] = await db.query(
                'SELECT id FROM review_votes WHERE review_id = ? AND user_id = ?',
                [id, userId]
            );

            if (existing && existing.length > 0) {
                // Remove vote
                await db.query('DELETE FROM review_votes WHERE review_id = ? AND user_id = ?', [id, userId]);
                await db.query('UPDATE reviews SET helpful_count = helpful_count - 1 WHERE id = ? AND helpful_count > 0', [id]);
                return res.json({ success: true, action: 'removed' });
            }

            // Add vote
            await db.query('INSERT INTO review_votes (review_id, user_id) VALUES (?, ?)', [id, userId]);
            await db.query('UPDATE reviews SET helpful_count = COALESCE(helpful_count, 0) + 1 WHERE id = ?', [id]);

            res.json({ success: true, action: 'added' });
        } catch (err) {
            console.error('Vote review error:', err);
            res.status(500).json({ success: false, error: 'Failed to vote' });
        }
    }

    // ==================== USER PAGES ====================

    // User's feedback history
    async getUserFeedback(req, res) {
        try {
            if (!req.session.user) {
                return res.redirect('/login');
            }

            const feedback = await Feedback.findAll({ user_id: req.session.user.id });

            res.render('user-feedback', {
                title: 'My Feedback - HeritageLink',
                user: req.session.user,
                feedback
            });
        } catch (err) {
            console.error('User feedback error:', err);
            res.render('user-feedback', {
                title: 'My Feedback - HeritageLink',
                user: req.session.user,
                feedback: []
            });
        }
    }

    // ==================== ADMIN PAGES ====================

    // Admin feedback management page
    async adminFeedbackPage(req, res) {
        try {
            const status = req.query.status || null;
            const category = req.query.category || null;

            const feedback = await Feedback.findAll({ status, category });
            const stats = await Feedback.getStats();
            const categoryStats = await Feedback.getCategoryStats();

            res.render('admin-feedback', {
                title: 'Feedback Management - HeritageLink',
                user: req.session.user,
                feedback,
                stats,
                categoryStats,
                currentStatus: status,
                currentCategory: category
            });
        } catch (err) {
            console.error('Admin feedback error:', err);
            res.render('admin-feedback', {
                title: 'Feedback Management - HeritageLink',
                user: req.session.user,
                feedback: [],
                stats: {},
                categoryStats: [],
                currentStatus: null,
                currentCategory: null
            });
        }
    }

    // Admin respond to feedback
    async adminRespondFeedback(req, res) {
        try {
            const { id } = req.params;
            const { response, status } = req.body;

            if (response) {
                await Feedback.respond(id, req.session.user.id, response);
            }

            if (status) {
                await Feedback.updateStatus(id, status);
            }

            // Notify user if not anonymous
            const feedback = await Feedback.findById(id);
            if (feedback && feedback.user_id && !feedback.is_anonymous) {
                try {
                    await Notification.create({
                        user_id: feedback.user_id,
                        type: 'feedback_response',
                        title: 'Response to Your Feedback',
                        message: `An admin has responded to your feedback: "${feedback.subject}"`,
                        link: '/user/feedback'
                    });
                } catch (notifErr) {
                    console.log('Notification error:', notifErr.message);
                }
            }

            res.json({ success: true, message: 'Response saved successfully' });
        } catch (err) {
            console.error('Admin respond error:', err);
            res.status(500).json({ success: false, error: 'Failed to save response' });
        }
    }

    // Admin delete feedback
    async adminDeleteFeedback(req, res) {
        try {
            const { id } = req.params;
            await Feedback.delete(id);
            res.json({ success: true, message: 'Feedback deleted' });
        } catch (err) {
            console.error('Delete feedback error:', err);
            res.status(500).json({ success: false, error: 'Failed to delete feedback' });
        }
    }

    // API: Get feedback stats
    async apiFeedbackStats(req, res) {
        try {
            const stats = await Feedback.getStats();
            const categoryStats = await Feedback.getCategoryStats();
            res.json({ success: true, stats, categoryStats });
        } catch (err) {
            res.status(500).json({ success: false, error: 'Failed to fetch stats' });
        }
    }
}

export default new FeedbackController();
