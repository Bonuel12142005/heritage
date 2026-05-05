import { db } from './db.js';

class Review {
  static async findAll(filters = {}) {
    let query = 'SELECT r.*, u.username as user_name, d.name as destination_name FROM reviews r LEFT JOIN users u ON r.user_id = u.id LEFT JOIN destinations d ON r.destination_id = d.id WHERE 1=1';
    const params = [];

    if (filters.status) {
      query += ' AND r.status = ?';
      params.push(filters.status);
    }

    if (filters.destination_id) {
      query += ' AND r.destination_id = ?';
      params.push(filters.destination_id);
    }

    query += ' ORDER BY r.created_at DESC';

    const [rows] = await db.query(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT r.*, u.username as user_name, d.name as destination_name FROM reviews r LEFT JOIN users u ON r.user_id = u.id LEFT JOIN destinations d ON r.destination_id = d.id WHERE r.id = ?', [id]);
    return rows[0];
  }

  static async create(reviewData) {
    const { user_id, destination_id, rating, title, comment } = reviewData;
    
    const [result] = await db.query(
      'INSERT INTO reviews (user_id, destination_id, rating, title, comment) VALUES (?, ?, ?, ?, ?)',
      [user_id, destination_id, rating, title, comment]
    );
    
    // Update destination average rating
    await Review.updateDestinationRating(destination_id);
    
    return result.insertId;
  }

  static async updateStatus(id, status) {
    await db.query('UPDATE reviews SET status = ? WHERE id = ?', [status, id]);
    
    // Get destination_id to update rating
    const [rows] = await db.query('SELECT destination_id FROM reviews WHERE id = ?', [id]);
    if (rows[0]) {
      await Review.updateDestinationRating(rows[0].destination_id);
    }
  }

  static async updateDestinationRating(destinationId) {
    const [result] = await db.query('UPDATE destinations SET average_rating = (SELECT AVG(rating) FROM reviews WHERE destination_id = ? AND status = \"approved\") WHERE id = ?', [destinationId, destinationId]);
    return result;
  }

  static async getPendingCount() {
    const [rows] = await db.query('SELECT COUNT(*) as count FROM reviews WHERE status = \"pending\"');
    return rows[0].count;
  }
}

export { Review };
