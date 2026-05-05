import { db } from './db.js';

class Product {
  static async findAll(filters = {}) {
    let query = 'SELECT p.*, u.username as artisan_name FROM products p LEFT JOIN users u ON p.artisan_id = u.id WHERE 1=1';
    const params = [];

    if (filters.status) {
      query += ' AND p.status = ?';
      params.push(filters.status);
    }
    
    if (filters.artisan_id) {
      query += ' AND p.artisan_id = ?';
      params.push(filters.artisan_id);
    }

    query += ' ORDER BY p.created_at DESC';

    const [rows] = await db.query(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT p.*, u.username as artisan_name FROM products p LEFT JOIN users u ON p.artisan_id = u.id WHERE p.id = ?', [id]);
    return rows[0];
  }

  static async create(data) {
    const { name, description = null, price = 0, artisan_id = null, product_image = null, category = null } = data;
    
    // Build dynamic insert query
    const fields = ['name', 'description', 'price', 'artisan_id', 'status'];
    const values = [name, description, price, artisan_id, 'available'];
    
    if (product_image) {
      fields.push('product_image');
      values.push(product_image);
    }
    
    if (category) {
      fields.push('category');
      values.push(category);
    }
    
    const placeholders = fields.map(() => '?').join(', ');
    const query = `INSERT INTO products (${fields.join(', ')}) VALUES (${placeholders})`;
    
    const [result] = await db.execute(query, values);
    return result.insertId || null;
  }

  static async updateStatus(id, status) {
    await db.execute('UPDATE products SET status = ? WHERE id = ?', [status, id]);
  }

  static async delete(id) {
    await db.execute('DELETE FROM products WHERE id = ?', [id]);
  }
  
  static async update(id, data) {
    const { name, description, price, product_image, category } = data;
    
    const fields = [];
    const values = [];
    
    if (name !== undefined) { fields.push('name = ?'); values.push(name); }
    if (description !== undefined) { fields.push('description = ?'); values.push(description); }
    if (price !== undefined) { fields.push('price = ?'); values.push(price); }
    if (product_image !== undefined) { fields.push('product_image = ?'); values.push(product_image); }
    if (category !== undefined) { fields.push('category = ?'); values.push(category); }
    
    if (fields.length === 0) return;
    
    values.push(id);
    const query = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
    await db.execute(query, values);
  }
}

export { Product };
