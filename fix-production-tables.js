// Fix production database tables - drop and reimport
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function fixTables() {
    console.log('🔧 Fixing production database tables...\n');
    
    try {
        const aivenPassword = process.env.AIVEN_PASSWORD;
        
        if (!aivenPassword) {
            console.error('❌ AIVEN_PASSWORD not found in .env file!');
            return;
        }
        
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
        
        // Check current destinations table structure
        console.log('📋 Current destinations table structure:\n');
        const [columns] = await connection.query('DESCRIBE destinations');
        columns.forEach(col => {
            console.log(`   ${col.Field.padEnd(25)} ${col.Type.padEnd(30)} ${col.Null} ${col.Key} ${col.Default || ''}`);
        });
        
        console.log('\n❓ Does the table have a "status" column?');
        const hasStatus = columns.some(col => col.Field === 'status');
        console.log(`   ${hasStatus ? '✅ YES' : '❌ NO'}\n`);
        
        if (!hasStatus) {
            console.log('⚠️  The destinations table is missing the status column!');
            console.log('🔄 This needs to be fixed by reimporting the database.\n');
            console.log('Run these commands:');
            console.log('1. node clean-aiven-db.js');
            console.log('2. node import-to-aiven.js\n');
        } else {
            console.log('✅ Table structure looks correct!\n');
        }
        
        await connection.end();
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

fixTables();
