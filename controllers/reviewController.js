import { db } from '../models/db.js';

class ReviewController {
  async getPendingReviews(req, res) {
    try {
      if (req.session.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
      }

      const [reviews] = await db.query('SELECT r.*, u.username as user_name, d.name as destination_name FROM reviews r LEFT JOIN users u ON r.user_id = u.id LEFT JOIN destinations d ON r.destination_id = d.id WHERE r.status = \"pending\" ORDER BY r.created_at DESC');
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch pending reviews' });
    }
  }

  async updateReviewStatus(req, res) {
    try {
      if (req.session.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
      }

      const { id } = req.params;
      const { status } = req.body;
      
      await db.query('UPDATE reviews SET status = ? WHERE id = ?', [status, id]);
      res.json({ message: 'Review status updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update review status' });
    }
  }
}

export default new ReviewController();
