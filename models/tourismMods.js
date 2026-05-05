import { db } from './db.js';

class TourismService {
  static async findAll(filters = {}) {
    let query = 'SELECT t.*, u.username as created_by_name FROM tourism_services t LEFT JOIN users u ON t.created_by = u.id WHERE 1=1';
    const params = [];

    if (filters.type) {
      query += ' AND t.type = ?';
      params.push(filters.type);
    }

    if (filters.status) {
      query += ' AND t.status = ?';
      params.push(filters.status);
    }

    query += ' ORDER BY t.type, t.name ASC';

    const [rows] = await db.query(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT t.*, u.username as created_by_name FROM tourism_services t LEFT JOIN users u ON t.created_by = u.id WHERE t.id = ?', [id]);
    return rows[0];
  }

  static async create(serviceData) {
    const { name, type, description, contact_info, address, operating_hours, accreditation_status, created_by } = serviceData;
    
    const [result] = await db.query(
      'INSERT INTO tourism_services (name, type, description, contact_info, address, operating_hours, accreditation_status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, type, description, contact_info, address, operating_hours, accreditation_status, created_by]
    );
    return result.insertId;
  }

  static async update(id, serviceData) {
    const fields = [];
    const params = [];

    Object.keys(serviceData).forEach(key => {
      if (serviceData[key] !== undefined) {
        fields.push(key + ' = ?');
        params.push(serviceData[key]);
      }
    });

    params.push(id);
    await db.query('UPDATE tourism_services SET ' + fields.join(', ') + ' WHERE id = ?', params);
  }

  static async delete(id) {
    // soft delete to preserve data history
    await db.query('UPDATE tourism_services SET status = ? WHERE id = ?', ['deleted', id]);
  }

  static async getEmergencyServices() {
    const [rows] = await db.query('SELECT * FROM tourism_services WHERE type = \"emergency\" AND status = \"active\" ORDER BY name');
    return rows;
  }

  static async getAccommodations() {
    const [rows] = await db.query('SELECT * FROM tourism_services WHERE type = \"accommodation\" AND status = \"active\" ORDER BY name');
    return rows;
  }
}

export { TourismService };
