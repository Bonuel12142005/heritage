// Import SQL dump to Aiven MySQL production database
import mysql from 'mysql2/promise';
import fs from 'fs';

async function importToAiven() {
    console.log('📥 Importing database to Aiven MySQL...\n');
    
    try {
        const filename = 'heritagelink-export.sql';
        
        // Check if export file exists
        if (!fs.existsSync(filename)) {
            console.error('❌ Export file not found!');
            console.error('Please run "node export-local-db.js" first\n');
            return;
        }
        
        // Read SQL dump
        const sqlDump = fs.readFileSync(filename, 'utf8');
        
        // Connect to Aiven MySQL
        const connection = await mysql.createConnection({
            host: 'mysql-2a6b1cea-heritage-6610.d.aivencloud.com',
            port: 17649,
            user: 'avnadmin',
            password: process.env.AIVEN_PASSWORD || '',
            database: 'heritagelink',
            ssl: {
                rejectUnauthorized: false
            },
            multipleStatements: true
        });
        
        console.log('✅ Connected to Aiven MySQL\n');
        console.log('⏳ Importing data (this may take a minute)...\n');
        
        // Execute SQL dump
        await connection.query(sqlDump);
        
        await connection.end();
        
        console.log('✅ Database imported successfully!\n');
        console.log('🎉 Your production database now has all your local data!\n');
        console.log('🌐 Visit https://heritagelink.onrender.com to see your data live\n');
        
    } catch (error) {
        console.error('❌ Import failed:', error.message);
        console.error('\nTroubleshooting:');
        console.error('1. Make sure heritagelink-export.sql exists');
        console.error('2. Check Aiven database is running');
        console.error('3. Verify Aiven credentials are correct');
    }
}

importToAiven();
