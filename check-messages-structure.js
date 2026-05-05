// Check messages table structure
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function checkStructure() {
    let connection;
    
    try {
        connection = await mysql.createConnection({
            host: 'mysql-2a6b1cea-heritage-6610.d.aivencloud.com',
            port: 17649,
            user: 'avnadmin',
            password: process.env.AIVEN_PASSWORD,
            database: 'heritagelink',
            ssl: { rejectUnauthorized: false }
        });
        
        console.log('✅ Connected');
        
        const [columns] = await connection.execute('DESCRIBE messages');
        console.log('📋 Messages table structure:');
        columns.forEach(col => {
            console.log(`   ${col.Field} (${col.Type}) ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
        });
        
        const [messages] = await connection.execute('SELECT * FROM messages LIMIT 5');
        console.log(`\n💬 Sample messages (${messages.length}):`);
        messages.forEach(m => {
            console.log('   Message:', Object.keys(m));
        });
        
        await connection.end();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkStructure();
