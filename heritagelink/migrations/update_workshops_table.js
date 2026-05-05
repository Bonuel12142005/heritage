import mysql from 'mysql2/promise';

async function updateWorkshopsTable() {
    const connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'heritagelink'
    });

    console.log('Connected to database');

    try {
        // Add new columns to workshops table
        const columnsToAdd = [
            { name: 'latitude', type: 'DECIMAL(10, 8)' },
            { name: 'longitude', type: 'DECIMAL(11, 8)' },
            { name: 'image_path', type: 'VARCHAR(500)' },
            { name: 'duration', type: 'VARCHAR(100)' }
        ];

        for (const col of columnsToAdd) {
            const [exists] = await connection.execute(`SHOW COLUMNS FROM workshops LIKE '${col.name}'`);
            if (exists.length === 0) {
                console.log(`Adding ${col.name} column...`);
                await connection.execute(`ALTER TABLE workshops ADD COLUMN ${col.name} ${col.type}`);
                console.log(`✓ ${col.name} column added`);
            } else {
                console.log(`✓ ${col.name} column already exists`);
            }
        }

        console.log('\n✅ Workshops table updated!');
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await connection.end();
    }
}

updateWorkshopsTable();
