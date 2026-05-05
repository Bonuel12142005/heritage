import mysql from 'mysql2/promise';

async function addProfilePhotoColumn() {
    const connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'heritagelink'
    });

    console.log('Connected to database');

    try {
        // Check if profile_photo column exists
        const [columns] = await connection.execute(`SHOW COLUMNS FROM users LIKE 'profile_photo'`);
        
        if (columns.length === 0) {
            console.log('Adding profile_photo column to users table...');
            await connection.execute(`ALTER TABLE users ADD COLUMN profile_photo VARCHAR(500) NULL`);
            console.log('✓ profile_photo column added');
        } else {
            console.log('✓ profile_photo column already exists');
        }

        // Also ensure other profile-related columns exist
        const columnsToAdd = [
            { name: 'phone', type: 'VARCHAR(50)' },
            { name: 'address', type: 'VARCHAR(500)' },
            { name: 'bio', type: 'TEXT' },
            { name: 'contact_number', type: 'VARCHAR(50)' },
            { name: 'business_name', type: 'VARCHAR(255)' },
            { name: 'specialization', type: 'VARCHAR(255)' },
            { name: 'facebook_url', type: 'VARCHAR(500)' },
            { name: 'instagram_url', type: 'VARCHAR(500)' }
        ];

        for (const col of columnsToAdd) {
            const [exists] = await connection.execute(`SHOW COLUMNS FROM users LIKE '${col.name}'`);
            if (exists.length === 0) {
                console.log(`Adding ${col.name} column...`);
                await connection.execute(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type} NULL`);
                console.log(`✓ ${col.name} column added`);
            }
        }

        console.log('\n✅ All profile columns are ready!');
    } catch (error) {
        console.error('Migration error:', error.message);
    } finally {
        await connection.end();
    }
}

addProfilePhotoColumn();
