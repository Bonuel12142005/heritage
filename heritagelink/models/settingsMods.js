import { db } from './db.js';

class Settings {
  static async getAll() {
    const [rows] = await db.query('SELECT `key`, value FROM settings');
    const out = {};
    rows.forEach(r => { out[r.key] = r.value; });
    return out;
  }

  static async get(key) {
    const [rows] = await db.query('SELECT value FROM settings WHERE `key` = ? LIMIT 1', [key]);
    return rows && rows[0] ? rows[0].value : null;
  }

  static async set(key, value) {
    // insert or update
    await db.execute('INSERT INTO settings (`key`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)', [key, value]);
  }
}

export { Settings };
