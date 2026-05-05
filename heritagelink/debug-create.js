import { db } from './models/db.js';

async function debugCreate() {
  try {
    console.log('=== Debugging MapPlace.create ===\n');
    
    const data = {
      name: 'Debug Test Place',
      description: 'Testing the create method',
      category: 'attraction',
      type: 'museum',
      latitude: 12.9847,
      longitude: 121.4683,
      address: 'Test Address',
      contact: '+63 912 345 6789',
      opening_hours: '8:00 AM - 5:00 PM',
      entrance_fee: 50,
      price_range: '₱50',
      rating: 4.5,
      image_url: null,
      amenities: ['parking', 'restroom']
    };
    
    console.log('Input data:', data);
    
    const sql = `INSERT INTO map_places (name, description, category, type, latitude, longitude, address, contact, opening_hours, entrance_fee, price_range, rating, image_url, amenities, status) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const params = [
      data.name, 
      data.description, 
      data.category, 
      data.type, 
      data.latitude, 
      data.longitude, 
      data.address, 
      data.contact, 
      data.opening_hours, 
      data.entrance_fee, 
      data.price_range, 
      data.rating || 0, 
      data.image_url, 
      JSON.stringify(data.amenities || []), 
      'active'
    ];
    
    console.log('SQL:', sql);
    console.log('Parameters:', params);
    console.log('Parameter count:', params.length);
    console.log('Placeholder count:', (sql.match(/\?/g) || []).length);
    
    // Test the exact same logic as in MapPlace.create
    const [result] = await db.query(sql, params);
    console.log('✅ Insert successful, ID:', result.insertId);
    
    // Verify it was saved
    const [records] = await db.query('SELECT * FROM map_places WHERE id = ?', [result.insertId]);
    console.log('✅ Verification successful:', records[0].name);
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Debug failed:', err);
    console.error('Error details:', err.message);
    process.exit(1);
  }
}

debugCreate();