// Import SQL dump to Aiven MySQL production database
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

async function importToAiven() {
    console.log('📥 Importing database to Aiven MySQL...\n');
    
    try {
        // Check multiple possible locations for the SQL file
        const possiblePaths = [
            'heritagelink-export-fixed.sql',
            'heritagelink-export.sql',
            'heritagelink.sql',
            path.join(process.env.USERPROFILE || process.env.HOME, 'Downloads', 'heritagelink.sql'),
            path.join(process.env.USERPROFILE || process.env.HOME, 'Downloads', 'heritagelink-export.sql')
        ];
        
        let filename = null;
        for (const filePath of possiblePaths) {
            if (fs.existsSync(filePath)) {
                filename = filePath;
                console.log(`✅ Found SQL file: ${filePath}\n`);
                break;
            }
        }
        
        if (!filename) {
            console.error('❌ SQL export file not found!');
            console.error('\nPlease do one of the following:');
            console.error('1. Export from phpMyAdmin and save as "heritagelink.sql" in Downloads folder');
            console.error('2. Run "node export-local-db.js" to create heritagelink-export.sql');
            console.error('3. Copy your SQL file to this project folder\n');
            return;
        }
        
        // Read SQL dump
        console.log('📖 Reading SQL file...\n');
        const sqlDump = fs.readFileSync(filename, 'utf8');
        
        // Get password from environment
        const aivenPassword = process.env.AIVEN_PASSWORD;
        
        if (!aivenPassword) {
            console.error('❌ AIVEN_PASSWORD not found in .env file!');
            console.error('Please add this line to your .env file:');
            console.error('AIVEN_PASSWORD=your-aiven-password-here\n');
            return;
        }
        
        console.log('🔑 Using password from .env file');
        
        // Connect to Aiven MySQL
        const connection = await mysql.createConnection({
            host: 'mysql-2a6b1cea-heritage-6610.d.aivencloud.com',
            port: 17649,
            user: 'avnadmin',
            password: aivenPassword,
            database: 'heritagelink',
            ssl: {
                rejectUnauthorized: false
            },
            multipleStatements: true
        });
        
        console.log('✅ Connected to Aiven MySQL\n');
        console.log('⏳ Dropping existing tables...\n');
        
        // Disable foreign key checks
        await connection.query('SET FOREIGN_KEY_CHECKS=0');
        
        // Get all tables
        const [tables] = await connection.query('SHOW TABLES');
        for (const row of tables) {
            const tableName = Object.values(row)[0];
            console.log(`   Dropping ${tableName}...`);
            await connection.query(`DROP TABLE IF EXISTS \`${tableName}\``);
        }
        
        console.log('\n⏳ Importing data (this may take a minute)...\n');
        
        // Split SQL into individual statements for better error handling
        const statements = sqlDump.split(';').filter(stmt => stmt.trim().length > 0);
        let successCount = 0;
        let currentTable = '';
        
        for (let i = 0; i < statements.length; i++) {
            const stmt = statements[i].trim();
            if (stmt.length === 0) continue;
            
            // Track which table we're working on
            if (stmt.includes('CREATE TABLE')) {
                const match = stmt.match(/CREATE TABLE `?(\w+)`?/);
                if (match) {
                    currentTable = match[1];
                    console.log(`   Creating table: ${currentTable}`);
                }
            }
            
            try {
                await connection.query(stmt);
                successCount++;
                if (successCount % 100 === 0) {
                    console.log(`   Processed ${successCount} statements...`);
                }
            } catch (error) {
                console.error(`\n❌ Error at statement ${i + 1} (table: ${currentTable}):`);
                console.error(`Statement preview: ${stmt.substring(0, 300)}...`);
                console.error(`Error: ${error.message}\n`);
                throw error;
            }
        }
        
        console.log(`✅ Processed ${successCount} statements total\n`);
        
        // Re-enable foreign key checks
        await connection.query('SET FOREIGN_KEY_CHECKS=1');
        
        await connection.end();
        
        console.log('✅ Database imported successfully!\n');
        console.log('🎉 Your production database now has all your local data!\n');
        console.log('🌐 Visit https://heritagelink.onrender.com to see your data live\n');
        
    } catch (error) {
        console.error('❌ Import failed:', error.message);
        console.error('\nTroubleshooting:');
        console.error('1. Make sure your SQL file is in Downloads folder or project folder');
        console.error('2. Check Aiven database is running');
        console.error('3. Verify Aiven credentials are correct');
        console.error('4. Make sure AIVEN_PASSWORD is set in .env file');
        console.error('\nIf you see "Data truncated" error:');
        console.error('- Your SQL file might have incompatible data');
        console.error('- Try exporting again from phpMyAdmin');
    }
}

importToAiven();
