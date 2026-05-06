// Test script to debug login issues
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

async function testLogin() {
    try {
        console.log('🔍 Testing database connection and login...');
        console.log('📍 DB_HOST:', process.env.DB_HOST || 'localhost');
        console.log('📍 DB_PORT:', process.env.DB_PORT || 3306);
        console.log('📍 DB_USER:', process.env.DB_USER || 'root');
        console.log('📍 DB_NAME:', process.env.DB_NAME || 'heritagelink');
        
        // Check if we're connecting to Aiven (production)
        const isAiven = process.env.DB_HOST && process.env.DB_HOST.includes('aivencloud.com');
        
        // Create connection to MySQL
        const connectionConfig = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'heritagelink',
            charset: 'utf8mb4'
        };
        
        // Add SSL for Aiven production database
        if (isAiven) {
            connectionConfig.ssl = {
                rejectUnauthorized: false
            };
            console.log('🔒 Using SSL for Aiven connection');
        }
        
        const db = await mysql.createConnection(connectionConfig);
        console.log('✅ Database connected!');
        
        // Test query: Get all users
        console.log('\n📊 Fetching all users...');
        const [users] = await db.execute('SELECT id, email, name, role, password FROM users LIMIT 10');
        console.log(`✅ Found ${users.length} users`);
        
        // Check each user
        for (const user of users) {
            console.log(`\n👤 User: ${user.email} (${user.role})`);
            console.log(`   - ID: ${user.id}`);
            console.log(`   - Name: ${user.name}`);
            console.log(`   - Has password: ${!!user.password}`);
            console.log(`   - Password length: ${user.password ? user.password.length : 0}`);
            console.log(`   - Password starts with $2: ${user.password ? user.password.startsWith('$2') : false}`);
            
            // Test password comparison with a sample password
            if (user.password) {
                try {
                    // Try comparing with common test passwords
                    const testPasswords = ['password', 'admin123', 'artisan123', 'user123', '123456'];
                    for (const testPass of testPasswords) {
                        const isValid = await bcrypt.compare(testPass, user.password);
                        if (isValid) {
                            console.log(`   ✅ Password matches: "${testPass}"`);
                            break;
                        }
                    }
                } catch (error) {
                    console.log(`   ❌ Error comparing password: ${error.message}`);
                }
            }
        }
        
        // Test a specific login attempt
        console.log('\n\n🔐 Testing login with sample credentials...');
        const testEmail = users[0]?.email;
        if (testEmail) {
            console.log(`Testing with email: ${testEmail}`);
            const [testUsers] = await db.execute('SELECT * FROM users WHERE email = ?', [testEmail]);
            if (testUsers.length > 0) {
                console.log('✅ User found in database');
                console.log('User data:', {
                    id: testUsers[0].id,
                    email: testUsers[0].email,
                    name: testUsers[0].name,
                    role: testUsers[0].role,
                    hasPassword: !!testUsers[0].password
                });
            }
        }
        
        await db.end();
        console.log('\n✅ Test completed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
    }
}

testLogin();
