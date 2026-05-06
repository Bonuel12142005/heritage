// Check destinations by status
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function checkDestinations() {
    console.log('🔍 Checking destinations status...\n');
    
    try {
        const aivenPassword = process.env.AIVEN_PASSWORD;
        
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
        
        // Count by status
        const [statusCounts] = await connection.query(`
            SELECT status, COUNT(*) as count 
            FROM destinations 
            GROUP BY status
        `);
        
        console.log('📊 Destinations by Status:\n');
        statusCounts.forEach(s => {
            console.log(`   ${s.status.padEnd(10)} : ${s.count} destinations`);
        });
        
        // Show active destinations
        console.log('\n✅ Active Destinations:\n');
        const [active] = await connection.query(`
            SELECT id, name, location, category 
            FROM destinations 
            WHERE status = 'active' 
            ORDER BY id 
            LIMIT 10
        `);
        
        active.forEach(d => {
            console.log(`   ${d.id}. ${d.name} - ${d.location} (${d.category || 'No category'})`);
        });
        
        console.log(`\n   ... and ${active.length > 10 ? active.length - 10 : 0} more\n`);
        
        await connection.end();
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkDestinations();
