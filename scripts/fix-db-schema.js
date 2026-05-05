import { sequelize } from '../models/db.js';

const fixSchema = async () => {
    console.log('🔧 Fixing database schema issues...');

    try {
        // 1. Check and add created_by to events table
        console.log('Checking events table for created_by column...');
        try {
            await sequelize.query('ALTER TABLE events ADD COLUMN created_by INT;');
            console.log('✅ Added created_by column to events table.');
        } catch (err) {
            if (err.original && err.original.errno === 1060) {
                console.log('ℹ️ created_by column already exists in events table.');
            } else {
                console.error('❌ Error altering events table:', err.message);
            }
        }

        // 2. Create destination_images table if it doesn't exist
        console.log('Checking destination_images table...');
        try {
            await sequelize.query(`
                CREATE TABLE IF NOT EXISTS destination_images (
                  id INT AUTO_INCREMENT PRIMARY KEY,
                  destination_id INT NOT NULL,
                  url VARCHAR(255) NOT NULL,
                  caption VARCHAR(255),
                  is_primary TINYINT(1) DEFAULT 0,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `);
            console.log('✅ Ensured destination_images table exists.');
        } catch (err) {
            console.error('❌ Error creating destination_images table:', err.message);
        }

        // 3. Check and add missing columns to destinations table
        console.log('Checking destinations table for missing columns...');
        const newCols = [
            'historical_background TEXT',
            'category VARCHAR(100) DEFAULT "Cultural"',
            'opening_hours VARCHAR(255)',
            'contact_info VARCHAR(255)',
            'visitor_guidelines TEXT',
            'created_by INT',
            'latitude DECIMAL(10,8)',
            'longitude DECIMAL(11,8)'
        ];

        for (const col of newCols) {
            const colName = col.split(' ')[0];
            try {
                await sequelize.query(`ALTER TABLE destinations ADD COLUMN ${col};`);
                console.log(`✅ Added ${colName} column to destinations table.`);
            } catch (err) {
                if (err.original && err.original.errno === 1060) {
                    console.log(`ℹ️ ${colName} column already exists in destinations table.`);
                } else {
                    console.error(`❌ Error adding ${colName} to destinations table:`, err.message);
                }
            }
        }

        console.log('🎉 Database schema fixes applied.');
    } catch (err) {
        console.error('❌ General error applying schema fixes:', err.message);
    } finally {
        process.exit(0);
    }
};

fixSchema();
