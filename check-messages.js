// Check messages in Aiven
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function checkMessages() {
    let connection;
    
    try {
        connection = await mysql.createConnection({
            host: 'mysql-2a6b1cea-heritage-6610.d.aivencloud.com',
            port: 17649,
            user: 'avnadmin',
            password: process.env.AIVEN_PASSWORD,
            database: 'heritagelink',
            ssl: { rejectUnauthorized: false }
        });
        
        console.log('✅ Connected to Aiven MySQL');
        
        // Check if messages table exists
        try {
            const [tables] = await connection.execute("SHOW TABLES LIKE 'messages'");
            if (tables.length === 0) {
                console.log('❌ Messages table does not exist!');
                console.log('Creating messages table...');
                
                await connection.execute(`
                    CREATE TABLE messages (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        sender_id INT NOT NULL,
                        recipient_id INT NOT NULL,
                        subject VARCHAR(255),
                        message TEXT NOT NULL,
                        is_read BOOLEAN DEFAULT FALSE,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        FOREIGN KEY (sender_id) REFERENCES users(id),
                        FOREIGN KEY (recipient_id) REFERENCES users(id)
                    )
                `);
                console.log('✅ Messages table created!');
            } else {
                console.log('✅ Messages table exists');
            }
            
            const [count] = await connection.execute('SELECT COUNT(*) as total FROM messages');
            console.log(`📊 Total messages: ${count[0].total}`);
            
            if (count[0].total === 0) {
                console.log('\n📝 Adding sample messages...');
                
                // Get user IDs
                const [users] = await connection.execute('SELECT id, name, role FROM users LIMIT 5');
                console.log('Found users:', users.map(u => `${u.name} (${u.role})`).join(', '));
                
                if (users.length >= 2) {
                    // Add sample messages between users
                    await connection.execute(
                        'INSERT INTO messages (sender_id, recipient_id, subject, message) VALUES (?, ?, ?, ?)',
                        [users[0].id, users[1].id, 'Welcome to HeritageLink!', 'Hello! Thank you for joining our platform. How can I help you today?']
                    );
                    
                    await connection.execute(
                        'INSERT INTO messages (sender_id, recipient_id, subject, message) VALUES (?, ?, ?, ?)',
                        [users[1].id, users[0].id, 'Re: Welcome to HeritageLink!', 'Thank you! I am interested in learning more about traditional crafts.']
                    );
                    
                    if (users.length >= 3) {
                        await connection.execute(
                            'INSERT INTO messages (sender_id, recipient_id, subject, message) VALUES (?, ?, ?, ?)',
                            [users[0].id, users[2].id, 'Workshop Inquiry', 'Are you available for a basket weaving workshop next week?']
                        );
                    }
                    
                    console.log('✅ Sample messages added!');
                }
            }
            
            const [messages] = await connection.execute('SELECT m.*, s.name as sender, r.name as recipient FROM messages m JOIN users s ON m.sender_id = s.id JOIN users r ON m.recipient_id = r.id');
            console.log('\n💬 Messages:');
            messages.forEach(m => {
                console.log(`   ${m.sender} → ${m.recipient}: "${m.subject}"`);
            });
            
        } catch (error) {
            console.error('Error:', error.message);
        }
        
        await connection.end();
    } catch (error) {
        console.error('Connection error:', error.message);
    }
}

checkMessages();
