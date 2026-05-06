// Script to check what's in the database for product ID 32
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function checkProduct() {
    let connection;
    
    try {
        console.log('🔄 Connecting to database...');
        
        const connectionConfig = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'heritagelink',
            charset: 'utf8mb4'
        };
        
        connection = await mysql.createConnection(connectionConfig);
        console.log('✅ Connected to database!');
        
        // Check if image_url column exists
        console.log('\n📊 Checking table structure...');
        const [columns] = await connection.execute("SHOW COLUMNS FROM artisan_products");
        console.log('\nColumns in artisan_products table:');
        columns.forEach(col => {
            console.log(`  - ${col.Field} (${col.Type})`);
        });
        
        const hasImageUrl = columns.some(col => col.Field === 'image_url');
        console.log(`\n${hasImageUrl ? '✅' : '❌'} image_url column ${hasImageUrl ? 'EXISTS' : 'DOES NOT EXIST'}`);
        
        // Check product 32
        console.log('\n📦 Checking product ID 32...');
        const [products] = await connection.execute(
            'SELECT id, name, price, price_range, image_url, category, description FROM artisan_products WHERE id = 32'
        );
        
        if (products.length === 0) {
            console.log('❌ Product ID 32 not found!');
        } else {
            const product = products[0];
            console.log('\n✅ Product found:');
            console.log('  ID:', product.id);
            console.log('  Name:', product.name);
            console.log('  Price:', product.price);
            console.log('  Price Range:', product.price_range);
            console.log('  Image URL:', product.image_url || '(null)');
            console.log('  Category:', product.category);
            console.log('  Description:', product.description ? product.description.substring(0, 50) + '...' : '(null)');
        }
        
        // Check all products for this artisan
        console.log('\n📦 All products (showing first 5):');
        const [allProducts] = await connection.execute(
            'SELECT id, name, price, image_url FROM artisan_products ORDER BY id DESC LIMIT 5'
        );
        
        allProducts.forEach(p => {
            console.log(`  ID ${p.id}: ${p.name} - ₱${p.price} - Image: ${p.image_url || '(none)'}`);
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        
        if (error.code === 'ER_BAD_FIELD_ERROR') {
            console.log('\n⚠️  The image_url column does not exist!');
            console.log('Run: node run-image-migration.js');
        }
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

checkProduct();
