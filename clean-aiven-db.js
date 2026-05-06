// Clean Aiven database - drop ALL tables
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function cleanDatabase() {
    console.log('🧹 Cleaning Aiven MySQL database...\n');
    
    try {
        const aivenPassword = process.env.AIVEN_PASSWORD;
        
        if (!aivenPassword) {
            console.error('❌ AIVEN_PASSWORD not found in .env file!');
            return;
        }
        
        // Connect to Aiven MySQL
        const connection = await mysql.createConnection({
            host: 'mysql-2a6b1cea-heritage-6610.d.aivencloud.com',
            port: 17649,
            user: 'avnadmin',
            password: aivenPassword,
            database: 'heritagelink',
            ssl: {
                rejectUnauthorized: false
            }
        });
        
        console.log('✅ Connected to Aiven MySQL\n');
        console.log('⏳ Dropping ALL tables...\n');
        
        // Disable foreign key checks
        await connection.query('SET FOREIGN_KEY_CHECKS=0');
        
        // Get all tables
        const [tables] = await connection.query('SHOW TABLES');
        
        if (tables.length === 0) {
            console.log('ℹ️  No tables found. Database is already clean.\n');
        } else {
            for (const row of tables) {
                const tableName = Object.values(row)[0];
                console.log(`   Dropping ${tableName}...`);
                await connection.query(`DROP TABLE IF EXISTS \`${tableName}\``);
            }
            console.log(`\n✅ Dropped ${tables.length} tables\n`);
        }
        
        // Re-enable foreign key checks
        await connection.query('SET FOREIGN_KEY_CHECKS=1');
        
        await connection.end();
        
        console.log('🎉 Database cleaned successfully!');
        console.log('📝 Now run: node import-to-aiven.js\n');
        
    } catch (error) {
        console.error('❌ Clean failed:', error.message);
    }
}

cleanDatabase();
