// Script to seed heritage gallery data into the database
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'heritagelink';
const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;

async function seedHeritage() {
    console.log('🔌 Connecting to database...');
    
    const connection = await mysql.createConnection({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        port: DB_PORT
    });

    console.log('✅ Connected to database:', DB_NAME);

    // Check if data already exists
    const [existing] = await connection.execute('SELECT COUNT(*) as cnt FROM heritage_gallery');
    if (existing[0].cnt > 0) {
        console.log(`⚠️ Table already has ${existing[0].cnt} records. Clearing existing data...`);
        await connection.execute('DELETE FROM heritage_gallery');
    }

    // Insert heritage data matching existing table structure
    // Table has: id, title, description, category (enum), media_type (enum), file_url, thumbnail_url, metadata (json), uploaded_by, status, created_at
    // category enum: 'dance','music','craft','tradition','historical'
    // media_type enum: 'image','video','audio'
    console.log('📚 Inserting heritage gallery data...');
    
    const heritageItems = [
        {
            title: 'Traditional Mangyan Weaving',
            description: 'A demonstration of the ancient Mangyan weaving technique passed down through generations. This intricate craft produces beautiful textiles with symbolic patterns representing stories and beliefs of the Mangyan people.',
            category: 'craft',
            media_type: 'image',
            file_url: '/uploads/heritage/mangyan-weaving.jpg',
            thumbnail_url: '/uploads/heritage/mangyan-weaving.jpg',
            metadata: { contributor: 'Maria Santos', source: 'Gloria Cultural Center', historical_date: '1980s', location: 'Gloria, Oriental Mindoro', tags: 'mangyan,weaving,textile,traditional,craft', view_count: 45 }
        },
        {
            title: 'Moriones Festival 1975',
            description: 'Historical photograph of the Moriones Festival celebration in Gloria. Participants wear colorful Roman soldier costumes during Holy Week, reenacting the story of Longinus.',
            category: 'tradition',
            media_type: 'image',
            file_url: '/uploads/heritage/moriones-1975.jpg',
            thumbnail_url: '/uploads/heritage/moriones-1975.jpg',
            metadata: { contributor: 'Jose Reyes Archive', source: 'Municipal Archives', historical_date: '1975', location: 'Gloria Town Plaza', tags: 'moriones,festival,holy week,tradition,costume', view_count: 89 }
        },
        {
            title: "Elder Juan's Story of Gloria",
            description: "Oral history recording of Elder Juan Dela Cruz sharing stories about Gloria during the Japanese occupation and the town's recovery. A precious firsthand account of local history.",
            category: 'historical',
            media_type: 'audio',
            file_url: '/uploads/heritage/elder-juan-story.mp3',
            thumbnail_url: null,
            metadata: { contributor: 'Elder Juan Dela Cruz', source: 'Oral History Project 2020', historical_date: '2020', location: 'Barangay Agsalin', tags: 'oral history,world war 2,japanese occupation,elder,memory', duration: '15:30', transcript: 'During the war, we had to hide in the mountains...', view_count: 156 }
        },
        {
            title: 'Traditional Fishing Methods',
            description: "Video documentation of traditional fishing methods still practiced by local fishermen in Gloria's coastal barangays. Features the use of traditional nets and fish traps.",
            category: 'craft',
            media_type: 'video',
            file_url: '/uploads/heritage/traditional-fishing.mp4',
            thumbnail_url: '/uploads/heritage/traditional-fishing-thumb.jpg',
            metadata: { contributor: 'Cultural Documentation Team', source: 'HeritageLink Project', historical_date: '2023', location: 'Coastal Gloria', tags: 'fishing,traditional,livelihood,sea,coastal', duration: '8:45', view_count: 234 }
        },
        {
            title: 'Gloria Municipal Charter 1950',
            description: 'Scanned copy of the original municipal charter establishing Gloria as an independent municipality. This historical document marks the official founding of the town.',
            category: 'historical',
            media_type: 'image',
            file_url: '/uploads/heritage/gloria-charter-1950.jpg',
            thumbnail_url: '/uploads/heritage/gloria-charter-1950.jpg',
            metadata: { contributor: 'Municipal Archives', source: 'Official Records', historical_date: '1950', location: 'Gloria Municipal Hall', tags: 'charter,document,history,official,municipality', view_count: 67 }
        },
        {
            title: 'Pandanggo sa Ilaw Performance',
            description: 'Traditional Pandanggo sa Ilaw dance performed during the town fiesta, featuring dancers gracefully balancing oil lamps on their heads and hands.',
            category: 'dance',
            media_type: 'video',
            file_url: '/uploads/heritage/pandanggo-sa-ilaw.mp4',
            thumbnail_url: '/uploads/heritage/pandanggo-thumb.jpg',
            metadata: { contributor: 'Gloria Cultural Troupe', source: 'Fiesta 2019', historical_date: '2019', location: 'Gloria Town Plaza', tags: 'dance,pandanggo,traditional,fiesta,performance', duration: '4:20', view_count: 312 }
        },
        {
            title: 'Ancestral House of the Mendoza Family',
            description: 'One of the oldest surviving ancestral houses in Gloria, built in the Spanish colonial period with traditional Filipino-Spanish architecture featuring capiz windows and hardwood floors.',
            category: 'historical',
            media_type: 'image',
            file_url: '/uploads/heritage/mendoza-house.jpg',
            thumbnail_url: '/uploads/heritage/mendoza-house.jpg',
            metadata: { contributor: 'Heritage Survey Team', source: 'Architectural Heritage Survey', historical_date: '1890s (built)', location: 'Poblacion, Gloria', tags: 'architecture,ancestral house,spanish colonial,heritage,building', view_count: 178 }
        },
        {
            title: 'Traditional Suman Recipe',
            description: 'Documentation of the traditional suman-making process, a beloved rice cake delicacy wrapped in banana leaves. This recipe has been passed down for generations.',
            category: 'tradition',
            media_type: 'image',
            file_url: '/uploads/heritage/suman-making.jpg',
            thumbnail_url: '/uploads/heritage/suman-making.jpg',
            metadata: { contributor: 'Lola Rosario', source: 'Culinary Heritage Project', historical_date: '2022', location: 'Barangay Buong Lupa', tags: 'suman,food,cuisine,traditional,recipe,rice cake', view_count: 203 }
        },
        {
            title: 'Kulintang Ensemble Performance',
            description: 'Traditional Kulintang music performance showcasing the indigenous gong ensemble music of the region. This ancient musical tradition is an important part of Filipino cultural heritage.',
            category: 'music',
            media_type: 'audio',
            file_url: '/uploads/heritage/kulintang-performance.mp3',
            thumbnail_url: null,
            metadata: { contributor: 'Gloria Music Society', source: 'Cultural Festival 2021', historical_date: '2021', location: 'Gloria Cultural Center', tags: 'kulintang,music,traditional,gong,ensemble', duration: '12:15', view_count: 145 }
        },
        {
            title: 'Tinikling Dance Practice',
            description: 'Young dancers practicing the traditional Tinikling dance, the national folk dance of the Philippines. Dancers skillfully step between bamboo poles.',
            category: 'dance',
            media_type: 'video',
            file_url: '/uploads/heritage/tinikling-practice.mp4',
            thumbnail_url: '/uploads/heritage/tinikling-thumb.jpg',
            metadata: { contributor: 'Gloria Elementary School', source: 'School Cultural Program', historical_date: '2023', location: 'Gloria Elementary School', tags: 'tinikling,dance,bamboo,traditional,folk dance', duration: '5:30', view_count: 267 }
        }
    ];

    for (const item of heritageItems) {
        await connection.execute(`
            INSERT INTO heritage_gallery 
            (title, description, category, media_type, file_url, thumbnail_url, metadata, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'active')
        `, [
            item.title,
            item.description,
            item.category,
            item.media_type,
            item.file_url,
            item.thumbnail_url,
            JSON.stringify(item.metadata)
        ]);
        console.log(`  ✓ Inserted: ${item.title}`);
    }

    console.log('\n✅ Successfully inserted', heritageItems.length, 'heritage items!');

    // Verify
    const [count] = await connection.execute('SELECT COUNT(*) as total FROM heritage_gallery');
    console.log('📊 Total records in heritage_gallery:', count[0].total);

    await connection.end();
    console.log('\n🎉 Done! Heritage gallery data is now in your database.');
}

seedHeritage().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
