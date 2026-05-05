import mapController from './controllers/mapController.js';

// Mock request and response objects
const mockReq = {
  body: {
    name: 'Heritage Museum Test',
    description: 'A test museum for heritage preservation',
    category: 'attraction',
    type: 'museum',
    latitude: '12.9847',
    longitude: '121.4683',
    address: 'Poblacion, Gloria, Oriental Mindoro',
    contact: '+63 912 345 6789',
    opening_hours: '8:00 AM - 5:00 PM',
    entrance_fee: '50',
    price_range: '₱50'
  },
  file: null
};

const mockRes = {
  redirect: (url) => {
    console.log('Redirect to:', url);
    if (url.includes('success')) {
      console.log('✅ Place saved successfully!');
    } else if (url.includes('error')) {
      console.log('❌ Error saving place:', url);
    }
  }
};

async function testController() {
  try {
    console.log('Testing controller savePlace method...');
    console.log('Form data:', mockReq.body);
    
    await mapController.savePlace(mockReq, mockRes);
    
    // Verify the place was saved
    const { MapPlace } = await import('./models/mapMods.js');
    const places = await MapPlace.findAll();
    console.log('Total places after save:', places.length);
    
    const newPlace = places.find(p => p.name === 'Heritage Museum Test');
    if (newPlace) {
      console.log('✅ Found saved place:', newPlace.name);
      console.log('   Category:', newPlace.category);
      console.log('   Location:', newPlace.latitude, newPlace.longitude);
    } else {
      console.log('❌ Place not found in database');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Controller test error:', err);
    process.exit(1);
  }
}

testController();