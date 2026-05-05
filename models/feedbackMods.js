import { db } from './db.js';

class Feedback {
    static async findAll(filters = {}) {
        let query = `
            SELECT f.*, u.name as user_name, u.email as user_email,
                   admin.name as admin_name
            FROM feedback f
            LEFT JOIN users u ON f.user_id = u.id
            LEFT JOIN users admin ON f.responded_by = admin.id
            WHERE 1=1
        `;
        const params = [];

        if (filters.status) {
            query += ' AND f.status = ?';
            params.push(filters.status);
        }
        if (filters.category) {
            query += ' AND f.category = ?';
            params.push(filters.category);
        }
        if (filters.user_id) {
            query += ' AND f.user_id = ?';
            params.push(filters.user_id);
        }

        query += ' ORDER BY f.created_at DESC';

        if (filters.limit) {
            query += ' LIMIT ?';
            params.push(parseInt(filters.limit));
        }

        const [rows] = await db.query(query, params);
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query(`
            SELECT f.*, u.name as user_name, u.email as user_email,
                   admin.name as admin_name
            FROM feedback f
            LEFT JOIN users u ON f.user_id = u.id
            LEFT JOIN users admin ON f.responded_by = admin.id
            WHERE f.id = ?
        `, [id]);
        return rows[0];
    }

    static async create(data) {
        const { user_id, category, subject, message, rating, is_anonymous } = data;
        const [result] = await db.query(
            `INSERT INTO feedback (user_id, category, subject, message, rating, is_anonymous)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [user_id || null, category || 'general', subject, message, rating || null, is_anonymous ? 1 : 0]
        );
        return result.insertId;
    }

    static async respond(id, adminId, response) {
        await db.query(
            `UPDATE feedback SET admin_response = ?, responded_by = ?, responded_at = NOW(), status = 'reviewed'
             WHERE id = ?`,
            [response, adminId, id]
        );
    }

    static async updateStatus(id, status) {
        await db.query('UPDATE feedback SET status = ? WHERE id = ?', [status, id]);
    }

    static async delete(id) {
        await db.query('DELETE FROM feedback WHERE id = ?', [id]);
    }

    static async getStats() {
        const [rows] = await db.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 'reviewed' THEN 1 ELSE 0 END) as reviewed,
                SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved,
                AVG(rating) as avg_rating
            FROM feedback
        `);
        return rows[0];
    }

    static async getCategoryStats() {
        const [rows] = await db.query(`
            SELECT category, COUNT(*) as count, AVG(rating) as avg_rating
            FROM feedback
            GROUP BY category
            ORDER BY count DESC
        `);
        return rows;
    }
}

export { Feedback };
