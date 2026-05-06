// Check what data is in Aiven production database
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function checkData() {
    console.log('🔍 Checking Aiven database data...\n');
    
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
        
        // Check all tables
        const tables = [
            'users',
            'destinations',
            'artisan_products',
            'events',
            'heritage_items',
            'workshops',
            'map_places',
            'orders',
            'messages'
        ];
        
        console.log('📊 Table Row Counts:\n');
        
        for (const table of tables) {
            try {
                const [result] = await connection.query(`SELECT COUNT(*) as count FROM \`${table}\``);
                const count = result[0].count;
                console.log(`   ${table.padEnd(20)} : ${count} rows`);
            } catch (error) {
                console.log(`   ${table.padEnd(20)} : Table not found`);
            }
        }
        
        // Show sample destinations
        console.log('\n📍 Sample Destinations:\n');
        try {
            const [destinations] = await connection.query('SELECT id, name, location, status FROM destinations LIMIT 5');
            if (destinations.length > 0) {
                destinations.forEach(d => {
                    console.log(`   ${d.id}. ${d.name} - ${d.location} (${d.status})`);
                });
            } else {
                console.log('   ⚠️  No destinations found!');
            }
        } catch (error) {
            console.log('   ❌ Error:', error.message);
        }
        
        await connection.end();
        
        console.log('\n✅ Check complete!\n');
        
    } catch (error) {
        console.error('❌ Check failed:', error.message);
    }
}

checkData();
