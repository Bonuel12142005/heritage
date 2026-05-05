#!/usr/bin/env node

/**
 * Check MySQL installation and provide setup instructions
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

console.log('🔍 Checking MySQL installation...\n');

async function checkMySQL() {
    try {
        // Try to run mysql command
        const { stdout } = await execAsync('mysql --version');
        console.log('✅ MySQL is installed!');
        console.log(`   ${stdout.trim()}\n`);
        
        // Try to connect
        console.log('🔌 Testing database connection...');
        const { sequelize } = await import('../models/db.js');
        
        try {
            await sequelize.authenticate();
            console.log('✅ Database connection successful!\n');
            console.log('🎉 You\'re all set! Run migrations with:');
            console.log('   npm run migrate\n');
        } catch (dbError) {
            console.log('⚠️  MySQL is installed but connection failed');
            console.log(`   Error: ${dbError.message}\n`);
            console.log('📝 Please check your .env file:');
            console.log('   - DB_HOST (default: 127.0.0.1)');
            console.log('   - DB_USER (default: root)');
            console.log('   - DB_PASSWORD');
            console.log('   - DB_PORT (default: 3306)\n');
            console.log('💡 Make sure MySQL service is running!\n');
        }
        
    } catch (error) {
        console.log('❌ MySQL is not installed or not in PATH\n');
        console.log('📦 Installation Options:\n');
        console.log('Option 1: MySQL Community Server (Recommended)');
        console.log('   1. Download from: https://dev.mysql.com/downloads/installer/');
        console.log('   2. Run the installer');
        console.log('   3. Choose "Developer Default" setup');
        console.log('   4. Set root password (or leave empty for dev)');
        console.log('   5. Complete installation\n');
        
        console.log('Option 2: XAMPP (Easier for beginners)');
        console.log('   1. Download from: https://www.apachefriends.org/');
        console.log('   2. Install XAMPP');
        console.log('   3. Start MySQL from XAMPP Control Panel\n');
        
        console.log('Option 3: MySQL via Chocolatey (if you have Choco)');
        console.log('   choco install mysql\n');
        
        console.log('📖 For detailed instructions, see: docs/MYSQL_SETUP.md\n');
        
        console.log('After installation:');
        console.log('   1. Copy .env.example to .env');
        console.log('   2. Update database credentials in .env');
        console.log('   3. Run: npm run migrate\n');
    }
}

checkMySQL().catch(console.error);
