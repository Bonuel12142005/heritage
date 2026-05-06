// Setup Aiven MySQL database for production
import mysql from 'mysql2/promise';

async function setupProduction() {
    console.log('🚀 Setting up Aiven MySQL for production...\n');
    
    try {
        // Connect to Aiven MySQL
        const connection = await mysql.createConnection({
            host: 'mysql-2a6b1cea-heritage-6610.d.aivencloud.com',
            port: 17649,
            user: 'avnadmin',
            password: 'your-aiven-password-here',
            database: 'heritagelink',
            ssl: {
                rejectUnauthorized: false
            }
        });
        
        console.log('✅ Connected to Aiven MySQL!\n');
        
        // Import bcrypt for password hashing
        const bcrypt = await import('bcrypt');
        
        console.log('📋 Creating tables...\n');
        
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
        
        // Create events table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS events (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                event_date DATE,
                location VARCHAR(255),
                image_url VARCHAR(255),
                status ENUM('upcoming', 'ongoing', 'completed') DEFAULT 'upcoming',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ Events table created');
        
        // Create heritage_items table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS heritage_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                media_type ENUM('photo', 'video', 'audio', 'document') DEFAULT 'photo',
                media_url VARCHAR(255),
                category VARCHAR(100),
                status ENUM('active', 'inactive') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ Heritage items table created');
        
        // Create workshops table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS workshops (
                id INT AUTO_INCREMENT PRIMARY KEY,
                artisan_id INT,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                workshop_date DATE,
                duration INT,
                max_participants INT,
                price DECIMAL(10, 2),
                status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (artisan_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ Workshops table created');
        
        console.log('\n👥 Creating default users...\n');
        
        // Check if users exist
        const [existingUsers] = await connection.execute('SELECT COUNT(*) as count FROM users');
        
        if (existingUsers[0].count === 0) {
            // Hash passwords
            const adminPassword = await bcrypt.hash('admin123', 10);
            const artisanPassword = await bcrypt.hash('artisan123', 10);
            const userPassword = await bcrypt.hash('user123', 10);
            
            // Insert default users
            await connection.execute(`
                INSERT INTO users (email, password, role, name) VALUES 
                ('admin@heritagelink.com', ?, 'admin', 'System Administrator'),
                ('artisan@heritagelink.com', ?, 'artisan', 'Master Artisan'),
                ('user@heritagelink.com', ?, 'user', 'Demo User')
            `, [adminPassword, artisanPassword, userPassword]);
            
            console.log('✅ Default users created:');
            console.log('   - admin@heritagelink.com / admin123');
            console.log('   - artisan@heritagelink.com / artisan123');
            console.log('   - user@heritagelink.com / user123');
        } else {
            console.log('ℹ️  Users already exist, skipping user creation');
        }
        
        await connection.end();
        
        console.log('\n🎉 Production database setup complete!');
        console.log('\n✅ Your Render deployment should now work correctly!');
        console.log('🌐 Visit your site and try logging in with admin@heritagelink.com / admin123\n');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('\nTroubleshooting:');
        console.error('1. Check if Aiven database is running');
        console.error('2. Verify credentials are correct');
        console.error('3. Make sure "heritagelink" database exists');
    }
}

setupProduction();
