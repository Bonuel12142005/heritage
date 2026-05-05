import { db } from '../models/db.js';

async function addProfilePhotoColumn() {
    try {
        console.log('📸 Adding profile_photo column to users table...');
        
        // Check if column exists
        const [columns] = await db.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'users' 
            AND COLUMN_NAME = 'profile_photo'
        `);
        
        if (columns.length === 0) {
            await db.query(`
                ALTER TABLE users 
                ADD COLUMN profile_photo VARCHAR(255) DEFAULT NULL
            `);
            console.log('✅ profile_photo column added successfully');
        } else {
            console.log('ℹ️  profile_photo column already exists');
        }
        
        // Also add product_image column to products table if it exists
        const [productTable] = await db.query(`
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'products'
        `);
        
        if (productTable.length > 0) {
            const [productColumns] = await db.query(`
                SELECT COLUMN_NAME 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME = 'products' 
                AND COLUMN_NAME = 'product_image'
            `);
            
            if (productColumns.length === 0) {
                await db.query(`
                    ALTER TABLE products 
                    ADD COLUMN product_image VARCHAR(255) DEFAULT NULL
                `);
                console.log('✅ product_image column added to products table');
            }
        }
        
        console.log('✅ Photo upload migration completed');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration error:', err);
        process.exit(1);
    }
}

addProfilePhotoColumn();
