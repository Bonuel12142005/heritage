import mysql from 'mysql2/promise';

async function addPortfolioDescription() {
    const connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'heritagelink'
    });

    console.log('Connected to database');

    try {
        // Check if portfolio table exists
        const [tables] = await connection.execute(`SHOW TABLES LIKE 'portfolio'`);
        
        if (tables.length === 0) {
            console.log('Creating portfolio table...');
            await connection.execute(`
                CREATE TABLE portfolio (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    artisan_id INT NOT NULL,
                    image_path VARCHAR(500) NOT NULL,
                    title VARCHAR(255),
                    description TEXT,
                    views INT DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    INDEX idx_artisan (artisan_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `);
            console.log('✓ Portfolio table created');
        } else {
            // Check if description column exists
            const [columns] = await connection.execute(`SHOW COLUMNS FROM portfolio LIKE 'description'`);
            if (columns.length === 0) {
                console.log('Adding description column...');
                await connection.execute(`ALTER TABLE portfolio ADD COLUMN description TEXT AFTER title`);
                console.log('✓ Description column added');
            } else {
                console.log('✓ Description column already exists');
            }
            
            // Check if views column exists
            const [viewsCol] = await connection.execute(`SHOW COLUMNS FROM portfolio LIKE 'views'`);
            if (viewsCol.length === 0) {
                console.log('Adding views column...');
                await connection.execute(`ALTER TABLE portfolio ADD COLUMN views INT DEFAULT 0`);
                console.log('✓ Views column added');
            }
        }

        console.log('\n✅ Portfolio table is ready!');
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await connection.end();
    }
}

addPortfolioDescription();
