import { sequelize } from '../models/db.js';
import bcrypt from 'bcryptjs';

const createTables = async () => {
  console.log('🔧 Creating database tables...\n');

  const queries = [
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255),
      name VARCHAR(255),
      email VARCHAR(255) UNIQUE,
      password VARCHAR(255),
      role ENUM('admin', 'artisan', 'user') DEFAULT 'user',
      status VARCHAR(50) DEFAULT 'active',
      phone VARCHAR(50),
      address TEXT,
      business_name VARCHAR(255),
      specialization VARCHAR(255),
      bio TEXT,
      profile_photo VARCHAR(255),
      featured TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Events table
    `CREATE TABLE IF NOT EXISTS events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      event_date DATE,
      event_time TIME,
      location VARCHAR(255),
      organizer VARCHAR(255),
      contact_info VARCHAR(255),
      ticket_price DECIMAL(10,2) DEFAULT 0,
      max_attendees INT DEFAULT 0,
      is_active TINYINT(1) DEFAULT 1,
      status VARCHAR(50) DEFAULT 'active',
      image_url VARCHAR(255),
      created_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Event RSVPs table
    `CREATE TABLE IF NOT EXISTS event_rsvps (
      id INT AUTO_INCREMENT PRIMARY KEY,
      event_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      phone VARCHAR(50),
      guests INT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Event Images table
    `CREATE TABLE IF NOT EXISTS event_images (
      id INT AUTO_INCREMENT PRIMARY KEY,
      event_id INT NOT NULL,
      url VARCHAR(255) NOT NULL,
      caption VARCHAR(255),
      is_primary TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Products table
    `CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) DEFAULT 0,
      artisan_id INT,
      product_image VARCHAR(255),
      category VARCHAR(100),
      status VARCHAR(50) DEFAULT 'available',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Destinations table
    `CREATE TABLE IF NOT EXISTS destinations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      historical_background TEXT,
      site_type VARCHAR(100) DEFAULT 'Cultural',
      address VARCHAR(255),
      location VARCHAR(255),
      category VARCHAR(100) DEFAULT 'Cultural',
      entrance_fee DECIMAL(10,2) DEFAULT 0,
      opening_hours VARCHAR(255),
      contact_info VARCHAR(255),
      featured TINYINT(1) DEFAULT 0,
      visitor_guidelines TEXT,
      average_rating DECIMAL(3,2) DEFAULT 0,
      latitude DECIMAL(10,8),
      longitude DECIMAL(11,8),
      status VARCHAR(50) DEFAULT 'active',
      created_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Destination Images table
    `CREATE TABLE IF NOT EXISTS destination_images (
      id INT AUTO_INCREMENT PRIMARY KEY,
      destination_id INT NOT NULL,
      url VARCHAR(255) NOT NULL,
      caption VARCHAR(255),
      is_primary TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Reviews table
    `CREATE TABLE IF NOT EXISTS reviews (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      destination_id INT,
      rating INT NOT NULL,
      title VARCHAR(255),
      comment TEXT,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Feedback table
    `CREATE TABLE IF NOT EXISTS feedback (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      category VARCHAR(100) DEFAULT 'general',
      subject VARCHAR(255),
      message TEXT NOT NULL,
      rating INT,
      is_anonymous TINYINT(1) DEFAULT 0,
      status VARCHAR(50) DEFAULT 'pending',
      admin_response TEXT,
      responded_by INT,
      responded_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Heritage Items table
    `CREATE TABLE IF NOT EXISTS heritage_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      category VARCHAR(100),
      media_type VARCHAR(50),
      media_url VARCHAR(255),
      thumbnail_url VARCHAR(255),
      contributor VARCHAR(255),
      tags TEXT,
      status VARCHAR(50) DEFAULT 'published',
      created_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Heritage Gallery table
    `CREATE TABLE IF NOT EXISTS heritage_gallery (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      category VARCHAR(100),
      media_type VARCHAR(50),
      file_url VARCHAR(255),
      thumbnail_url VARCHAR(255),
      metadata TEXT,
      uploaded_by INT,
      status VARCHAR(50) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Tourism Services table
    `CREATE TABLE IF NOT EXISTS tourism_services (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      type VARCHAR(100),
      description TEXT,
      contact_info VARCHAR(255),
      address TEXT,
      operating_hours VARCHAR(255),
      accreditation_status VARCHAR(100),
      status VARCHAR(50) DEFAULT 'active',
      created_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Artisans table
    `CREATE TABLE IF NOT EXISTS artisans (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      bio TEXT,
      specialty VARCHAR(255),
      contact_email VARCHAR(255),
      contact_phone VARCHAR(50),
      address TEXT,
      story TEXT,
      status VARCHAR(50) DEFAULT 'active',
      created_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Artisan Products table
    `CREATE TABLE IF NOT EXISTS artisan_products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      artisan_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      category VARCHAR(100),
      price_range VARCHAR(100),
      external_link VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Settings table
    `CREATE TABLE IF NOT EXISTS settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      setting_key VARCHAR(255) UNIQUE NOT NULL,
      value TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Notifications table
    `CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      sender_id INT,
      type VARCHAR(50) DEFAULT 'general',
      title VARCHAR(255),
      message TEXT,
      link VARCHAR(255),
      is_read TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Map Places table
    `CREATE TABLE IF NOT EXISTS map_places (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      category VARCHAR(100),
      type VARCHAR(100),
      latitude DECIMAL(10,8),
      longitude DECIMAL(11,8),
      address TEXT,
      contact VARCHAR(255),
      opening_hours VARCHAR(255),
      entrance_fee DECIMAL(10,2) DEFAULT 0,
      price_range VARCHAR(100),
      rating DECIMAL(3,2) DEFAULT 0,
      image_url VARCHAR(255),
      amenities TEXT,
      status VARCHAR(50) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Tourist Routes table
    `CREATE TABLE IF NOT EXISTS tourist_routes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      duration VARCHAR(100),
      distance VARCHAR(100),
      difficulty VARCHAR(50),
      waypoints TEXT,
      category VARCHAR(100),
      image_url VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Portfolio table
    `CREATE TABLE IF NOT EXISTS portfolio (
      id INT AUTO_INCREMENT PRIMARY KEY,
      artisan_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      image_url VARCHAR(255),
      category VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
  ];

  for (const query of queries) {
    try {
      await sequelize.query(query);
      const tableName = query.match(/CREATE TABLE IF NOT EXISTS (\w+)/i)?.[1];
      console.log(`✅ Table '${tableName}' created/verified`);
    } catch (err) {
      const tableName = query.match(/CREATE TABLE IF NOT EXISTS (\w+)/i)?.[1];
      console.error(`❌ Error creating '${tableName}': ${err.message}`);
    }
  }

  console.log('\n🎉 Database tables setup complete!');
};

const seedDefaultData = async () => {
  console.log('\n🌱 Seeding default data...\n');

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Check if admin exists
    const [admins] = await sequelize.query("SELECT id FROM users WHERE email = 'admin@heritagelink.com'");
    
    if (!admins || admins.length === 0) {
      await sequelize.query(`
        INSERT INTO users (username, name, email, password, role, status) 
        VALUES ('admin', 'Administrator', 'admin@heritagelink.com', '${hashedPassword}', 'admin', 'active')
      `);
      console.log('✅ Admin user created (admin@heritagelink.com / admin123)');
    } else {
      // Update existing admin password
      await sequelize.query(`UPDATE users SET password = '${hashedPassword}' WHERE email = 'admin@heritagelink.com'`);
      console.log('✅ Admin password updated');
    }

    // Check if artisan exists
    const [artisans] = await sequelize.query("SELECT id FROM users WHERE email = 'artisan@heritagelink.com'");
    
    if (!artisans || artisans.length === 0) {
      const artisanPass = await bcrypt.hash('artisan123', 10);
      await sequelize.query(`
        INSERT INTO users (username, name, email, password, role, status, specialization, bio) 
        VALUES ('juan_artisan', 'Juan Artisan', 'artisan@heritagelink.com', '${artisanPass}', 'artisan', 'active', 'Weaving & Basketry', 'Traditional craftsman')
      `);
      console.log('✅ Artisan user created (artisan@heritagelink.com / artisan123)');
    } else {
      console.log('ℹ️  Artisan user already exists');
    }

    // Check if regular user exists
    const [users] = await sequelize.query("SELECT id FROM users WHERE email = 'user@heritagelink.com'");
    
    if (!users || users.length === 0) {
      const userPass = await bcrypt.hash('user123', 10);
      await sequelize.query(`
        INSERT INTO users (username, name, email, password, role, status) 
        VALUES ('maria_user', 'Maria User', 'user@heritagelink.com', '${userPass}', 'user', 'active')
      `);
      console.log('✅ Regular user created (user@heritagelink.com / user123)');
    } else {
      console.log('ℹ️  Regular user already exists');
    }

  } catch (err) {
    console.error('❌ Seeding error:', err.message);
  }

  console.log('\n🎉 Seeding complete!');
};

// Run setup
(async () => {
  try {
    await createTables();
    await seedDefaultData();
    console.log('\n✨ Setup finished successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Setup failed:', err.message);
    process.exit(1);
  }
})();
