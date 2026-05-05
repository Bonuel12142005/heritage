const { db } = require('./db');

class Event {
  static async findAll(filters = {}) {
    let query = `
      SELECT e.*, u.username as created_by_name
      FROM events e
      LEFT JOIN users u ON e.created_by = u.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.status) {
      query += ' AND e.status = ?';
      params.push(filters.status);
    }

    if (filters.event_type) {
      query += ' AND e.event_type = ?';
      params.push(filters.event_type);
    }

    if (filters.upcoming) {
      query += ' AND e.event_date >= CURDATE()';
    }

    query += ' ORDER BY e.event_date ASC, e.start_time ASC';

    const [rows] = await db.query(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(`
      SELECT e.*, u.username as created_by_name 
      FROM events e 
      LEFT JOIN users u ON e.created_by = u.id 
      WHERE e.id = ?
    `, [id]);
    return rows[0];
  }

  static async create(eventData) {
    const {
      title, description, event_date, start_time, end_time,
      location, latitude, longitude, event_type, organizer,
      contact_info, featured_image, created_by
    } = eventData;

    const [result] = await db.query(
      `INSERT INTO events 
       (title, description, event_date, start_time, end_time, 
        location, latitude, longitude, event_type, organizer, 
        contact_info, featured_image, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, event_date, start_time, end_time,
       location, latitude, longitude, event_type, organizer,
       contact_info, featured_image, created_by]
    );
    return result.insertId;
  }
}

module.exports = { Event };