import { sequelize } from '../models/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsDir = path.join(__dirname, '../migrations');

/**
 * Create database if it doesn't exist
 */
async function createDatabaseIfNotExists() {
    const dbName = process.env.DB_NAME || 'heritagelink';
    
    try {
        // Connect without database name to create it
        const { Sequelize } = await import('sequelize');
        const tempSequelize = new Sequelize('', process.env.DB_USER || 'root', process.env.DB_PASSWORD || '', {
            host: process.env.DB_HOST || '127.0.0.1',
            port: process.env.DB_PORT || 3306,
            dialect: 'mysql',
            logging: false
        });

        await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        console.log(`✅ Database '${dbName}' ensured`);
        await tempSequelize.close();
    } catch (error) {
        console.error('❌ Error creating database:', error.message);
        throw error;
    }
}

/**
 * Create migrations tracking table
 */
async function createMigrationsTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS migrations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    try {
        await sequelize.query(sql);
        console.log('✅ Migrations table ensured');
    } catch (error) {
        console.error('❌ Error creating migrations table:', error.message);
        throw error;
    }
}

/**
 * Get list of executed migrations
 */
async function getExecutedMigrations() {
    try {
        const [results] = await sequelize.query('SELECT name FROM migrations');
        return results.map(row => row.name);
    } catch (error) {
        return [];
    }
}

/**
 * Mark migration as executed
 */
async function markMigrationExecuted(name) {
    await sequelize.query('INSERT INTO migrations (name) VALUES (?)', {
        replacements: [name]
    });
}

/**
 * Execute SQL migration file
 */
async function executeSqlMigration(filePath, fileName) {
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);
    
    for (const statement of statements) {
        try {
            await sequelize.query(statement);
        } catch (error) {
            // Ignore "already exists" errors
            if (!error.message.includes('already exists')) {
                throw error;
            }
        }
    }
    
    console.log(`  ✅ Executed SQL: ${fileName}`);
}

/**
 * Execute JS migration file
 */
async function executeJsMigration(filePath, fileName) {
    const migration = await import(filePath);
    
    if (typeof migration.up === 'function') {
        await migration.up(sequelize);
    } else if (typeof migration.default === 'function') {
        await migration.default(sequelize);
    }
    
    console.log(`  ✅ Executed JS: ${fileName}`);
}

/**
 * Run all pending migrations
 */
export async function runMigrations() {
    console.log('🔄 Starting migration process...\n');
    
    try {
        // Step 1: Create database if needed
        await createDatabaseIfNotExists();
        
        // Step 2: Ensure connection
        await sequelize.authenticate();
        console.log('✅ Database connection established\n');
        
        // Step 3: Create migrations tracking table
        await createMigrationsTable();
        
        // Step 4: Get executed migrations
        const executedMigrations = await getExecutedMigrations();
        console.log(`📋 Found ${executedMigrations.length} previously executed migrations\n`);
        
        // Step 5: Get all migration files
        const files = fs.readdirSync(migrationsDir)
            .filter(f => f.endsWith('.sql') || f.endsWith('.js'))
            .sort(); // Execute in alphabetical order
        
        console.log(`📂 Found ${files.length} migration files\n`);
        
        // Step 6: Execute pending migrations
        let executedCount = 0;
        
        for (const file of files) {
            if (executedMigrations.includes(file)) {
                console.log(`  ⏭️  Skipping (already executed): ${file}`);
                continue;
            }
            
            const filePath = path.join(migrationsDir, file);
            
            try {
                if (file.endsWith('.sql')) {
                    await executeSqlMigration(filePath, file);
                } else if (file.endsWith('.js')) {
                    await executeJsMigration(filePath, file);
                }
                
                await markMigrationExecuted(file);
                executedCount++;
            } catch (error) {
                console.error(`  ❌ Error executing ${file}:`, error.message);
                // Continue with other migrations
            }
        }
        
        console.log(`\n✅ Migration complete! Executed ${executedCount} new migrations`);
        
    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        throw error;
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runMigrations()
        .then(() => {
            console.log('\n🎉 All done!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 Migration failed:', error);
            process.exit(1);
        });
}
