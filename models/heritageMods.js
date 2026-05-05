import { db } from './db.js';

class HeritageItem {
  static async findAll(filters = {}) {
    let query = 'SELECT h.*, u.username as created_by_name FROM heritage_items h LEFT JOIN users u ON h.created_by = u.id WHERE 1=1';
    const params = [];

    if (filters.category) {
      query += ' AND h.category = ?';
      params.push(filters.category);
    }

    if (filters.status) {
      query += ' AND h.status = ?';
      params.push(filters.status);
    }

    query += ' ORDER BY h.created_at DESC';

    const [rows] = await db.query(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT h.*, u.username as created_by_name FROM heritage_items h LEFT JOIN users u ON h.created_by = u.id WHERE h.id = ?', [id]);
    return rows[0];
  }

  static async create(itemData) {
    const { title, description, category, media_type, media_url, thumbnail_url, contributor, tags, created_by } = itemData;
    
    const [result] = await db.query(
      'INSERT INTO heritage_items (title, description, category, media_type, media_url, thumbnail_url, contributor, tags, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, category, media_type, media_url, thumbnail_url, contributor, tags, created_by]
    );
    return result.insertId;
  }

  static async update(id, itemData) {
    const fields = [];
    const params = [];

    Object.keys(itemData).forEach(key => {
      if (itemData[key] !== undefined) {
        fields.push(key + ' = ?');
        params.push(itemData[key]);
      }
    });

    params.push(id);
    await db.query('UPDATE heritage_items SET ' + fields.join(', ') + ' WHERE id = ?', params);
  }

  static async delete(id) {
    // soft delete to preserve historical records
    await db.query('UPDATE heritage_items SET status = ? WHERE id = ?', ['deleted', id]);
  }

  static async getCategories() {
    const [rows] = await db.query('SELECT DISTINCT category FROM heritage_items WHERE status = \"published\" ORDER BY category');
    return rows.map(row => row.category);
  }
}

export { HeritageItem };
