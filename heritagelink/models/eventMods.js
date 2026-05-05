import { db } from './db.js';

class Event {
  static async findAll(filters = {}) {
    let query = 'SELECT e.*, u.username as created_by_name FROM events e LEFT JOIN users u ON e.created_by = u.id WHERE 1=1';
    const params = [];

    if (filters.status) {
      // support older rows that use is_active flag instead of status
      if (filters.status === 'active') {
        query += ' AND (e.status = ? OR e.is_active = 1)';
        params.push(filters.status);
      } else {
        query += ' AND e.status = ?';
        params.push(filters.status);
      }
    } else {
      // By default, exclude deleted events
      query += ' AND (e.status IS NULL OR e.status != "deleted")';
    }

    if (filters.event_type) {
      query += ' AND e.event_type = ?';
      params.push(filters.event_type);
    }

    if (filters.upcoming) {
      query += ' AND e.event_date >= CURDATE()';
    }

    query += ' ORDER BY e.event_date ASC, e.event_time ASC';

    const [rows] = await db.query(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT e.*, u.username as created_by_name FROM events e LEFT JOIN users u ON e.created_by = u.id WHERE e.id = ?', [id]);
    return rows[0];
  }

  static async create(eventData) {
    const { title, description = null, event_date = null, event_time = null, location = null, organizer = null, contact_info = null, ticket_price = 0, max_attendees = 0, is_active = 1, created_by = null, image_url = null, status = 'active' } = eventData;

    const [result] = await db.query(
      'INSERT INTO events (title, description, event_date, event_time, location, organizer, contact_info, ticket_price, max_attendees, is_active, created_by, image_url, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, event_date, event_time, location, organizer, contact_info, ticket_price, max_attendees, is_active, created_by, image_url, status]
    );
    return result.insertId || result.insert_id || null;
  }

  static async update(id, eventData) {
    const fields = [];
    const params = [];

    Object.keys(eventData).forEach(key => {
      if (eventData[key] !== undefined) {
        fields.push(key + ' = ?');
        params.push(eventData[key]);
      }
    });

    params.push(id);
    if (fields.length > 0) {
      await db.query('UPDATE events SET ' + fields.join(', ') + ' WHERE id = ?', params);
    }
  }

  static async delete(id) {
    // Soft delete
    await db.query('UPDATE events SET status = ? WHERE id = ?', ['deleted', id]);
  }

  static async getUpcoming(limit = 10) {
    // include rows that are marked active via status='active' or legacy is_active flag
    const [rows] = await db.query('SELECT * FROM events WHERE event_date >= CURDATE() AND (status = "active" OR is_active = 1) ORDER BY event_date ASC LIMIT ?', [limit]);
    return rows;
  }
}

export { Event };
