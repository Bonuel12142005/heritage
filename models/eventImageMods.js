import { db } from './db.js';

class EventImage {
  static async findByEvent(eventId) {
    const [rows] = await db.query('SELECT * FROM event_images WHERE event_id = ? ORDER BY is_primary DESC, id ASC', [eventId]);
    return rows;
  }

  static async create({ event_id, url, caption = null, is_primary = 0 }) {
    const [result] = await db.execute('INSERT INTO event_images (event_id, url, is_primary, caption) VALUES (?, ?, ?, ?)', [event_id, url, is_primary, caption]);
    return result.insertId || null;
  }

  static async setPrimary(id, eventId) {
    // reset existing
    await db.execute('UPDATE event_images SET is_primary = 0 WHERE event_id = ?', [eventId]);
    await db.execute('UPDATE event_images SET is_primary = 1 WHERE id = ? AND event_id = ?', [id, eventId]);
  }

  static async delete(id) {
    await db.execute('DELETE FROM event_images WHERE id = ?', [id]);
  }
}

export { EventImage };
