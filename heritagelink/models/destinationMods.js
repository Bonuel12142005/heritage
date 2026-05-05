import { db } from './db.js';

class Destination {
  static async findAll(filters = {}) {
    let query = `SELECT d.*, u.username as created_by_name, 
                 (SELECT url FROM destination_images WHERE destination_id = d.id AND is_primary = 1 LIMIT 1) as image_url
                 FROM destinations d 
                 LEFT JOIN users u ON d.created_by = u.id 
                 WHERE d.status = "active"`;
    const params = [];

    if (filters.site_type) {
      query += ' AND d.site_type = ?';
      params.push(filters.site_type);
    }

    if (filters.search) {
      query += ' AND (d.name LIKE ? OR d.description LIKE ?)';
      params.push('%' + filters.search + '%', '%' + filters.search + '%');
    }

    if (filters.featured) {
      query += ' AND d.featured = TRUE';
    }

    query += ' ORDER BY d.average_rating DESC, d.name ASC';

    const [rows] = await db.query(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT d.*, u.username as created_by_name FROM destinations d LEFT JOIN users u ON d.created_by = u.id WHERE d.id = ?', [id]);
    return rows[0];
  }

  static async findByType(site_type) {
    const [rows] = await db.query('SELECT * FROM destinations WHERE site_type = ? AND status = \"active\" ORDER BY name', [site_type]);
    return rows;
  }

  static async getFeatured() {
    const [rows] = await db.query('SELECT * FROM destinations WHERE featured = TRUE AND status = \"active\" ORDER BY average_rating DESC LIMIT 6');
    return rows;
  }

  static async getTypes() {
    const [rows] = await db.query('SELECT DISTINCT site_type FROM destinations WHERE status = \"active\" ORDER BY site_type');
    return rows.map(row => row.site_type);
  }

  static async create(destinationData) {
    const { 
      name, 
      description, 
      historical_background = null, 
      site_type = 'Cultural', 
      address = null, 
      location = null, 
      category = 'Cultural', 
      entrance_fee = 0, 
      opening_hours = null, 
      contact_info = null, 
      featured = 0, 
      visitor_guidelines = null, 
      created_by = null, 
      latitude = null, 
      longitude = null,
      status = 'active' // Default to active
    } = destinationData;

    const [result] = await db.query(
      'INSERT INTO destinations (name, description, historical_background, site_type, address, location, category, entrance_fee, opening_hours, contact_info, featured, visitor_guidelines, created_by, latitude, longitude, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, description, historical_background, site_type, address, location, category, entrance_fee, opening_hours, contact_info, featured, visitor_guidelines, created_by, latitude, longitude, status]
    );
    return result.insertId || result.insert_id || null;
  }

  static async update(id, destinationData) {
    const fields = [];
    const params = [];

    Object.keys(destinationData).forEach(key => {
      if (destinationData[key] !== undefined) {
        fields.push(key + ' = ?');
        params.push(destinationData[key]);
      }
    });

    params.push(id);
    if (fields.length > 0) {
      await db.query('UPDATE destinations SET ' + fields.join(', ') + ' WHERE id = ?', params);
    }
  }

  static async delete(id) {
    // Soft delete - set status to deleted
    await db.query('UPDATE destinations SET status = ? WHERE id = ?', ['deleted', id]);
  }
}

class DestinationImage {
  static async findByDestination(destinationId) {
    const [rows] = await db.query('SELECT * FROM destination_images WHERE destination_id = ? ORDER BY is_primary DESC', [destinationId]);
    return rows;
  }
}

export { Destination, DestinationImage };
