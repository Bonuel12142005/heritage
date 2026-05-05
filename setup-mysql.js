// Setup MySQL Database for HeritageLink
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function setupDatabase() {
    let connection;
    
    try {
        console.log('🔧 Setting up MySQL database for HeritageLink...\n');
        
        // Connect to MySQL server (without specifying database)
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });
        
        console.log('✅ Connected to MySQL server');
        
        // Create database if it doesn't exist
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'heritagelink'} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        console.log(`✅ Database '${process.env.DB_NAME || 'heritagelink'}' created/verified`);
        
        // Connect to the specific database
        await connection.end();
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'heritagelink'
        });
        
        console.log('\n🏗️ Creating tables...');
        
        // Create users table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'artisan', 'user') DEFAULT 'user',
                name VARCHAR(255),
                phone VARCHAR(50),
                address TEXT,
                profile_photo VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ Users table created');
        
        // Create destinations table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS destinations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                location VARCHAR(255),
                latitude DECIMAL(10, 8),
                longitude DECIMAL(11, 8),
                image_url VARCHAR(255),
                category VARCHAR(100),
                status ENUM('active', 'inactive') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ Destinations table created');
        
        // Create artisan_products table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS artisan_products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                artisan_id INT,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                price DECIMAL(10, 2),
                image_url VARCHAR(255),
                category VARCHAR(100),
                stock_quantity INT DEFAULT 0,
                status ENUM('active', 'inactive') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (artisan_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ Artisan products table created');
        
        console.log('\n🎯 MySQL database setup complete!');
        console.log('');
        console.log('📊 Database Information:');
        console.log(`• Host: ${process.env.DB_HOST || 'localhost'}`);
        console.log(`• Port: ${process.env.DB_PORT || 3306}`);
        console.log(`• Database: ${process.env.DB_NAME || 'heritagelink'}`);
        console.log(`• User: ${process.env.DB_USER || 'root'}`);
        console.log('');
        console.log('🔗 Access via phpMyAdmin:');
        console.log('• URL: http://localhost/phpmyadmin');
        console.log('• Server: localhost');
        console.log(`• Username: ${process.env.DB_USER || 'root'}`);
        console.log(`• Password: ${process.env.DB_PASSWORD || '(empty)'}`);
        console.log(`• Database: ${process.env.DB_NAME || 'heritagelink'}`);
        console.log('');
        console.log('🚀 Ready to start server: node server.js');
        
    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        console.error('');
        console.error('🔧 Troubleshooting:');
        console.error('1. Make sure MySQL/XAMPP is running');
        console.error('2. Check your .env file database settings');
        console.error('3. Verify MySQL credentials are correct');
        console.error('4. Ensure MySQL port 3306 is available');
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

setupDatabase();