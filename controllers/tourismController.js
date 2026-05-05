import { db } from '../models/db.js';

class TourismController {
  async createService(req, res) {
    try {
      if (req.session.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
      }

      const { name, type, description, contact_info, address, operating_hours, accreditation_status } = req.body;
      
      const [result] = await db.query(
        'INSERT INTO tourism_services (name, type, description, contact_info, address, operating_hours, accreditation_status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [name, type, description, contact_info, address, operating_hours, accreditation_status || false, req.session.user.id]
      );
      
      res.json({ message: 'Tourism service created successfully', id: result.insertId });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create tourism service' });
    }
  }
}

export default new TourismController();
