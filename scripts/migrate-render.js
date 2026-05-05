import { sequelize } from '../models/db-render.js';
import { QueryTypes } from 'sequelize';

const isPostgreSQL = sequelize.getDialect() === 'postgres';

// Database-agnostic SQL queries
const createUsersTable = isPostgreSQL ? `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    full_name VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    profile_photo VARCHAR(255),
    bio TEXT,
    specialization VARCHAR(100),
    experience_years INTEGER DEFAULT 0,
    portfolio_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
` : `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    full_name VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    profile_photo VARCHAR(255),
    bio TEXT,
    specialization VARCHAR(100),
    experience_years INT DEFAULT 0,
    portfolio_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
`;

const createDestinationsTable = isPostgreSQL ? `
  CREATE TABLE IF NOT EXISTS destinations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    category VARCHAR(100),
    image_url VARCHAR(500),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
` : `
  CREATE TABLE IF NOT EXISTS destinations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    category VARCHAR(100),
    image_url VARCHAR(500),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
`;

const createProductsTable = isPostgreSQL ? `
  CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    artisan_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    category VARCHAR(100),
    product_image VARCHAR(500),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
` : `
  CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    artisan_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    category VARCHAR(100),
    product_image VARCHAR(500),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (artisan_id) REFERENCES users(id) ON DELETE CASCADE
  );
`;

async function runMigrations() {
  try {
    console.log('🔄 Starting database migrations...');
    console.log('Database dialect:', sequelize.getDialect());

    // Create tables
    await sequelize.query(createUsersTable);
    console.log('✅ Users table created/verified');

    await sequelize.query(createDestinationsTable);
    console.log('✅ Destinations table created/verified');

    await sequelize.query(createProductsTable);
    console.log('✅ Products table created/verified');

    // Insert default admin user
    const adminExists = await sequelize.query(
      'SELECT id FROM users WHERE email = ?',
      {
        replacements: ['admin@heritagelink.com'],
        type: QueryTypes.SELECT
      }
    );

    if (adminExists.length === 0) {
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await sequelize.query(
        'INSERT INTO users (username, email, password, role, full_name) VALUES (?, ?, ?, ?, ?)',
        {
          replacements: ['admin', 'admin@heritagelink.com', hashedPassword, 'admin', 'Administrator']
        }
      );
      console.log('✅ Admin user created');
    }

    // Insert default artisan user
    const artisanExists = await sequelize.query(
      'SELECT id FROM users WHERE email = ?',
      {
        replacements: ['artisan@heritagelink.com'],
        type: QueryTypes.SELECT
      }
    );

    if (artisanExists.length === 0) {
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash('artisan123', 10);
      
      await sequelize.query(
        'INSERT INTO users (username, email, password, role, full_name) VALUES (?, ?, ?, ?, ?)',
        {
          replacements: ['artisan', 'artisan@heritagelink.com', hashedPassword, 'artisan', 'Test Artisan']
        }
      );
      console.log('✅ Artisan user created');
    }

    console.log('🎉 All migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migrations if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default runMigrations;