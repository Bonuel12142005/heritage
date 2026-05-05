// Fix database schema for HeritageLink
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function fixDatabaseSchema() {
    let connection;
    
    try {
        console.log('🔧 Fixing HeritageLink database schema...\n');
        
        // Connect to MySQL database
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'heritagelink'
        });
        
        console.log('✅ Connected to MySQL database');
        
        // Check current artisan_products table structure
        console.log('🔍 Checking current table structures...');
        
        try {
            const [columns] = await connection.execute(`
                SHOW COLUMNS FROM artisan_products
            `);
            
            console.log('Current artisan_products columns:');
            columns.forEach(col => {
                console.log(`  - ${col.Field}: ${col.Type}`);
            });
            
            // Check if price column exists
            const priceExists = columns.some(col => col.Field === 'price');
            
            if (!priceExists) {
                console.log('\n➕ Adding missing price column...');
                await connection.execute(`
                    ALTER TABLE artisan_products 
                    ADD COLUMN price DECIMAL(10, 2) DEFAULT 0.00 AFTER description
                `);
                console.log('✅ Price column added');
            }
            
            // Check if category column exists
            const categoryExists = columns.some(col => col.Field === 'category');
            
            if (!categoryExists) {
                console.log('➕ Adding missing category column...');
                await connection.execute(`
                    ALTER TABLE artisan_products 
                    ADD COLUMN category VARCHAR(100) AFTER price
                `);
                console.log('✅ Category column added');
            }
            
            // Check if stock_quantity column exists
            const stockExists = columns.some(col => col.Field === 'stock_quantity');
            
            if (!stockExists) {
                console.log('➕ Adding missing stock_quantity column...');
                await connection.execute(`
                    ALTER TABLE artisan_products 
                    ADD COLUMN stock_quantity INT DEFAULT 0 AFTER category
                `);
                console.log('✅ Stock quantity column added');
            }
            
            // Check if status column exists
            const statusExists = columns.some(col => col.Field === 'status');
            
            if (!statusExists) {
                console.log('➕ Adding missing status column...');
                await connection.execute(`
                    ALTER TABLE artisan_products 
                    ADD COLUMN status ENUM('active', 'inactive') DEFAULT 'active' AFTER stock_quantity
                `);
                console.log('✅ Status column added');
            }
            
        } catch (error) {
            console.log('⚠️ artisan_products table might not exist, creating it...');
            
            // Recreate the table with all needed columns
            await connection.execute(`
                CREATE TABLE IF NOT EXISTS artisan_products (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    artisan_id INT,
                    name VARCHAR(255) NOT NULL,
                    description TEXT,
                    price DECIMAL(10, 2) DEFAULT 0.00,
                    image_url VARCHAR(255),
                    category VARCHAR(100),
                    stock_quantity INT DEFAULT 0,
                    status ENUM('active', 'inactive') DEFAULT 'active',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (artisan_id) REFERENCES users(id) ON DELETE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `);
            console.log('✅ artisan_products table created with all columns');
        }
        
        // Create other missing tables
        console.log('\n🏗️ Creating additional tables...');
        
        // Events table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS events (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                event_date DATE,
                event_time TIME,
                location VARCHAR(255),
                category VARCHAR(100),
                status ENUM('active', 'inactive', 'completed') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        
        // Check if events table has category column
        try {
            const [eventColumns] = await connection.execute('SHOW COLUMNS FROM events');
            const categoryExists = eventColumns.some(col => col.Field === 'category');
            
            if (!categoryExists) {
                console.log('➕ Adding category column to events table...');
                await connection.execute(`
                    ALTER TABLE events 
                    ADD COLUMN category VARCHAR(100) AFTER location
                `);
                console.log('✅ Events category column added');
            }
        } catch (error) {
            console.log('⚠️ Events table might not exist, it will be created');
        }
        
        // Heritage items table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS heritage_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                category VARCHAR(100),
                historical_period VARCHAR(100),
                location VARCHAR(255),
                image_url VARCHAR(255),
                media_type ENUM('photo', 'video', 'audio', 'document') DEFAULT 'photo',
                media_url VARCHAR(255),
                thumbnail_url VARCHAR(255),
                tags TEXT,
                status ENUM('active', 'inactive') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        
        // Check if heritage_items table has all required columns
        try {
            const [heritageColumns] = await connection.execute('SHOW COLUMNS FROM heritage_items');
            const requiredColumns = ['historical_period', 'media_type', 'media_url', 'thumbnail_url', 'tags'];
            
            for (const column of requiredColumns) {
                const columnExists = heritageColumns.some(col => col.Field === column);
                if (!columnExists) {
                    console.log(`➕ Adding ${column} column to heritage_items table...`);
                    let columnDef = '';
                    switch (column) {
                        case 'historical_period':
                            columnDef = 'VARCHAR(100) AFTER category';
                            break;
                        case 'media_type':
                            columnDef = "ENUM('photo', 'video', 'audio', 'document') DEFAULT 'photo' AFTER image_url";
                            break;
                        case 'media_url':
                            columnDef = 'VARCHAR(255) AFTER media_type';
                            break;
                        case 'thumbnail_url':
                            columnDef = 'VARCHAR(255) AFTER media_url';
                            break;
                        case 'tags':
                            columnDef = 'TEXT AFTER thumbnail_url';
                            break;
                    }
                    await connection.execute(`ALTER TABLE heritage_items ADD COLUMN ${column} ${columnDef}`);
                    console.log(`✅ ${column} column added to heritage_items`);
                }
            }
        } catch (error) {
            console.log('⚠️ Heritage items table might not exist, it will be created');
        }
        
        // Workshops table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS workshops (
                id INT AUTO_INCREMENT PRIMARY KEY,
                artisan_id INT,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                duration_hours INT,
                max_participants INT,
                price DECIMAL(10, 2),
                workshop_date DATE,
                workshop_time TIME,
                status ENUM('active', 'inactive', 'completed') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (artisan_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        
        // Feedback table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS feedback (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                subject VARCHAR(255),
                message TEXT,
                rating INT DEFAULT 5,
                status ENUM('pending', 'reviewed', 'resolved') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        
        console.log('✅ All tables created/updated');
        
        console.log('\n🎯 Database schema fix complete!');
        console.log('\n📊 Tables ready:');
        console.log('• users (existing)');
        console.log('• destinations (existing)');
        console.log('• artisan_products (fixed/created)');
        console.log('• events (created)');
        console.log('• heritage_items (created)');
        console.log('• workshops (created)');
        console.log('• feedback (created)');
        
    } catch (error) {
        console.error('❌ Database schema fix failed:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

fixDatabaseSchema();