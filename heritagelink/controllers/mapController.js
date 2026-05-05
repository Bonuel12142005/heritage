import { MapPlace, TouristRoute } from '../models/mapMods.js';

class MapController {
    // Public: Interactive Map Page
    async getMapPage(req, res) {
        try {
            const places = await MapPlace.findAll();
            const routes = await TouristRoute.findAll();
            const categories = await MapPlace.getCategories();

            res.render('interactive-map', {
                title: 'Interactive Map - HeritageLink',
                user: req.session.user,
                places,
                routes,
                categories,
                googleMapsKey: process.env.GOOGLE_MAPS_API_KEY || ''
            });
        } catch (err) {
            console.error('Map page error:', err);
            res.render('interactive-map', {
                title: 'Interactive Map - HeritageLink',
                user: req.session.user,
                places: [],
                routes: [],
                categories: [],
                googleMapsKey: process.env.GOOGLE_MAPS_API_KEY || ''
            });
        }
    }

    // Public: Place Detail Page
    async getPlaceDetail(req, res) {
        try {
            const place = await MapPlace.findById(req.params.id);
            if (!place) {
                return res.status(404).render('error', {
                    title: 'Place Not Found - HeritageLink',
                    user: req.session.user,
                    error: 'The place you are looking for does not exist.'
                });
            }

            res.render('place-detail', {
                title: `${place.name} - HeritageLink`,
                user: req.session.user,
                place,
                googleMapsKey: process.env.GOOGLE_MAPS_API_KEY || ''
            });
        } catch (err) {
            console.error('Place detail error:', err);
            res.status(500).render('error', {
                title: 'Error - HeritageLink',
                user: req.session.user,
                error: 'Failed to load place details.'
            });
        }
    }

    // API: Get all places
    async apiGetPlaces(req, res) {
        try {
            const filters = {
                category: req.query.category,
                type: req.query.type,
                search: req.query.search
            };
            const places = await MapPlace.findAll(filters);
            res.json({ success: true, places });
        } catch (err) {
            console.error('API places error:', err);
            res.status(500).json({ success: false, error: 'Failed to fetch places' });
        }
    }

    // API: Get single place
    async apiGetPlace(req, res) {
        try {
            const place = await MapPlace.findById(req.params.id);
            if (!place) {
                return res.status(404).json({ success: false, error: 'Place not found' });
            }
            res.json({ success: true, place });
        } catch (err) {
            console.error('API place error:', err);
            res.status(500).json({ success: false, error: 'Failed to fetch place' });
        }
    }

    // API: Get nearby places
    async apiGetNearby(req, res) {
        try {
            const { lat, lng, radius, category } = req.query;
            if (!lat || !lng) {
                return res.status(400).json({ success: false, error: 'Latitude and longitude required' });
            }
            const places = await MapPlace.findNearby(
                parseFloat(lat),
                parseFloat(lng),
                parseFloat(radius) || 5,
                category
            );
            res.json({ success: true, places });
        } catch (err) {
            console.error('API nearby error:', err);
            res.status(500).json({ success: false, error: 'Failed to fetch nearby places' });
        }
    }

    // API: Get all routes
    async apiGetRoutes(req, res) {
        try {
            const routes = await TouristRoute.findAll();
            res.json({ success: true, routes });
        } catch (err) {
            console.error('API routes error:', err);
            res.status(500).json({ success: false, error: 'Failed to fetch routes' });
        }
    }

    // API: Get route with full place details
    async apiGetRoute(req, res) {
        try {
            const route = await TouristRoute.getRouteWithPlaces(req.params.id);
            if (!route) {
                return res.status(404).json({ success: false, error: 'Route not found' });
            }
            res.json({ success: true, route });
        } catch (err) {
            console.error('API route error:', err);
            res.status(500).json({ success: false, error: 'Failed to fetch route' });
        }
    }

    // API: Get directions (proxy to avoid exposing API key)
    async apiGetDirections(req, res) {
        try {
            const { origin, destination, waypoints, mode } = req.query;
            
            // Return waypoints for client-side directions
            res.json({
                success: true,
                origin,
                destination,
                waypoints: waypoints ? waypoints.split('|') : [],
                mode: mode || 'DRIVING'
            });
        } catch (err) {
            console.error('API directions error:', err);
            res.status(500).json({ success: false, error: 'Failed to get directions' });
        }
    }

    // Admin: Manage places
    async adminPlaces(req, res) {
        try {
            const places = await MapPlace.findAll();
            const categories = await MapPlace.getCategories();

            res.render('admin-map-places', {
                title: 'Map Places - Admin',
                user: req.session.user,
                places,
                categories,
                success: req.query.success,
                error: req.query.error
            });
        } catch (err) {
            console.error('Admin places error:', err);
            res.render('admin-map-places', {
                title: 'Map Places - Admin',
                user: req.session.user,
                places: [],
                categories: [],
                error: 'Failed to load places'
            });
        }
    }

    // Admin: Add place form
    async addPlaceForm(req, res) {
        res.render('admin-map-place-form', {
            title: 'Add Place - Admin',
            user: req.session.user,
            place: null,
            googleMapsKey: process.env.GOOGLE_MAPS_API_KEY || ''
        });
    }

    // Admin: Edit place form
    async editPlaceForm(req, res) {
        try {
            const place = await MapPlace.findById(req.params.id);
            if (!place) {
                return res.redirect('/admin/map-places?error=Place not found');
            }
            res.render('admin-map-place-form', {
                title: 'Edit Place - Admin',
                user: req.session.user,
                place,
                googleMapsKey: process.env.GOOGLE_MAPS_API_KEY || ''
            });
        } catch (err) {
            res.redirect('/admin/map-places?error=Failed to load place');
        }
    }

    // Admin: Save place
    async savePlace(req, res) {
        try {
            console.log('=== SAVE PLACE DEBUG ===');
            console.log('Request body:', req.body);
            console.log('Request file:', req.file);
            
            const data = {
                name: req.body.name,
                description: req.body.description,
                category: req.body.category,
                type: req.body.type,
                latitude: parseFloat(req.body.latitude),
                longitude: parseFloat(req.body.longitude),
                address: req.body.address,
                contact: req.body.contact,
                opening_hours: req.body.opening_hours,
                entrance_fee: parseFloat(req.body.entrance_fee) || 0,
                price_range: req.body.price_range,
                amenities: req.body.amenities ? req.body.amenities.split(',').map(a => a.trim()) : []
            };

            if (req.file) {
                data.image_url = '/uploads/places/' + req.file.filename;
            }

            console.log('Processed data:', data);

            if (req.body.id) {
                console.log('Updating existing place with ID:', req.body.id);
                await MapPlace.update(req.body.id, data);
                console.log('Update completed successfully');
                res.redirect('/admin/map-places?success=Place updated successfully');
            } else {
                console.log('Creating new place...');
                const result = await MapPlace.create(data);
                console.log('Create result:', result);
                
                // Verify it was saved
                const places = await MapPlace.findAll();
                console.log('Total places after create:', places.length);
                
                res.redirect('/admin/map-places?success=Place created successfully');
            }
        } catch (err) {
            console.error('Save place error:', err);
            res.redirect('/admin/map-places?error=' + encodeURIComponent(err.message));
        }
    }

    // Admin: Delete place
    async deletePlace(req, res) {
        try {
            await MapPlace.delete(req.params.id);
            res.redirect('/admin/map-places?success=Place deleted successfully');
        } catch (err) {
            res.redirect('/admin/map-places?error=Failed to delete place');
        }
    }
}

export default new MapController();
