// Add coordinates to destinations in Aiven MySQL database
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Gloria, Oriental Mindoro approximate center
const GLORIA_CENTER = { lat: 12.9841, lng: 121.4678 };

// Sample coordinates around Gloria (spread within ~10km radius)
const destinationCoordinates = [
    { lat: 12.9841, lng: 121.4678 }, // Center
    { lat: 13.0200, lng: 121.4500 }, // North
    { lat: 12.9500, lng: 121.4900 }, // South-East
    { lat: 12.9700, lng: 121.4400 }, // West
    { lat: 13.0100, lng: 121.4800 }, // North-East
    { lat: 12.9600, lng: 121.4600 }, // South-West
    { lat: 12.9900, lng: 121.4750 }, // North-Center
    { lat: 12.9750, lng: 121.4550 }, // Center-West
    { lat: 12.9950, lng: 121.4650 }, // North-West
    { lat: 12.9650, lng: 121.4850 }, // South-East
];

async function addCoordinates() {
    let connection;
    
    try {
        console.log('🔗 Connecting to Aiven MySQL...');
        
        // Use Aiven credentials directly
        connection = await mysql.createConnection({
            host: 'mysql-2a6b1cea-heritage-6610.d.aivencloud.com',
            port: 17649,
            user: 'avnadmin',
            password: process.env.AIVEN_PASSWORD,
            database: 'heritagelink',
            ssl: {
                rejectUnauthorized: false
            }
        });
        
        console.log('✅ Connected to Aiven MySQL');
        
        // Get all destinations without coordinates
        const [destinations] = await connection.execute(
            'SELECT id, name FROM destinations WHERE latitude IS NULL OR longitude IS NULL ORDER BY id'
        );
        
        console.log(`📍 Found ${destinations.length} destinations without coordinates`);
        
        if (destinations.length === 0) {
            console.log('✅ All destinations already have coordinates!');
            return;
        }
        
        // Update each destination with coordinates
        let updated = 0;
        for (let i = 0; i < destinations.length; i++) {
            const dest = destinations[i];
            // Use coordinates from array, cycling through if more destinations than coordinates
            const coords = destinationCoordinates[i % destinationCoordinates.length];
            
            // Add small random offset to avoid exact duplicates
            const lat = coords.lat + (Math.random() - 0.5) * 0.01; // ±0.005 degrees (~500m)
            const lng = coords.lng + (Math.random() - 0.5) * 0.01;
            
            await connection.execute(
                'UPDATE destinations SET latitude = ?, longitude = ? WHERE id = ?',
                [lat, lng, dest.id]
            );
            
            updated++;
            console.log(`  ✓ Updated "${dest.name}" (ID: ${dest.id}) → ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        }
        
        console.log(`\n✅ Successfully updated ${updated} destinations with coordinates!`);
        console.log('🗺️  All destinations can now be displayed on the map');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Database connection closed');
        }
    }
}

addCoordinates();
