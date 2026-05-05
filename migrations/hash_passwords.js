import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

async function hashPasswords() {
    const connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'heritagelink'
    });

    console.log('Connected to database');

    try {
        // Get all users with plain text passwords (not starting with $2)
        const [users] = await connection.execute(`SELECT id, email, password FROM users`);
        
        console.log(`Found ${users.length} users to check\n`);

        let updated = 0;
        for (const user of users) {
            // Check if password is already hashed (bcrypt hashes start with $2)
            if (user.password && !user.password.startsWith('$2')) {
                console.log(`Hashing password for: ${user.email}`);
                
                // Hash the plain text password
                const hashedPassword = await bcrypt.hash(user.password, 10);
                
                // Update the user's password
                await connection.execute(
                    `UPDATE users SET password = ? WHERE id = ?`,
                    [hashedPassword, user.id]
                );
                
                console.log(`  ✓ Password hashed for user ID ${user.id}`);
                updated++;
            } else if (user.password && user.password.startsWith('$2')) {
                console.log(`  - ${user.email}: Already hashed`);
            } else {
                console.log(`  - ${user.email}: No password set`);
            }
        }

        console.log(`\n✅ Hashed ${updated} passwords`);
        
        // Verify by showing sample
        const [sample] = await connection.execute(`SELECT id, email, LEFT(password, 20) as pwd_preview FROM users LIMIT 5`);
        console.log('\n📋 Password preview (first 20 chars):');
        sample.forEach(u => {
            console.log(`  - ${u.email}: ${u.pwd_preview}...`);
        });

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await connection.end();
    }
}

hashPasswords();
