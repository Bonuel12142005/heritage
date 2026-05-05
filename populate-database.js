// Populate HeritageLink database with sample data
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function populateDatabase() {
    let connection;
    
    try {
        console.log('🌱 Populating HeritageLink database with sample data...\n');
        
        // Connect to MySQL database
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'heritagelink'
        });
        
        console.log('✅ Connected to MySQL database');
        
        // Sample destinations
        const destinations = [
            {
                name: 'Mangyan Heritage Center',
                description: 'Learn about the indigenous Mangyan culture and their traditional way of life.',
                location: 'Gloria, Oriental Mindoro',
                latitude: 12.9784,
                longitude: 121.4737,
                category: 'Cultural Heritage',
                status: 'active'
            },
            {
                name: 'Mount Halcon',
                description: 'The highest peak in Oriental Mindoro, perfect for hiking and nature lovers.',
                location: 'Gloria, Oriental Mindoro',
                latitude: 12.9500,
                longitude: 121.4000,
                category: 'Natural Wonder',
                status: 'active'
            },
            {
                name: 'Tamaraw Falls',
                description: 'A beautiful waterfall surrounded by lush tropical vegetation.',
                location: 'Puerto Galera, Oriental Mindoro',
                latitude: 13.5000,
                longitude: 120.9500,
                category: 'Natural Wonder',
                status: 'active'
            },
            {
                name: 'White Beach',
                description: 'Pristine white sand beach perfect for swimming and relaxation.',
                location: 'Puerto Galera, Oriental Mindoro',
                latitude: 13.5200,
                longitude: 120.9600,
                category: 'Beach',
                status: 'active'
            },
            {
                name: 'Tribal Village Experience',
                description: 'Visit authentic Mangyan villages and experience their traditional lifestyle.',
                location: 'Gloria, Oriental Mindoro',
                latitude: 12.9600,
                longitude: 121.4600,
                category: 'Cultural Experience',
                status: 'active'
            }
        ];
        
        console.log('📍 Adding sample destinations...');
        for (const dest of destinations) {
            await connection.execute(`
                INSERT INTO destinations (name, description, location, latitude, longitude, category, status)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE description = VALUES(description)
            `, [dest.name, dest.description, dest.location, dest.latitude, dest.longitude, dest.category, dest.status]);
        }
        console.log(`✅ Added ${destinations.length} destinations`);
        
        // Sample artisan products
        const [artisans] = await connection.execute('SELECT id FROM users WHERE role = "artisan"');
        if (artisans.length > 0) {
            const artisanId = artisans[0].id;
            
            const products = [
                {
                    artisan_id: artisanId,
                    name: 'Traditional Mangyan Basket',
                    description: 'Handwoven basket made from indigenous materials using traditional Mangyan techniques.',
                    price: 850.00,
                    category: 'Handicrafts',
                    stock_quantity: 15,
                    status: 'active'
                },
                {
                    artisan_id: artisanId,
                    name: 'Baybayin Script Artwork',
                    description: 'Beautiful artwork featuring the ancient Filipino Baybayin script.',
                    price: 1200.00,
                    category: 'Art',
                    stock_quantity: 8,
                    status: 'active'
                },
                {
                    artisan_id: artisanId,
                    name: 'Woven Textile Bag',
                    description: 'Colorful bag made from traditional woven textiles with modern design.',
                    price: 650.00,
                    category: 'Fashion',
                    stock_quantity: 20,
                    status: 'active'
                },
                {
                    artisan_id: artisanId,
                    name: 'Bamboo Wind Chimes',
                    description: 'Handcrafted wind chimes made from local bamboo with soothing sounds.',
                    price: 450.00,
                    category: 'Home Decor',
                    stock_quantity: 12,
                    status: 'active'
                },
                {
                    artisan_id: artisanId,
                    name: 'Traditional Jewelry Set',
                    description: 'Authentic Mangyan jewelry set made with natural materials and beads.',
                    price: 980.00,
                    category: 'Jewelry',
                    stock_quantity: 6,
                    status: 'active'
                }
            ];
            
            console.log('🎨 Adding sample artisan products...');
            for (const product of products) {
                await connection.execute(`
                    INSERT INTO artisan_products (artisan_id, name, description, price, category, stock_quantity, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE description = VALUES(description)
                `, [product.artisan_id, product.name, product.description, product.price, product.category, product.stock_quantity, product.status]);
            }
            console.log(`✅ Added ${products.length} artisan products`);
        }
        
        // Create additional tables that might be needed
        console.log('🏗️ Creating additional tables...');
        
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
                status ENUM('active', 'inactive') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        
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
        
        console.log('✅ Additional tables created');
        
        // Add sample events
        const events = [
            {
                title: 'Mangyan Cultural Festival',
                description: 'Annual celebration of Mangyan culture with traditional dances, music, and crafts.',
                event_date: '2024-12-15',
                event_time: '09:00:00',
                location: 'Gloria Town Plaza',
                category: 'Cultural Festival'
            },
            {
                title: 'Traditional Weaving Workshop',
                description: 'Learn the art of traditional Mangyan weaving from master artisans.',
                event_date: '2024-11-20',
                event_time: '14:00:00',
                location: 'Mangyan Heritage Center',
                category: 'Workshop'
            }
        ];
        
        console.log('📅 Adding sample events...');
        for (const event of events) {
            await connection.execute(`
                INSERT INTO events (title, description, event_date, event_time, location, category)
                VALUES (?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE description = VALUES(description)
            `, [event.title, event.description, event.event_date, event.event_time, event.location, event.category]);
        }
        console.log(`✅ Added ${events.length} events`);
        
        // Add sample heritage items
        const heritageItems = [
            {
                title: 'Traditional Mangyan Weaving',
                description: 'Ancient weaving techniques passed down through generations of Mangyan artisans.',
                category: 'traditional_crafts',
                historical_period: 'Pre-colonial',
                location: 'Gloria, Oriental Mindoro',
                media_type: 'photo',
                status: 'active'
            },
            {
                title: 'Baybayin Script Collection',
                description: 'Historical documents featuring the ancient Filipino Baybayin writing system.',
                category: 'historical_documents',
                historical_period: '16th Century',
                location: 'Oriental Mindoro',
                media_type: 'document',
                status: 'active'
            },
            {
                title: 'Mangyan Folk Songs',
                description: 'Traditional songs and chants of the Mangyan people.',
                category: 'oral_traditions',
                historical_period: 'Traditional',
                location: 'Gloria, Oriental Mindoro',
                media_type: 'audio',
                status: 'active'
            },
            {
                title: 'Festival Dance Performance',
                description: 'Video recording of traditional Mangyan cultural dance.',
                category: 'performing_arts',
                historical_period: 'Contemporary',
                location: 'Gloria Town Plaza',
                media_type: 'video',
                status: 'active'
            },
            {
                title: 'Ancient Pottery Artifacts',
                description: 'Pre-colonial pottery discovered in archaeological sites.',
                category: 'artifacts',
                historical_period: 'Pre-colonial',
                location: 'Oriental Mindoro',
                media_type: 'photo',
                status: 'active'
            }
        ];
        
        console.log('🏛️ Adding sample heritage items...');
        for (const item of heritageItems) {
            await connection.execute(`
                INSERT INTO heritage_items (title, description, category, historical_period, status)
                VALUES (?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE description = VALUES(description)
            `, [item.title, item.description, item.category, item.historical_period, item.status]);
        }
        console.log(`✅ Added ${heritageItems.length} heritage items`);
        
        // Add sample workshops
        if (artisans.length > 0) {
            const artisanId = artisans[0].id;
            
            const workshops = [
                {
                    artisan_id: artisanId,
                    title: 'Traditional Basket Weaving',
                    description: 'Learn the ancient art of Mangyan basket weaving using indigenous materials.',
                    duration_hours: 4,
                    max_participants: 12,
                    price: 1500.00,
                    workshop_date: '2024-12-20',
                    workshop_time: '09:00:00',
                    status: 'active'
                },
                {
                    artisan_id: artisanId,
                    title: 'Baybayin Script Writing',
                    description: 'Discover the beauty of ancient Filipino script and create your own artwork.',
                    duration_hours: 3,
                    max_participants: 15,
                    price: 1200.00,
                    workshop_date: '2024-12-22',
                    workshop_time: '14:00:00',
                    status: 'active'
                }
            ];
            
            console.log('🎓 Adding sample workshops...');
            for (const workshop of workshops) {
                await connection.execute(`
                    INSERT INTO workshops (artisan_id, title, description, price, workshop_date, workshop_time, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE description = VALUES(description)
                `, [workshop.artisan_id, workshop.title, workshop.description, workshop.price, workshop.workshop_date, workshop.workshop_time, workshop.status]);
            }
            console.log(`✅ Added ${workshops.length} workshops`);
        }
        
        console.log('\n🎯 Database population complete!');
        console.log('\n📊 Summary:');
        console.log(`• ${destinations.length} destinations added`);
        if (artisans.length > 0) {
            console.log(`• ${products.length} artisan products added`);
            console.log(`• 2 workshops added`);
        } else {
            console.log('• 0 artisan products added (no artisans found)');
            console.log('• 0 workshops added (no artisans found)');
        }
        console.log(`• ${events.length} events added`);
        console.log('• 5 heritage items added');
        console.log('• Additional tables created (events, heritage_items, workshops, feedback)');
        
        console.log('\n🔗 Test your system:');
        console.log('• Destinations: http://localhost:3000/destinations');
        console.log('• Admin Users: http://localhost:3000/admin/users');
        console.log('• Artisan Products: http://localhost:3000/artisan/products');
        console.log('• Admin Destinations: http://localhost:3000/admin/destinations');
        
    } catch (error) {
        console.error('❌ Database population failed:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

populateDatabase();