import { Notification } from '../models/notificationMods.js';

class NotificationController {
    // Get notifications page
    async getNotificationsPage(req, res) {
        try {
            if (!req.session.user) {
                return res.redirect('/login');
            }

            const notifications = await Notification.findByUser(req.session.user.id, 50);
            const unreadCount = await Notification.getUnreadCount(req.session.user.id);

            // Add type config to each notification
            const notificationsWithConfig = notifications.map(n => ({
                ...n,
                typeConfig: Notification.getTypeConfig(n.type)
            }));

            res.render('notifications', {
                title: 'Notifications - HeritageLink',
                user: req.session.user,
                notifications: notificationsWithConfig,
                unreadCount
            });
        } catch (err) {
            console.error('Notifications page error:', err);
            res.render('notifications', {
                title: 'Notifications - HeritageLink',
                user: req.session.user,
                notifications: [],
                unreadCount: 0
            });
        }
    }

    // API: Get notifications
    async apiGetNotifications(req, res) {
        try {
            if (!req.session.user) {
                return res.status(401).json({ success: false, error: 'Not authenticated' });
            }

            const limit = parseInt(req.query.limit) || 20;
            const notifications = await Notification.findByUser(req.session.user.id, limit);
            const unreadCount = await Notification.getUnreadCount(req.session.user.id);

            const notificationsWithConfig = notifications.map(n => ({
                ...n,
                typeConfig: Notification.getTypeConfig(n.type)
            }));

            res.json({
                success: true,
                notifications: notificationsWithConfig,
                unreadCount
            });
        } catch (err) {
            console.error('API notifications error:', err);
            res.status(500).json({ success: false, error: 'Failed to fetch notifications' });
        }
    }

    // API: Get unread count only
    async apiGetUnreadCount(req, res) {
        try {
            if (!req.session.user) {
                return res.json({ success: true, count: 0 });
            }

            const count = await Notification.getUnreadCount(req.session.user.id);
            res.json({ success: true, count });
        } catch (err) {
            res.json({ success: true, count: 0 });
        }
    }

    // API: Mark as read
    async apiMarkAsRead(req, res) {
        try {
            if (!req.session.user) {
                return res.status(401).json({ success: false, error: 'Not authenticated' });
            }

            await Notification.markAsRead(req.params.id, req.session.user.id);
            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ success: false, error: 'Failed to mark as read' });
        }
    }

    // API: Mark all as read
    async apiMarkAllAsRead(req, res) {
        try {
            if (!req.session.user) {
                return res.status(401).json({ success: false, error: 'Not authenticated' });
            }

            await Notification.markAllAsRead(req.session.user.id);
            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ success: false, error: 'Failed to mark all as read' });
        }
    }

    // API: Delete notification
    async apiDelete(req, res) {
        try {
            if (!req.session.user) {
                return res.status(401).json({ success: false, error: 'Not authenticated' });
            }

            await Notification.delete(req.params.id, req.session.user.id);
            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ success: false, error: 'Failed to delete notification' });
        }
    }

    // API: Delete all notifications
    async apiDeleteAll(req, res) {
        try {
            if (!req.session.user) {
                return res.status(401).json({ success: false, error: 'Not authenticated' });
            }

            await Notification.deleteAll(req.session.user.id);
            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ success: false, error: 'Failed to delete notifications' });
        }
    }
}

export default new NotificationController();
