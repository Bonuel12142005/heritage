import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../models/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    console.log('🔄 Running migration 005: Fix destination status column...');
    
    const migrationPath = path.join(__dirname, '../migrations/005_fix_destination_status.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      if (statement.trim()) {
        await db.query(statement);
        console.log('✅ Executed:', statement.substring(0, 50) + '...');
      }
    }
    
    console.log('✅ Migration 005 completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
