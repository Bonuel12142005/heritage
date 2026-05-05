// Check workshops in Aiven
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function checkWorkshops() {
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
        
        console.log('✅ Connected to Aiven MySQL');
        
        const [all] = await connection.execute('SELECT COUNT(*) as total FROM workshops');
        const [active] = await connection.execute('SELECT COUNT(*) as total FROM workshops WHERE status = \'active\'');
        const [workshops] = await connection.execute('SELECT * FROM workshops');
        
        console.log('📊 Workshops Statistics:');
        console.log(`   Total workshops: ${all[0].total}`);
        console.log(`   Active workshops: ${active[0].total}`);
        console.log('\n📋 Workshop Details:');
        workshops.forEach(w => {
            console.log(`   - ${w.title} (ID: ${w.id}, Status: ${w.status})`);
        });
        
        await connection.end();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkWorkshops();
