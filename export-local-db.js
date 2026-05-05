// Export local MySQL database to SQL file
import mysql from 'mysql2/promise';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

async function exportDatabase() {
    console.log('📤 Exporting local database...\n');
    
    try {
        // Connect to LOCAL MySQL
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'heritagelink'
        });
        
        console.log('✅ Connected to local MySQL database\n');
        
        let sqlDump = '-- HeritageLink Database Export\n';
        sqlDump += `-- Exported on ${new Date().toISOString()}\n\n`;
        sqlDump += 'SET FOREIGN_KEY_CHECKS=0;\n\n';
        
        // Get all tables
        const [tables] = await connection.execute('SHOW TABLES');
        const tableNames = tables.map(row => Object.values(row)[0]);
        
        console.log(`📋 Found ${tableNames.length} tables:\n`);
        
        for (const tableName of tableNames) {
            console.log(`   Exporting ${tableName}...`);
            
            // Get table structure
            const [createTable] = await connection.execute(`SHOW CREATE TABLE \`${tableName}\``);
            sqlDump += `-- Table: ${tableName}\n`;
            sqlDump += `DROP TABLE IF EXISTS \`${tableName}\`;\n`;
            sqlDump += createTable[0]['Create Table'] + ';\n\n';
            
            // Get table data
            const [rows] = await connection.execute(`SELECT * FROM \`${tableName}\``);
            
            if (rows.length > 0) {
                sqlDump += `-- Data for table ${tableName}\n`;
                
                for (const row of rows) {
                    const columns = Object.keys(row);
                    const values = columns.map(col => {
                        const val = row[col];
                        if (val === null) return 'NULL';
                        if (typeof val === 'number') return val;
                        if (val instanceof Date) return `'${val.toISOString().slice(0, 19).replace('T', ' ')}'`;
                        return `'${String(val).replace(/'/g, "''")}'`;
                    });
                    
                    sqlDump += `INSERT INTO \`${tableName}\` (\`${columns.join('`, `')}\`) VALUES (${values.join(', ')});\n`;
                }
                
                sqlDump += '\n';
            }
        }
        
        sqlDump += 'SET FOREIGN_KEY_CHECKS=1;\n';
        
        // Save to file
        const filename = 'heritagelink-export.sql';
        fs.writeFileSync(filename, sqlDump);
        
        await connection.end();
        
        console.log(`\n✅ Database exported successfully!`);
        console.log(`📁 File saved: ${filename}`);
        console.log(`📊 Total tables exported: ${tableNames.length}\n`);
        console.log('🚀 Next step: Run "node import-to-aiven.js" to import to production\n');
        
    } catch (error) {
        console.error('❌ Export failed:', error.message);
        console.error('\nMake sure:');
        console.error('1. Your local MySQL is running');
        console.error('2. Database credentials in .env are correct');
        console.error('3. Database "heritagelink" exists locally');
    }
}

exportDatabase();
