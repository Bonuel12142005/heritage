// Check all destinations in Aiven
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function checkDestinations() {
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
        
        const [all] = await connection.execute('SELECT COUNT(*) as total FROM destinations');
        const [active] = await connection.execute('SELECT COUNT(*) as total FROM destinations WHERE status = \'active\'');
        const [withCoords] = await connection.execute('SELECT COUNT(*) as total FROM destinations WHERE latitude IS NOT NULL AND longitude IS NOT NULL');
        
        console.log('📊 Destinations Statistics:');
        console.log(`   Total destinations: ${all[0].total}`);
        console.log(`   Active destinations: ${active[0].total}`);
        console.log(`   With coordinates: ${withCoords[0].total}`);
        
        await connection.end();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkDestinations();
