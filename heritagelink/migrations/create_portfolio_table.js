import { db } from '../models/db.js';

async function createPortfolioTable() {
    try {
        console.log('🎨 Creating portfolio table...');
        
        // Check if table exists
        const [tables] = await db.query(`
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'portfolio'
        `);
        
        if (tables.length === 0) {
            await db.query(`
                CREATE TABLE portfolio (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    artisan_id INT NOT NULL,
                    image_path VARCHAR(255) NOT NULL,
                    title VARCHAR(255) DEFAULT NULL,
                    description TEXT DEFAULT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (artisan_id) REFERENCES users(id) ON DELETE CASCADE
                )
            `);
            console.log('✅ Portfolio table created successfully');
        } else {
            console.log('ℹ️  Portfolio table already exists');
        }
        
        console.log('✅ Portfolio migration completed');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration error:', err);
        process.exit(1);
    }
}

createPortfolioTable();
