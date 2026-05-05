import { db } from './db.js';

class EventRsvp {
  static async create({ event_id, name, email = null, phone = null, guests = 1 }) {
    const [result] = await db.execute(
      'INSERT INTO event_rsvps (event_id, name, email, phone, guests) VALUES (?, ?, ?, ?, ?)',
      [event_id, name, email, phone, guests]
    );
    return result.insertId || null;
  }

  static async findByEvent(eventId) {
    const [rows] = await db.query('SELECT * FROM event_rsvps WHERE event_id = ? ORDER BY created_at DESC', [eventId]);
    return rows;
  }

  static async countByEvent(eventId) {
    const [rows] = await db.query('SELECT COUNT(*) as cnt FROM event_rsvps WHERE event_id = ?', [eventId]);
    return rows && rows[0] ? rows[0].cnt : 0;
  }
}

export { EventRsvp };
