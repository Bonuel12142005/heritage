import { db } from '../models/db.js';

class DestinationController {
  async getAllDestinations(req, res) {
    try {
      const [destinations] = await db.query(`
        SELECT * FROM destinations WHERE status = 'active' ORDER BY name
      `);
      res.json(destinations);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      res.status(500).json({ error: 'Failed to fetch destinations' });
    }
  }

  async createDestination(req, res) {
    try {
      const { name, description, site_type, address, operating_hours, entry_fee, contact_info } = req.body;
      
      const [result] = await db.query(`
        INSERT INTO destinations (name, description, site_type, address, operating_hours, entry_fee, contact_info)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [name, description, site_type, address, operating_hours, entry_fee, contact_info]);

      res.status(201).json({ 
        message: 'Destination created successfully', 
        id: result.insertId 
      });
    } catch (error) {
      console.error('Error creating destination:', error);
      res.status(500).json({ error: 'Failed to create destination' });
    }
  }

  // Placeholder methods for future implementation
  async updateDestination(req, res) {
    res.status(501).json({ error: 'Not implemented yet' });
  }

  async deleteDestination(req, res) {
    res.status(501).json({ error: 'Not implemented yet' });
  }
}

export default new DestinationController();