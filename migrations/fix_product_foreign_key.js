import { db } from '../models/db.js';

async function fixProductForeignKey() {
    try {
        console.log('🔧 Fixing products table foreign key...');
        
        // Drop the existing foreign key constraint
        console.log('📌 Dropping old foreign key constraint...');
        await db.query('ALTER TABLE products DROP FOREIGN KEY products_ibfk_1');
        console.log('✅ Old foreign key dropped');
        
        // Add new foreign key referencing users table
        console.log('📌 Adding new foreign key to users table...');
        await db.query(`
            ALTER TABLE products 
            ADD CONSTRAINT products_user_fk 
            FOREIGN KEY (artisan_id) REFERENCES users(id) 
            ON DELETE CASCADE
        `);
        console.log('✅ New foreign key added');
        
        console.log('✅ Products table foreign key fixed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        console.error('Error details:', error.message);
        process.exit(1);
    }
}

fixProductForeignKey();
