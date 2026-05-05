import { db } from './db.js';

class Artisan {
  static async findAll(filters = {}) {
    let query = 'SELECT a.*, u.username as created_by_name FROM artisans a LEFT JOIN users u ON a.created_by = u.id WHERE 1=1';
    const params = [];

    if (filters.status) {
      query += ' AND a.status = ?';
      params.push(filters.status);
    }

    query += ' ORDER BY a.name ASC';

    const [rows] = await db.query(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT a.*, u.username as created_by_name FROM artisans a LEFT JOIN users u ON a.created_by = u.id WHERE a.id = ?', [id]);
    return rows[0];
  }

  static async create(artisanData) {
    const { name, bio, specialty, contact_email, contact_phone, address, story, created_by } = artisanData;
    
    const [result] = await db.query(
      'INSERT INTO artisans (name, bio, specialty, contact_email, contact_phone, address, story, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, bio, specialty, contact_email, contact_phone, address, story, created_by]
    );
    return result.insertId;
  }

  static async update(id, artisanData) {
    const fields = [];
    const params = [];

    Object.keys(artisanData).forEach(key => {
      if (artisanData[key] !== undefined) {
        fields.push(key + ' = ?');
        params.push(artisanData[key]);
      }
    });

    params.push(id);
    await db.query('UPDATE artisans SET ' + fields.join(', ') + ' WHERE id = ?', params);
  }

  static async delete(id) {
    // soft delete to keep artisan record for auditing
    await db.query('UPDATE artisans SET status = ? WHERE id = ?', ['deleted', id]);
  }
}

class ArtisanProduct {
  static async findByArtisan(artisanId) {
    const [rows] = await db.query('SELECT * FROM artisan_products WHERE artisan_id = ? ORDER BY created_at DESC', [artisanId]);
    return rows;
  }

  static async create(productData) {
    const { artisan_id, name, description, category, price_range, external_link } = productData;
    
    const [result] = await db.query(
      'INSERT INTO artisan_products (artisan_id, name, description, category, price_range, external_link) VALUES (?, ?, ?, ?, ?, ?)',
      [artisan_id, name, description, category, price_range, external_link]
    );
    return result.insertId;
  }
}

export { Artisan, ArtisanProduct };
