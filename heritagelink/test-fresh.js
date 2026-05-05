// Force fresh import by adding timestamp
const timestamp = Date.now();
const { MapPlace } = await import(`./models/mapMods.js?t=${timestamp}`);

async function testFresh() {
  try {
    console.log('Testing with fresh import...');
    
    const data = {
      name: 'Fresh Test Place',
      description: 'Testing with fresh import',
      category: 'restaurant',
      type: 'filipino',
      latitude: 12.9850,
      longitude: 121.4680,
      address: 'Fresh Test Address',
      contact: '+63 912 345 6790',
      opening_hours: '9:00 AM - 6:00 PM',
      entrance_fee: 0,
      price_range: '₱200-500',
      rating: 4.2,
      amenities: ['parking', 'wifi']
    };
    
    console.log('Creating place:', data.name);
    
    const result = await MapPlace.create(data);
    console.log('Create result:', result);
    
    // Verify
    const places = await MapPlace.findAll();
    console.log('Total places:', places.length);
    
    const found = places.find(p => p.name === data.name);
    if (found) {
      console.log('✅ Successfully saved and found:', found.name);
    } else {
      console.log('❌ Not found in database');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Fresh test error:', err);
    process.exit(1);
  }
}

testFresh();