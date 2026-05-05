import mysql from 'mysql2/promise';
import crypto from 'crypto';

// Simple password hashing using crypto (no bcrypt dependency)
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

async function ensureUsersExist() {
    const connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'heritagelink'
    });

    console.log('Connected to database');

    try {
        // Check if users table exists
        const [tables] = await connection.execute(`SHOW TABLES LIKE 'users'`);
        if (tables.length === 0) {
            console.log('Creating users table...');
            await connection.execute(`
                CREATE TABLE users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(100),
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL,
                    role ENUM('admin', 'artisan', 'user') DEFAULT 'user',
                    status VARCHAR(50) DEFAULT 'active',
                    profile_photo VARCHAR(500),
                    phone VARCHAR(50),
                    address VARCHAR(500),
                    bio TEXT,
                    contact_number VARCHAR(50),
                    business_name VARCHAR(255),
                    specialization VARCHAR(255),
                    facebook_url VARCHAR(500),
                    instagram_url VARCHAR(500),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    INDEX idx_email (email),
                    INDEX idx_role (role)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `);
            console.log('✓ Users table created');
        }

        // Use plain passwords for testing (in production, use bcrypt)
        const adminPassword = 'admin123';
        const artisanPassword = 'artisan123';
        const userPassword = 'user123';

        // Check and insert admin user
        const [adminExists] = await connection.execute(`SELECT id FROM users WHERE email = 'admin@heritagelink.com'`);
        if (adminExists.length === 0) {
            await connection.execute(`
                INSERT INTO users (username, name, email, password, role, status) 
                VALUES ('admin', 'Administrator', 'admin@heritagelink.com', ?, 'admin', 'active')
            `, [adminPassword]);
            console.log('✓ Admin user created');
        } else {
            // Update password to hashed version
            await connection.execute(`UPDATE users SET password = ? WHERE email = 'admin@heritagelink.com'`, [adminPassword]);
            console.log('✓ Admin user password updated');
        }

        // Check and insert artisan user
        const [artisanExists] = await connection.execute(`SELECT id FROM users WHERE email = 'artisan@heritagelink.com'`);
        if (artisanExists.length === 0) {
            await connection.execute(`
                INSERT INTO users (username, name, email, password, role, status) 
                VALUES ('juan_artisan', 'Juan Artisan', 'artisan@heritagelink.com', ?, 'artisan', 'active')
            `, [artisanPassword]);
            console.log('✓ Artisan user created');
        } else {
            await connection.execute(`UPDATE users SET password = ? WHERE email = 'artisan@heritagelink.com'`, [artisanPassword]);
            console.log('✓ Artisan user password updated');
        }

        // Check and insert regular user
        const [userExists] = await connection.execute(`SELECT id FROM users WHERE email = 'user@heritagelink.com'`);
        if (userExists.length === 0) {
            await connection.execute(`
                INSERT INTO users (username, name, email, password, role, status) 
                VALUES ('maria_user', 'Maria User', 'user@heritagelink.com', ?, 'user', 'active')
            `, [userPassword]);
            console.log('✓ Regular user created');
        } else {
            await connection.execute(`UPDATE users SET password = ? WHERE email = 'user@heritagelink.com'`, [userPassword]);
            console.log('✓ Regular user password updated');
        }

        // Show all users
        const [users] = await connection.execute(`SELECT id, name, email, role, profile_photo FROM users`);
        console.log('\n📋 Users in database:');
        users.forEach(u => {
            console.log(`  - ID: ${u.id}, Name: ${u.name}, Email: ${u.email}, Role: ${u.role}, Photo: ${u.profile_photo || 'none'}`);
        });

        console.log('\n✅ All users are ready in the database!');
        console.log('\nLogin credentials:');
        console.log('  Admin: admin@heritagelink.com / admin123');
        console.log('  Artisan: artisan@heritagelink.com / artisan123');
        console.log('  User: user@heritagelink.com / user123');
    } catch (error) {
        console.error('Migration error:', error.message);
    } finally {
        await connection.end();
    }
}

ensureUsersExist();
