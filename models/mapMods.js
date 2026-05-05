import { db } from './db.js';

// Mock data for places/establishments
const mockPlaces = [
    // Destinations/Attractions
    {
        id: 1,
        name: 'Gloria Heritage Museum',
        description: 'A museum showcasing the rich cultural heritage of Gloria, featuring artifacts, traditional crafts, and historical exhibits.',
        category: 'attraction',
        type: 'museum',
        latitude: 12.9847,
        longitude: 121.4683,
        address: 'Poblacion, Gloria, Oriental Mindoro',
        contact: '+63 912 345 6789',
        opening_hours: '8:00 AM - 5:00 PM (Tue-Sun)',
        entrance_fee: 50,
        rating: 4.5,
        image_url: '/uploads/destinations/heritage-museum.jpg',
        amenities: ['parking', 'restroom', 'guided_tour', 'wheelchair_accessible'],
        status: 'active'
    },
    {
        id: 2,
        name: 'Mangyan Village Cultural Site',
        description: 'Experience the authentic Mangyan way of life. Visit traditional houses, watch weaving demonstrations, and learn about indigenous culture.',
        category: 'attraction',
        type: 'cultural_site',
        latitude: 12.9912,
        longitude: 121.4521,
        address: 'Barangay Agsalin, Gloria, Oriental Mindoro',
        contact: '+63 917 654 3210',
        opening_hours: '7:00 AM - 4:00 PM (Daily)',
        entrance_fee: 100,
        rating: 4.8,
        image_url: '/uploads/destinations/mangyan-village.jpg',
        amenities: ['parking', 'restroom', 'souvenir_shop', 'guided_tour'],
        status: 'active'
    },
    {
        id: 3,
        name: 'Gloria Waterfalls',
        description: 'A stunning natural waterfall surrounded by lush forest. Perfect for swimming and nature photography.',
        category: 'attraction',
        type: 'natural',
        latitude: 12.9756,
        longitude: 121.4892,
        address: 'Barangay Buong Lupa, Gloria, Oriental Mindoro',
        contact: '+63 918 765 4321',
        opening_hours: '6:00 AM - 5:00 PM (Daily)',
        entrance_fee: 30,
        rating: 4.6,
        image_url: '/uploads/destinations/gloria-falls.jpg',
        amenities: ['parking', 'restroom', 'picnic_area', 'swimming'],
        status: 'active'
    },
    {
        id: 4,
        name: 'San Jose Beach Resort',
        description: 'Beautiful white sand beach with crystal clear waters. Ideal for swimming, snorkeling, and beach activities.',
        category: 'attraction',
        type: 'beach',
        latitude: 12.9634,
        longitude: 121.4234,
        address: 'Coastal Road, Gloria, Oriental Mindoro',
        contact: '+63 919 876 5432',
        opening_hours: '6:00 AM - 6:00 PM (Daily)',
        entrance_fee: 75,
        rating: 4.4,
        image_url: '/uploads/destinations/san-jose-beach.jpg',
        amenities: ['parking', 'restroom', 'restaurant', 'swimming', 'cottages'],
        status: 'active'
    },
    // Restaurants
    {
        id: 5,
        name: 'Kusina ni Lola',
        description: 'Traditional Filipino restaurant serving authentic local dishes and Mindoro specialties.',
        category: 'restaurant',
        type: 'filipino',
        latitude: 12.9823,
        longitude: 121.4701,
        address: 'Main Street, Poblacion, Gloria',
        contact: '+63 920 123 4567',
        opening_hours: '7:00 AM - 9:00 PM (Daily)',
        entrance_fee: 0,
        price_range: '₱150-400',
        rating: 4.7,
        image_url: '/uploads/places/kusina-lola.jpg',
        amenities: ['parking', 'wifi', 'air_conditioning', 'delivery'],
        status: 'active'
    },
    {
        id: 6,
        name: 'Seaside Grill & Restaurant',
        description: 'Fresh seafood restaurant with ocean views. Specializes in grilled fish and shellfish.',
        category: 'restaurant',
        type: 'seafood',
        latitude: 12.9645,
        longitude: 121.4256,
        address: 'Beach Road, Gloria, Oriental Mindoro',
        contact: '+63 921 234 5678',
        opening_hours: '10:00 AM - 10:00 PM (Daily)',
        entrance_fee: 0,
        price_range: '₱200-600',
        rating: 4.5,
        image_url: '/uploads/places/seaside-grill.jpg',
        amenities: ['parking', 'wifi', 'outdoor_seating', 'ocean_view'],
        status: 'active'
    },
    // Hotels/Accommodations
    {
        id: 7,
        name: 'Gloria Heritage Inn',
        description: 'Comfortable hotel in the heart of Gloria with modern amenities and traditional Filipino hospitality.',
        category: 'hotel',
        type: 'hotel',
        latitude: 12.9835,
        longitude: 121.4695,
        address: 'National Highway, Poblacion, Gloria',
        contact: '+63 922 345 6789',
        opening_hours: '24 Hours',
        entrance_fee: 0,
        price_range: '₱1,500-3,500/night',
        rating: 4.3,
        image_url: '/uploads/places/heritage-inn.jpg',
        amenities: ['parking', 'wifi', 'air_conditioning', 'restaurant', 'pool'],
        status: 'active'
    },
    {
        id: 8,
        name: 'Beachfront Resort & Spa',
        description: 'Luxury beachfront resort with spa services, private beach access, and water sports facilities.',
        category: 'hotel',
        type: 'resort',
        latitude: 12.9612,
        longitude: 121.4198,
        address: 'Coastal Road, Gloria, Oriental Mindoro',
        contact: '+63 923 456 7890',
        opening_hours: '24 Hours',
        entrance_fee: 0,
        price_range: '₱3,500-8,000/night',
        rating: 4.8,
        image_url: '/uploads/places/beachfront-resort.jpg',
        amenities: ['parking', 'wifi', 'pool', 'spa', 'restaurant', 'beach_access', 'water_sports'],
        status: 'active'
    },
    // Services
    {
        id: 9,
        name: 'Gloria Tourism Office',
        description: 'Official tourism information center. Get maps, guides, and assistance for your Gloria adventure.',
        category: 'service',
        type: 'tourism_office',
        latitude: 12.9841,
        longitude: 121.4678,
        address: 'Municipal Hall, Poblacion, Gloria',
        contact: '+63 924 567 8901',
        opening_hours: '8:00 AM - 5:00 PM (Mon-Fri)',
        entrance_fee: 0,
        rating: 4.6,
        image_url: '/uploads/places/tourism-office.jpg',
        amenities: ['parking', 'wifi', 'restroom', 'information_desk'],
        status: 'active'
    },
    {
        id: 10,
        name: 'Van Terminal - Gloria',
        description: 'Main transportation hub for vans and buses to Calapan, Roxas, and other destinations.',
        category: 'service',
        type: 'transport',
        latitude: 12.9867,
        longitude: 121.4712,
        address: 'National Highway, Gloria, Oriental Mindoro',
        contact: '+63 925 678 9012',
        opening_hours: '4:00 AM - 8:00 PM (Daily)',
        entrance_fee: 0,
        rating: 4.0,
        image_url: '/uploads/places/van-terminal.jpg',
        amenities: ['parking', 'restroom', 'waiting_area', 'ticketing'],
        status: 'active'
    },
    // Shops
    {
        id: 11,
        name: 'Mangyan Crafts & Souvenirs',
        description: 'Authentic Mangyan handicrafts, woven products, and local souvenirs. Support local artisans!',
        category: 'shop',
        type: 'souvenir',
        latitude: 12.9829,
        longitude: 121.4688,
        address: 'Market Area, Poblacion, Gloria',
        contact: '+63 926 789 0123',
        opening_hours: '8:00 AM - 6:00 PM (Daily)',
        entrance_fee: 0,
        rating: 4.7,
        image_url: '/uploads/places/mangyan-crafts.jpg',
        amenities: ['parking', 'air_conditioning'],
        status: 'active'
    },
    {
        id: 12,
        name: 'Gloria Public Market',
        description: 'Local market selling fresh produce, seafood, and local delicacies. Best visited in the morning.',
        category: 'shop',
        type: 'market',
        latitude: 12.9838,
        longitude: 121.4692,
        address: 'Market Street, Poblacion, Gloria',
        contact: null,
        opening_hours: '5:00 AM - 6:00 PM (Daily)',
        entrance_fee: 0,
        rating: 4.2,
        image_url: '/uploads/places/public-market.jpg',
        amenities: ['parking', 'restroom'],
        status: 'active'
    }
];

// Predefined routes
const mockRoutes = [
    {
        id: 1,
        name: 'Cultural Heritage Trail',
        description: 'Explore the rich cultural heritage of Gloria through museums, ancestral houses, and the Mangyan village.',
        duration: '4-5 hours',
        distance: '8 km',
        difficulty: 'easy',
        waypoints: [
            { place_id: 9, order: 1, note: 'Start at Tourism Office for maps and guides' },
            { place_id: 1, order: 2, note: 'Visit the Heritage Museum' },
            { place_id: 11, order: 3, note: 'Shop for souvenirs' },
            { place_id: 2, order: 4, note: 'Experience Mangyan culture' }
        ],
        category: 'cultural',
        image_url: '/uploads/routes/cultural-trail.jpg'
    },
    {
        id: 2,
        name: 'Beach & Nature Adventure',
        description: 'A day of sun, sand, and natural wonders. Visit waterfalls and beaches.',
        duration: '6-7 hours',
        distance: '15 km',
        difficulty: 'moderate',
        waypoints: [
            { place_id: 9, order: 1, note: 'Get directions and tips' },
            { place_id: 3, order: 2, note: 'Morning swim at the waterfalls' },
            { place_id: 6, order: 3, note: 'Lunch at Seaside Grill' },
            { place_id: 4, order: 4, note: 'Afternoon at the beach' }
        ],
        category: 'nature',
        image_url: '/uploads/routes/beach-nature.jpg'
    },
    {
        id: 3,
        name: 'Food & Market Tour',
        description: 'Taste the flavors of Gloria! Visit local markets and restaurants.',
        duration: '3-4 hours',
        distance: '3 km',
        difficulty: 'easy',
        waypoints: [
            { place_id: 12, order: 1, note: 'Early morning market visit' },
            { place_id: 5, order: 2, note: 'Breakfast at Kusina ni Lola' },
            { place_id: 11, order: 3, note: 'Buy local delicacies' },
            { place_id: 6, order: 4, note: 'Seafood lunch' }
        ],
        category: 'food',
        image_url: '/uploads/routes/food-tour.jpg'
    }
];

class MapPlace {
    static async findAll(filters = {}) {
        let query = 'SELECT * FROM map_places WHERE status = ?';
        const params = ['active'];

        if (filters.category) {
            query += ' AND category = ?';
            params.push(filters.category);
        }

        if (filters.type) {
            query += ' AND type = ?';
            params.push(filters.type);
        }

        if (filters.search) {
            query += ' AND (name LIKE ? OR description LIKE ?)';
            params.push(`%${filters.search}%`, `%${filters.search}%`);
        }

        query += ' ORDER BY rating DESC, name ASC';

        const [rows] = await db.query(query, params);
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM map_places WHERE id = ?', [id]);
        return rows[0];
    }

    static async findNearby(lat, lng, radiusKm = 5, category = null) {
        try {
            // Haversine formula in SQL
            let query = `
                SELECT *, 
                (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance 
                FROM map_places 
                WHERE status = 'active'
            `;
            const params = [lat, lng, lat];

            if (category) {
                query += ' AND category = ?';
                params.push(category);
            }

            query += ' HAVING distance < ? ORDER BY distance';
            params.push(radiusKm);

            const [rows] = await db.query(query, params);
            return rows;
        } catch (err) {
            console.log('MapPlace findNearby using mock data:', err.message);
            // Simple distance calculation for mock data
            const toRad = (deg) => deg * Math.PI / 180;
            const R = 6371; // Earth's radius in km

            let places = mockPlaces.filter(p => p.status === 'active');
            if (category) {
                places = places.filter(p => p.category === category);
            }

            return places.map(p => {
                const dLat = toRad(p.latitude - lat);
                const dLon = toRad(p.longitude - lng);
                const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat)) * Math.cos(toRad(p.latitude)) * Math.sin(dLon / 2) ** 2;
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                const distance = R * c;
                return { ...p, distance: Math.round(distance * 100) / 100 };
            }).filter(p => p.distance < radiusKm).sort((a, b) => a.distance - b.distance);
        }
    }

    static async getCategories() {
        try {
            const [rows] = await db.query('SELECT DISTINCT category FROM map_places WHERE status = ? ORDER BY category', ['active']);
            return rows.map(r => r.category);
        } catch (err) {
            return [...new Set(mockPlaces.map(p => p.category))].sort();
        }
    }

    static async create(data) {
        console.log('MapPlace.create called with data:', data);
        const [result] = await db.query(
            `INSERT INTO map_places (name, description, category, type, latitude, longitude, address, contact, opening_hours, entrance_fee, price_range, rating, image_url, amenities, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.name || '',
                data.description || '',
                data.category || '',
                data.type || '',
                data.latitude || 0,
                data.longitude || 0,
                data.address || '',
                data.contact || '',
                data.opening_hours || '',
                data.entrance_fee || 0,
                data.price_range || '',
                data.rating || 0,
                data.image_url || null,
                JSON.stringify(data.amenities || []),
                'active'
            ]
        );
        console.log('MapPlace.create result - insertId:', result.insertId);
        return result.insertId;
    }

    static async update(id, data) {
        console.log('MapPlace.update called for ID:', id, 'with data:', data);
        const fields = [];
        const params = [];
        Object.keys(data).forEach(key => {
            if (data[key] !== undefined) {
                fields.push(`${key} = ?`);
                params.push(key === 'amenities' ? JSON.stringify(data[key]) : data[key]);
            }
        });
        params.push(id);
        await db.query(`UPDATE map_places SET ${fields.join(', ')} WHERE id = ?`, params);
        console.log('MapPlace.update completed for ID:', id);
    }

    static async delete(id) {
        console.log('MapPlace.delete called for ID:', id);
        await db.query('UPDATE map_places SET status = ? WHERE id = ?', ['deleted', id]);
        console.log('MapPlace.delete completed for ID:', id);
    }
}

class TouristRoute {
    static async findAll() {
        try {
            const [rows] = await db.query('SELECT * FROM tourist_routes ORDER BY name');
            return rows;
        } catch (err) {
            console.log('TouristRoute findAll using mock data:', err.message);
            return mockRoutes;
        }
    }

    static async findById(id) {
        try {
            const [rows] = await db.query('SELECT * FROM tourist_routes WHERE id = ?', [id]);
            return rows[0];
        } catch (err) {
            return mockRoutes.find(r => r.id === parseInt(id));
        }
    }

    static async getRouteWithPlaces(id) {
        const route = await this.findById(id);
        if (!route) return null;

        // Get full place details for each waypoint
        const waypoints = route.waypoints || [];
        const placesWithDetails = await Promise.all(
            waypoints.map(async (wp) => {
                const place = await MapPlace.findById(wp.place_id);
                return { ...wp, place };
            })
        );

        return { ...route, waypoints: placesWithDetails };
    }
}

export { MapPlace, TouristRoute, mockPlaces, mockRoutes };
