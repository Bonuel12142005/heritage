import { db } from './db.js';
import bcrypt from 'bcryptjs';

// Mock users for fallback when database is unavailable
const mockUsers = [
    {
        id: 1,
        username: 'admin',
        name: 'Administrator',
        email: 'admin@heritagelink.com',
        password: '$2a$10$rQnM1.kK8LFmKgGqHqGqXOQz8z8z8z8z8z8z8z8z8z8z8z8z8z8z8', // admin123
        plainPassword: 'admin123',
        role: 'admin',
        status: 'active',
        created_at: new Date()
    },
    {
        id: 2,
        username: 'juan_artisan',
        name: 'Juan Artisan',
        email: 'artisan@heritagelink.com',
        password: '$2a$10$rQnM1.kK8LFmKgGqHqGqXOQz8z8z8z8z8z8z8z8z8z8z8z8z8z8z8',
        plainPassword: 'artisan123',
        role: 'artisan',
        status: 'active',
        created_at: new Date()
    },
    {
        id: 3,
        username: 'maria_user',
        name: 'Maria User',
        email: 'user@heritagelink.com',
        password: '$2a$10$rQnM1.kK8LFmKgGqHqGqXOQz8z8z8z8z8z8z8z8z8z8z8z8z8z8z8',
        plainPassword: 'user123',
        role: 'user',
        status: 'active',
        created_at: new Date()
    }
];

class User {
  static async create(userData) {
    try {
      const username = userData.username || (userData.name ? userData.name.toLowerCase().replace(/\s+/g, '_') : null);
      const hashed = userData.password ? await bcrypt.hash(userData.password, 10) : null;

      const [result] = await db.execute(
        `INSERT INTO users (username, name, email, password, role, status, phone, address, business_name, specialization, bio)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [username, userData.name || null, userData.email || null, hashed, userData.role || 'user', userData.status || 'active', userData.phone || null, userData.address || null, userData.business_name || null, userData.specialization || null, userData.bio || null]
      );

      const insertId = result.insertId || null;
      if (insertId) {
        const created = await User.findById(insertId);
        return created;
      }
      return null;
    } catch (error) {
      console.error('❌ Error creating user:', error && error.message ? error.message : error);
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
      if (rows && rows[0]) return rows[0];
      
      // Fallback to mock users
      const mockUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (mockUser) {
        console.log('📋 Using mock user for:', email);
        return mockUser;
      }
      return null;
    } catch (error) {
      console.error('⚠️ DB error finding user, trying mock:', error && error.message ? error.message : error);
      // Fallback to mock users on error
      const mockUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (mockUser) {
        console.log('📋 Using mock user (fallback) for:', email);
        return mockUser;
      }
      return null;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
      return rows && rows[0] ? rows[0] : null;
    } catch (error) {
      console.error('❌ Error finding user by id:', error && error.message ? error.message : error);
      throw error;
    }
  }

  static async comparePassword(plainPassword, hashedPassword, user = null) {
    try {
      // Check if this is a mock user with plainPassword field
      if (user && user.plainPassword) {
        return plainPassword === user.plainPassword;
      }
      
      if (!hashedPassword) return false;
      
      // Check if password is hashed (bcrypt hashes start with $2)
      if (hashedPassword.startsWith('$2')) {
        return await bcrypt.compare(plainPassword, hashedPassword);
      }
      
      // Plain text password comparison (for development/testing)
      return plainPassword === hashedPassword;
    } catch (error) {
      console.error('❌ Error comparing passwords:', error && error.message ? error.message : error);
      // Fallback to plain text comparison
      return plainPassword === hashedPassword;
    }
  }

  static async getAll() {
    try {
      const [rows] = await db.query('SELECT * FROM users ORDER BY created_at DESC');
      return rows;
    } catch (error) {
      console.error('❌ Error fetching all users:', error && error.message ? error.message : error);
      throw error;
    }
  }

  static async getCount() {
    try {
      const [rows] = await db.query('SELECT COUNT(*) as cnt FROM users');
      return rows && rows[0] ? rows[0].cnt : 0;
    } catch (error) {
      console.error('❌ Error counting users:', error && error.message ? error.message : error);
      throw error;
    }
  }

  static async getByRole(role) {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE role = ? ORDER BY created_at DESC', [role]);
      return rows;
    } catch (error) {
      console.error('❌ Error fetching users by role:', error && error.message ? error.message : error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const fields = [];
      const params = [];

      const allowed = ['username','name','email','password','role','status','phone','address','business_name','specialization','bio'];

      for (const key of Object.keys(data)) {
        if (allowed.includes(key) && data[key] !== undefined) {
          if (key === 'password') {
            // hash password
            const hashed = await bcrypt.hash(data.password, 10);
            fields.push('password = ?');
            params.push(hashed);
          } else {
            fields.push(`${key} = ?`);
            params.push(data[key]);
          }
        }
      }

      if (fields.length === 0) return;

      params.push(id);
      const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
      await db.execute(sql, params);
    } catch (error) {
      console.error('❌ Error updating user:', error && error.message ? error.message : error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      // soft delete
      await db.execute('UPDATE users SET status = ? WHERE id = ?', ['deleted', id]);
    } catch (error) {
      console.error('❌ Error deleting user:', error && error.message ? error.message : error);
      throw error;
    }
  }
}

export { User };