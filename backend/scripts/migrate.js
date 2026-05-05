import { sequelize } from '../models/db.js';
import { QueryTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

async function runMigrations() {
    try {
        console.log('🔄 Starting database migrations...');
        console.log('Database dialect:', sequelize.getDialect());

        // Create users table
        await sequelize.query(`
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
        `);
        console.log('✅ Users table created/verified');

        // Create destinations table
        await sequelize.query(`
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
        `);
        console.log('✅ Destinations table created/verified');

        // Create products table
        await sequelize.query(`
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
        `);
        console.log('✅ Products table created/verified');

        // Create orders table
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                artisan_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
                quantity INTEGER DEFAULT 1,
                total_amount DECIMAL(10, 2),
                status VARCHAR(20) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Orders table created/verified');

        // Insert default admin user
        const adminExists = await sequelize.query(
            'SELECT id FROM users WHERE email = ?',
            {
                replacements: ['admin@heritagelink.com'],
                type: QueryTypes.SELECT
            }
        );

        if (adminExists.length === 0) {
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
            const hashedPassword = await bcrypt.hash('artisan123', 10);
            
            await sequelize.query(
                'INSERT INTO users (username, email, password, role, full_name, specialization) VALUES (?, ?, ?, ?, ?, ?)',
                {
                    replacements: ['artisan', 'artisan@heritagelink.com', hashedPassword, 'artisan', 'Test Artisan', 'Traditional Crafts']
                }
            );
            console.log('✅ Artisan user created');
        }

        // Insert sample destinations
        const destinationExists = await sequelize.query(
            'SELECT id FROM destinations LIMIT 1',
            { type: QueryTypes.SELECT }
        );

        if (destinationExists.length === 0) {
            const sampleDestinations = [
                ['Mount Halcon', 'The highest peak in Oriental Mindoro, perfect for hiking and nature lovers.', 'Gloria, Oriental Mindoro', 'Mountain', null, 13.1234, 121.1234],
                ['Tamaraw Falls', 'A beautiful waterfall surrounded by lush tropical vegetation.', 'Puerto Galera, Oriental Mindoro', 'Waterfall', null, 13.5678, 120.9876],
                ['White Beach', 'Pristine white sand beach with crystal clear waters.', 'Puerto Galera, Oriental Mindoro', 'Beach', null, 13.5432, 120.9543]
            ];

            for (const dest of sampleDestinations) {
                await sequelize.query(
                    'INSERT INTO destinations (name, description, location, category, image_url, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    { replacements: dest }
                );
            }
            console.log('✅ Sample destinations created');
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