#!/usr/bin/env node

/**
 * Standalone migration script
 * Run with: node scripts/migrate.js
 */

import { runMigrations } from './run-migrations.js';

console.log('🚀 HeritageLink Database Migration Tool\n');

runMigrations()
    .then(() => {
        console.log('\n✨ Migration completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Migration failed:', error);
        process.exit(1);
    });
