import { db } from './db.js';

// Mock notifications for fallback
const mockNotifications = [];

class Notification {
    // Get all notifications for a user
    static async findByUser(userId, limit = 20) {
        try {
            const safeLimit = parseInt(limit) || 20;
            const [rows] = await db.query(`
                SELECT n.*, u.name as sender_name, u.profile_photo as sender_photo
                FROM notifications n
                LEFT JOIN users u ON n.sender_id = u.id
                WHERE n.user_id = ?
                ORDER BY n.created_at DESC
                LIMIT ${safeLimit}
            `, [userId]);
            return rows || [];
        } catch (err) {
            console.log('Notification findByUser using mock:', err.message);
            return mockNotifications.filter(n => n.user_id === userId).slice(0, limit);
        }
    }

    // Get unread count
    static async getUnreadCount(userId) {
        try {
            const [rows] = await db.query(
                'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0',
                [userId]
            );
            return rows[0]?.count || 0;
        } catch (err) {
            console.log('Notification getUnreadCount using mock:', err.message);
            return mockNotifications.filter(n => n.user_id === userId && !n.is_read).length;
        }
    }

    // Create notification
    static async create(data) {
        try {
            const { user_id, sender_id, type, title, message, link } = data;
            const [result] = await db.query(
                `INSERT INTO notifications (user_id, sender_id, type, title, message, link, is_read, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, 0, NOW())`,
                [user_id, sender_id || null, type || 'general', title, message, link || null]
            );
            return result.insertId;
        } catch (err) {
            console.log('Notification create using mock:', err.message);
            const newId = mockNotifications.length + 1;
            mockNotifications.push({
                id: newId,
                ...data,
                is_read: false,
                created_at: new Date()
            });
            return newId;
        }
    }

    // Mark as read
    static async markAsRead(id, userId) {
        try {
            await db.query(
                'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
                [id, userId]
            );
        } catch (err) {
            console.log('Notification markAsRead using mock:', err.message);
            const notif = mockNotifications.find(n => n.id === parseInt(id) && n.user_id === userId);
            if (notif) notif.is_read = true;
        }
    }

    // Mark all as read
    static async markAllAsRead(userId) {
        try {
            await db.query(
                'UPDATE notifications SET is_read = 1 WHERE user_id = ?',
                [userId]
            );
        } catch (err) {
            console.log('Notification markAllAsRead using mock:', err.message);
            mockNotifications.filter(n => n.user_id === userId).forEach(n => n.is_read = true);
        }
    }

    // Delete notification
    static async delete(id, userId) {
        try {
            await db.query(
                'DELETE FROM notifications WHERE id = ? AND user_id = ?',
                [id, userId]
            );
        } catch (err) {
            console.log('Notification delete using mock:', err.message);
            const idx = mockNotifications.findIndex(n => n.id === parseInt(id) && n.user_id === userId);
            if (idx !== -1) mockNotifications.splice(idx, 1);
        }
    }

    // Delete all for user
    static async deleteAll(userId) {
        try {
            await db.query('DELETE FROM notifications WHERE user_id = ?', [userId]);
        } catch (err) {
            console.log('Notification deleteAll using mock:', err.message);
            const toRemove = mockNotifications.filter(n => n.user_id === userId);
            toRemove.forEach(n => {
                const idx = mockNotifications.indexOf(n);
                if (idx !== -1) mockNotifications.splice(idx, 1);
            });
        }
    }

    // Create system notification for multiple users
    static async broadcast(userIds, data) {
        for (const userId of userIds) {
            await this.create({ ...data, user_id: userId });
        }
    }

    // Notification types with icons
    static getTypeConfig(type) {
        const types = {
            message: { icon: 'fa-envelope', color: '#3b82f6', label: 'New Message' },
            order: { icon: 'fa-shopping-cart', color: '#10b981', label: 'Order Update' },
            review: { icon: 'fa-star', color: '#f59e0b', label: 'New Review' },
            event: { icon: 'fa-calendar', color: '#8b5cf6', label: 'Event' },
            system: { icon: 'fa-bell', color: '#6b7280', label: 'System' },
            workshop: { icon: 'fa-chalkboard-teacher', color: '#ec4899', label: 'Workshop' },
            product: { icon: 'fa-box', color: '#14b8a6', label: 'Product' },
            feedback: { icon: 'fa-comment-dots', color: '#f97316', label: 'Feedback' },
            feedback_response: { icon: 'fa-reply', color: '#22c55e', label: 'Feedback Response' },
            general: { icon: 'fa-info-circle', color: '#6366f1', label: 'Notification' }
        };
        return types[type] || types.general;
    }
}

export { Notification };
