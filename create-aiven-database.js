// Create HeritageLink database in Aiven MySQL
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function createDatabase() {
    console.log('🔄 Connecting to Aiven MySQL...');
    
    try {
        // Connect to Aiven MySQL using environment variables
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: 'defaultdb',
            ssl: {
                rejectUnauthorized: false
            }
        });
        
        console.log('✅ Connected to Aiven MySQL!');
        
        // Create heritagelink database
        console.log('🔄 Creating heritagelink database...');
        await connection.execute('CREATE DATABASE IF NOT EXISTS heritagelink CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
        console.log('✅ Database "heritagelink" created successfully!');
        
        // Show all databases
        console.log('\n📋 Available databases:');
        const [databases] = await connection.execute('SHOW DATABASES');
        databases.forEach(db => {
            console.log(`   - ${db.Database}`);
        });
        
        await connection.end();
        console.log('\n🎉 Done! You can now deploy to Render.');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('\nTroubleshooting:');
        console.error('1. Check if Aiven database is running (green status)');
        console.error('2. Verify credentials are correct');
        console.error('3. Make sure SSL is enabled in Aiven');
    }
}

createDatabase();
