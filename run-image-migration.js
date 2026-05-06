// Script to add image_url columns to artisan_products and workshops tables
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function runMigration() {
    let connection;
    
    try {
        console.log('🔄 Connecting to database...');
        
        // Check if we're connecting to Aiven (production)
        const isAiven = process.env.DB_HOST && process.env.DB_HOST.includes('aivencloud.com');
        
        const connectionConfig = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'heritagelink',
            charset: 'utf8mb4'
        };
        
        // Add SSL for Aiven
        if (isAiven) {
            connectionConfig.ssl = {
                rejectUnauthorized: false
            };
            console.log('🔒 Using SSL for Aiven connection');
        }
        
        connection = await mysql.createConnection(connectionConfig);
        console.log('✅ Connected to database!');
        console.log(`📍 Database: ${connectionConfig.host}:${connectionConfig.port}/${connectionConfig.database}`);
        
        // Check if image_url column exists in artisan_products
        console.log('\n📊 Checking artisan_products table...');
        const [productsColumns] = await connection.execute(
            "SHOW COLUMNS FROM artisan_products LIKE 'image_url'"
        );
        
        if (productsColumns.length === 0) {
            console.log('➕ Adding image_url column to artisan_products...');
            await connection.execute(
                'ALTER TABLE artisan_products ADD COLUMN image_url VARCHAR(255) DEFAULT NULL AFTER external_link'
            );
            console.log('✅ Column added to artisan_products!');
        } else {
            console.log('✓ image_url column already exists in artisan_products');
        }
        
        // Check if image_url column exists in workshops
        console.log('\n📊 Checking workshops table...');
        const [workshopsColumns] = await connection.execute(
            "SHOW COLUMNS FROM workshops LIKE 'image_url'"
        );
        
        if (workshopsColumns.length === 0) {
            console.log('➕ Adding image_url column to workshops...');
            await connection.execute(
                'ALTER TABLE workshops ADD COLUMN image_url VARCHAR(255) DEFAULT NULL AFTER status'
            );
            console.log('✅ Column added to workshops!');
        } else {
            console.log('✓ image_url column already exists in workshops');
        }
        
        console.log('\n✅ Migration completed successfully!');
        console.log('\n📝 Next steps:');
        console.log('1. Restart your server');
        console.log('2. Upload a new product/workshop image');
        console.log('3. The image should now display correctly');
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('\nℹ️  Columns already exist. Migration not needed.');
        }
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Database connection closed');
        }
    }
}

runMigration();
