// Interactive Map JavaScript - OpenStreetMap with Leaflet
let map;
let markers = [];
let markersLayer;
let userMarker;
let activeCategory = 'all';
let currentRoute = null;
let routeLayer = null;

// Gloria, Oriental Mindoro center coordinates
const GLORIA_CENTER = [12.9841, 121.4678];

// Category colors and icons
const CATEGORY_CONFIG = {
    heritage: { color: '#2d8659', icon: 'fa-landmark', label: 'Heritage Site' },
    natural: { color: '#0891b2', icon: 'fa-tree', label: 'Natural' },
    cultural: { color: '#7c3aed', icon: 'fa-theater-masks', label: 'Cultural' },
    religious: { color: '#dc2626', icon: 'fa-church', label: 'Religious' },
    attraction: { color: '#2d8659', icon: 'fa-landmark', label: 'Attractions' },
    restaurant: { color: '#f59e0b', icon: 'fa-utensils', label: 'Restaurants' },
    hotel: { color: '#3b82f6', icon: 'fa-bed', label: 'Hotels' },
    shop: { color: '#8b5cf6', icon: 'fa-shopping-bag', label: 'Shops' },
    service: { color: '#ef4444', icon: 'fa-info-circle', label: 'Services' }
};

// Initialize map
function initMap() {
    map = L.map('map', {
        center: GLORIA_CENTER,
        zoom: 14,
        zoomControl: false
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // Create markers layer group
    markersLayer = L.layerGroup().addTo(map);

    // Add markers for all places
    addMarkers(PLACES);
    
    // Setup custom controls
    setupControls();
}

// Create custom marker icon with upgraded visuals
function createMarkerIcon(color, iconClass) {
    return L.divIcon({
        className: 'custom-marker',
        html: `<div class="marker-container" style="position: relative; width: 40px; height: 50px;">
                 <!-- Marker pin shape -->
                 <div class="marker-pin" style="
                   position: absolute;
                   width: 40px;
                   height: 40px;
                   background: linear-gradient(135deg, ${color} 0%, ${adjustBrightness(color, -20)} 100%);
                   border-radius: 50% 50% 50% 0;
                   transform: rotate(-45deg);
                   left: 0;
                   top: 0;
                   border: 3px solid white;
                   box-shadow: 0 4px 12px rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.15);
                 "></div>
                 <!-- Icon inside marker -->
                 <div class="marker-icon" style="
                   position: absolute;
                   width: 40px;
                   height: 40px;
                   display: flex;
                   align-items: center;
                   justify-content: center;
                   left: 0;
                   top: 0;
                   z-index: 2;
                 ">
                   <i class="fas ${iconClass}" style="
                     color: white;
                     font-size: 16px;
                     text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                     transform: rotate(0deg);
                   "></i>
                 </div>
                 <!-- Pulsing ring animation -->
                 <div class="marker-pulse" style="
                   position: absolute;
                   width: 40px;
                   height: 40px;
                   border-radius: 50%;
                   background: ${color};
                   opacity: 0;
                   left: 0;
                   top: 0;
                   animation: pulse 2s ease-out infinite;
                 "></div>
               </div>
               <style>
                 @keyframes pulse {
                   0% {
                     transform: scale(0.8) rotate(-45deg);
                     opacity: 0.8;
                   }
                   50% {
                     transform: scale(1.2) rotate(-45deg);
                     opacity: 0.4;
                   }
                   100% {
                     transform: scale(1.5) rotate(-45deg);
                     opacity: 0;
                   }
                 }
                 .custom-marker:hover .marker-pin {
                   transform: rotate(-45deg) scale(1.1);
                   transition: transform 0.2s ease;
                 }
               </style>`,
        iconSize: [40, 50],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
}

// Helper function to adjust color brightness
function adjustBrightness(color, percent) {
    const num = parseInt(color.replace("#",""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 +
           (G<255?G<1?0:G:255)*0x100 +
           (B<255?B<1?0:B:255))
           .toString(16).slice(1);
}

// Add markers to map
function addMarkers(places) {
    clearMarkers();
    
    places.forEach(place => {
        const type = (place.type || place.category || '').toLowerCase();
        if (activeCategory !== 'all' && activeCategory !== '' && type.indexOf(activeCategory) === -1) return;
        
        if (!place.latitude || !place.longitude) return;
        
        const config = CATEGORY_CONFIG[type] || CATEGORY_CONFIG[place.category] || CATEGORY_CONFIG.service;
        
        const marker = L.marker([place.latitude, place.longitude], {
            icon: createMarkerIcon(config.color, config.icon)
        });
        
        marker.placeData = place;
        
        const popupContent = createPopupContent(place, config);
        marker.bindPopup(popupContent, { maxWidth: 280 });
        
        marker.on('click', () => {
            map.panTo([place.latitude, place.longitude]);
        });
        
        marker.addTo(markersLayer);
        markers.push(marker);
    });
}

// Create popup content
function createPopupContent(place, config) {
    return `
        <div class="info-window">
            <h3><i class="fas ${config.icon}" style="color: ${config.color}"></i> ${escapeHtml(place.name)}</h3>
            <p>${place.description ? escapeHtml(place.description.substring(0, 120)) + '...' : ''}</p>
            <div class="info-meta">
                ${place.address ? `<div><i class="fas fa-map-marker-alt"></i> ${escapeHtml(place.address)}</div>` : ''}
                ${place.opening_hours ? `<div><i class="fas fa-clock"></i> ${escapeHtml(place.opening_hours)}</div>` : ''}
                ${place.contact ? `<div><i class="fas fa-phone"></i> ${escapeHtml(place.contact)}</div>` : ''}
                ${place.entrance_fee ? `<div><i class="fas fa-ticket-alt"></i> ₱${place.entrance_fee} entrance</div>` : ''}
                ${place.rating ? `<div><i class="fas fa-star" style="color: #f59e0b"></i> ${place.rating} rating</div>` : ''}
            </div>
            <button class="btn-sm btn-green" style="width:100%;margin-top:8px;padding:0.6rem;font-weight:700;background:#4285f4;border:none;box-shadow:0 2px 4px rgba(66,133,244,0.3)" onclick="getDirectionsTo(${place.latitude}, ${place.longitude}, '${escapeHtml(place.name).replace(/'/g, "\\'")}')">
                <i class="fas fa-directions"></i> Get Directions
            </button>
        </div>
    `;
}

// Clear all markers
function clearMarkers() {
    markersLayer.clearLayers();
    markers = [];
}

// Setup custom controls
function setupControls() {
    // Zoom controls
    document.getElementById('zoomInBtn')?.addEventListener('click', () => map.zoomIn());
    document.getElementById('zoomOutBtn')?.addEventListener('click', () => map.zoomOut());
    document.getElementById('myLocationBtn')?.addEventListener('click', findNearby);
}

// Focus on a place
function focusPlace(placeId) {
    const place = PLACES.find(p => p.id === placeId);
    if (!place || !place.latitude || !place.longitude) return;
    
    map.setView([place.latitude, place.longitude], 16);
    
    const marker = markers.find(m => m.placeData?.id === placeId);
    if (marker) {
        marker.openPopup();
    }
    
    // Close sidebar on mobile
    const sidebar = document.getElementById('mapSidebar');
    if (window.innerWidth <= 900 && sidebar) {
        sidebar.classList.remove('open');
        const toggle = document.getElementById('sidebarToggle');
        if (toggle) toggle.innerHTML = '<i class="fas fa-layer-group"></i>';
    }
}

// Show route on map with proper road routing
async function showRoute(routeId) {
    const route = ROUTES.find(r => r.id === routeId);
    if (!route || !route.waypoints?.length) {
        console.warn('Route not found or no waypoints:', routeId);
        return;
    }
    
    // Clear any existing routes first
    clearAllRoutes();
    
    currentRoute = route;
    
    // Get waypoint coordinates from places
    const waypoints = route.waypoints.map(wp => {
        const place = PLACES.find(p => p.id === wp.place_id);
        return place ? [place.latitude, place.longitude] : null;
    }).filter(Boolean);
    
    if (waypoints.length < 2) {
        console.warn('Not enough valid waypoints for route:', routeId);
        return;
    }
    
    // Show loading state
    showInAppDirections(route.name || 'Route', 0, 0, true);
    
    try {
        // Get road routing for multi-point route
        const routeData = await getMultiPointRoute(waypoints);
        
        if (routeData && routeData.features && routeData.features.length > 0) {
            const routeFeature = routeData.features[0];
            const coordinates = routeFeature.geometry.coordinates;
            const properties = routeFeature.properties;
            
            // Convert coordinates to Leaflet format [lat, lng]
            const routeCoords = coordinates.map(coord => [coord[1], coord[0]]);
            
            // Create route polyline with route-specific color
            routeLayer = L.polyline(routeCoords, {
                color: '#2d8659',
                weight: 5,
                opacity: 0.8,
                lineJoin: 'round',
                lineCap: 'round'
            }).addTo(map);
            
            // Add direction arrows along the route
            addRouteArrowsAlongPath(routeCoords);
            
            // Fit map to route bounds
            map.fitBounds(routeLayer.getBounds(), { padding: [50, 50] });
            
            // Extract route information
            const distance = (properties.segments[0].distance / 1000).toFixed(1);
            const duration = Math.round(properties.segments[0].duration / 60);
            
            // Show directions panel with real data
            showInAppDirections(route.name || 'Route', distance, duration, false);
            
        } else {
            // Fallback to simple polyline if routing fails
            console.warn('Road routing failed for route, using simple polyline');
            createSimpleRoute(waypoints, route);
        }
        
    } catch (error) {
        console.error('Route routing error:', error);
        // Fallback to simple polyline
        createSimpleRoute(waypoints, route);
    }
}

// Get multi-point road route
async function getMultiPointRoute(waypoints) {
    if (waypoints.length < 2) return null;
    
    try {
        // For multi-point routes, we'll chain single routes together
        // Start with first two points
        const startPoint = waypoints[0];
        const endPoint = waypoints[waypoints.length - 1];
        
        // Use the existing getRoadRoute function
        return await getRoadRoute(startPoint[1], startPoint[0], endPoint[1], endPoint[0]);
        
    } catch (error) {
        console.error('Multi-point routing error:', error);
        return null;
    }
}

// Create simple route fallback
function createSimpleRoute(waypoints, route) {
    // Draw simple polyline connecting waypoints
    routeLayer = L.polyline(waypoints, {
        color: '#2d8659',
        weight: 5,
        opacity: 0.8,
        dashArray: '10, 5'
    }).addTo(map);
    
    // Add simple arrows
    addRouteArrows(waypoints);
    
    // Calculate approximate distance
    let totalDistance = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
        totalDistance += calculateDistance(
            waypoints[i][0], waypoints[i][1],
            waypoints[i + 1][0], waypoints[i + 1][1]
        );
    }
    
    const duration = Math.round((totalDistance / 30) * 60);
    
    // Fit map to route bounds
    map.fitBounds(routeLayer.getBounds(), { padding: [50, 50] });
    
    // Show directions panel
    showInAppDirections(route.name || 'Route', totalDistance.toFixed(1), duration, false);
}

// Preview route (same as show route)
function previewRoute(routeId) {
    showRoute(routeId);
}

// Start route with user location
async function startRoute(routeId) {
    if (!navigator.geolocation) {
        alert('Geolocation is needed to start the route');
        return;
    }
    
    const route = ROUTES.find(r => r.id === routeId);
    if (!route || !route.waypoints?.length) return;
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            
            // Clear existing routes
            clearAllRoutes();
            
            // Add user location marker
            userMarker = L.marker([userLat, userLng], {
                icon: L.divIcon({
                    className: 'user-marker',
                    html: `<div style="background-color: #4285f4; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px #4285f4, 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
                             <i class="fas fa-user" style="color: white; font-size: 10px;"></i>
                           </div>`,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                })
            }).addTo(map);
            
            userMarker.bindPopup('<strong><i class="fas fa-crosshairs"></i> Your Location</strong>');
            
            // Get first waypoint
            const firstWaypoint = route.waypoints[0];
            const firstPlace = PLACES.find(p => p.id === firstWaypoint.place_id);
            
            if (firstPlace) {
                // Get directions to first stop
                getDirectionsTo(firstPlace.latitude, firstPlace.longitude, `${route.name || 'Route'} - First Stop: ${firstPlace.name}`);
            }
        },
        (error) => {
            alert('Unable to get your location. Please enable location services.');
            console.error('Geolocation error:', error);
        }
    );
}

// Show directions panel
function showDirectionsPanel(route, waypoints) {
    const panel = document.getElementById('directionsPanel');
    if (!panel) return;
    
    // Calculate approximate distance
    let totalDistance = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
        totalDistance += calculateDistance(
            waypoints[i][0], waypoints[i][1],
            waypoints[i + 1][0], waypoints[i + 1][1]
        );
    }
    
    // Estimate duration (assuming 30 km/h average speed)
    const durationMin = Math.round((totalDistance / 30) * 60);
    
    document.getElementById('dirDistance').textContent = totalDistance.toFixed(1) + ' km';
    document.getElementById('dirDuration').textContent = durationMin + ' min';
    document.getElementById('dirStops').textContent = waypoints.length;
    
    panel.classList.add('active');
}

// Close directions
document.getElementById('closeDirections')?.addEventListener('click', () => {
    clearAllRoutes();
});

// Start navigation for a route
function startNavigation(routeId) {
    const route = ROUTES.find(r => r.id === routeId);
    if (!route || !route.waypoints?.length) return;
    
    const firstWp = route.waypoints[0];
    const place = PLACES.find(p => p.id === firstWp.place_id);
    if (!place) return;
    
    // Open Google Maps navigation (works on mobile)
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}&travelmode=driving`;
    window.open(url, '_blank');
}

// Clear all route-related elements (ensure only one route at a time)
function clearAllRoutes() {
    // Hide directions panel
    const panel = document.getElementById('directionsPanel');
    if (panel) {
        panel.classList.remove('active', 'auto-hide');
    }
    
    // Remove route layer
    if (routeLayer) {
        map.removeLayer(routeLayer);
        routeLayer = null;
    }
    
    // Remove all route arrows
    if (window.routeArrows) {
        window.routeArrows.forEach(arrow => map.removeLayer(arrow));
        window.routeArrows = [];
    }
    
    // Remove user marker
    if (userMarker) {
        map.removeLayer(userMarker);
        userMarker = null;
    }
    
    // Clear current route reference
    currentRoute = null;
    
    // Close any open popups
    map.closePopup();
}

// Get directions to a specific place with proper road routing
function getDirectionsTo(lat, lng, name) {
    if (!navigator.geolocation) {
        alert('Geolocation is needed to show directions');
        return;
    }
    
    // FIRST: Clear any existing routes/directions to ensure only one at a time
    clearAllRoutes();
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            
            // Add user location marker
            userMarker = L.marker([userLat, userLng], {
                icon: L.divIcon({
                    className: 'user-marker',
                    html: `<div style="background-color: #4285f4; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px #4285f4, 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
                             <i class="fas fa-user" style="color: white; font-size: 10px;"></i>
                           </div>`,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                })
            }).addTo(map);
            
            userMarker.bindPopup('<strong><i class="fas fa-crosshairs"></i> Your Location</strong>');
            
            // Show loading state
            showInAppDirections(name, 0, 0, true);
            
            try {
                // Get proper road routing using OpenRouteService
                const routeData = await getRoadRoute(userLng, userLat, lng, lat);
                
                if (routeData && routeData.features && routeData.features.length > 0) {
                    const route = routeData.features[0];
                    const coordinates = route.geometry.coordinates;
                    const properties = route.properties;
                    
                    // Convert coordinates to Leaflet format [lat, lng]
                    const routeCoords = coordinates.map(coord => [coord[1], coord[0]]);
                    
                    // Create route polyline
                    routeLayer = L.polyline(routeCoords, {
                        color: '#4285f4',
                        weight: 5,
                        opacity: 0.8,
                        lineJoin: 'round',
                        lineCap: 'round'
                    }).addTo(map);
                    
                    // Add direction arrows along the route
                    addRouteArrowsAlongPath(routeCoords);
                    
                    // Fit map to show the route
                    const bounds = L.latLngBounds([
                        [userLat, userLng],
                        [lat, lng]
                    ]);
                    map.fitBounds(bounds, { padding: [50, 50] });
                    
                    // Extract route information
                    const distance = (properties.segments[0].distance / 1000).toFixed(1); // Convert to km
                    const duration = Math.round(properties.segments[0].duration / 60); // Convert to minutes
                    
                    // Show directions panel with real data
                    showInAppDirections(name, distance, duration, false);
                    
                } else {
                    // Fallback to straight line if routing fails
                    console.warn('Road routing failed, using straight line');
                    createStraightLineRoute(userLat, userLng, lat, lng, name);
                }
                
            } catch (error) {
                console.error('Routing error:', error);
                // Fallback to straight line
                createStraightLineRoute(userLat, userLng, lat, lng, name);
            }
            
            // Add destination marker popup
            const destMarker = markers.find(m => 
                m.placeData && 
                Math.abs(m.placeData.latitude - lat) < 0.0001 && 
                Math.abs(m.placeData.longitude - lng) < 0.0001
            );
            if (destMarker) {
                setTimeout(() => destMarker.openPopup(), 500);
            }
        },
        (error) => {
            alert('Unable to get your location. Please enable location services for directions.');
            console.error('Geolocation error:', error);
        }
    );
}

// Get road route using OpenRouteService API
async function getRoadRoute(startLng, startLat, endLng, endLat) {
    try {
        // Option 1: Try OpenRouteService public API (free tier)
        // Correct GET endpoint format for OpenRouteService
        const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248d5b2b7b7c4b84e8bb5b8b8b8b8b8b8b8&start=${startLng},${startLat}&end=${endLng},${endLat}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`ORS HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.warn('OpenRouteService API error, falling back to OSRM:', error.message);
        
        // Option 2: Try alternative routing service (OSRM - Open Source Routing Machine)
        try {
            // OSRM Public API endpoint
            const osrmUrl = `https://routing.openstreetmap.de/routed-car/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
            const osrmResponse = await fetch(osrmUrl);
            
            if (osrmResponse.ok) {
                const osrmData = await osrmResponse.json();
                
                if (osrmData.routes && osrmData.routes.length > 0) {
                    // Convert OSRM format to GeoJSON format
                    const route = osrmData.routes[0];
                    return {
                        features: [{
                            geometry: route.geometry,
                            properties: {
                                segments: [{
                                    distance: route.distance,
                                    duration: route.duration
                                }]
                            }
                        }]
                    };
                }
            }
        } catch (osrmError) {
            console.error('OSRM API error:', osrmError);
        }
        
        return null;
    }
}

// Fallback function for straight line route
function createStraightLineRoute(userLat, userLng, destLat, destLng, name) {
    const routeCoords = [
        [userLat, userLng],
        [destLat, destLng]
    ];
    
    routeLayer = L.polyline(routeCoords, {
        color: '#4285f4',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 5'
    }).addTo(map);
    
    // Add simple arrow
    addRouteArrows(routeCoords);
    
    // Calculate straight-line distance
    const distance = calculateDistance(userLat, userLng, destLat, destLng);
    const duration = Math.round((distance / 30) * 60);
    
    // Fit map to show both points
    const bounds = L.latLngBounds([
        [userLat, userLng],
        [destLat, destLng]
    ]);
    map.fitBounds(bounds, { padding: [50, 50] });
    
    // Show directions panel
    showInAppDirections(name, distance.toFixed(1), duration, false);
}

// Add direction arrows along the route path
function addRouteArrowsAlongPath(coords) {
    if (coords.length < 2) return;
    
    if (!window.routeArrows) window.routeArrows = [];
    
    // Add arrows at regular intervals along the route
    const arrowInterval = Math.max(1, Math.floor(coords.length / 8)); // Show ~8 arrows max
    
    for (let i = arrowInterval; i < coords.length - 1; i += arrowInterval) {
        const currentPoint = coords[i];
        const nextPoint = coords[i + 1];
        
        // Calculate bearing for arrow direction
        const bearing = calculateBearing(
            currentPoint[0], currentPoint[1],
            nextPoint[0], nextPoint[1]
        );
        
        // Add arrow marker
        const arrowMarker = L.marker(currentPoint, {
            icon: L.divIcon({
                className: 'route-arrow',
                html: `<div style="transform: rotate(${bearing}deg); color: #4285f4; font-size: 14px; text-shadow: 1px 1px 2px rgba(255,255,255,0.8);">
                         <i class="fas fa-arrow-up"></i>
                       </div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            })
        }).addTo(map);
        
        window.routeArrows.push(arrowMarker);
    }
}

// Add arrow markers along route
function addRouteArrows(coords) {
    if (coords.length < 2) return;
    
    const start = coords[0];
    const end = coords[1];
    
    // Calculate midpoint
    const midLat = (start[0] + end[0]) / 2;
    const midLng = (start[1] + end[1]) / 2;
    
    // Calculate bearing for arrow direction
    const bearing = calculateBearing(start[0], start[1], end[0], end[1]);
    
    // Add arrow marker at midpoint
    const arrowMarker = L.marker([midLat, midLng], {
        icon: L.divIcon({
            className: 'route-arrow',
            html: `<div style="transform: rotate(${bearing}deg); color: #4285f4; font-size: 16px;">
                     <i class="fas fa-arrow-up"></i>
                   </div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        })
    }).addTo(map);
    
    // Store arrow marker for cleanup
    if (!window.routeArrows) window.routeArrows = [];
    window.routeArrows.push(arrowMarker);
}

// Calculate bearing between two points
function calculateBearing(lat1, lng1, lat2, lng2) {
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    
    const y = Math.sin(dLng) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);
    
    const bearing = Math.atan2(y, x) * 180 / Math.PI;
    return (bearing + 360) % 360;
}

// Show in-app directions panel
function showInAppDirections(destinationName, distance, duration, isLoading = false) {
    const panel = document.getElementById('directionsPanel');
    if (!panel) return;
    
    // Update panel content
    const header = panel.querySelector('.dir-header h3');
    if (header) {
        if (isLoading) {
            header.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Finding route to ${destinationName}...`;
        } else {
            header.innerHTML = `<i class="fas fa-directions"></i> Directions to ${destinationName}`;
        }
    }
    
    if (isLoading) {
        document.getElementById('dirDistance').textContent = '...';
        document.getElementById('dirDuration').textContent = '...';
        document.getElementById('dirStops').textContent = '...';
    } else {
        document.getElementById('dirDistance').textContent = distance + ' km';
        document.getElementById('dirDuration').textContent = duration + ' min';
        document.getElementById('dirStops').textContent = '2';
    }
    
    panel.classList.add('active');
    
    if (!isLoading) {
        // Auto-hide after 15 seconds for completed routes
        setTimeout(() => {
            if (panel.classList.contains('active')) {
                panel.classList.add('auto-hide');
            }
        }, 15000);
    }
}

// Find nearby places
function findNearby() {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
    }
    
    // Clear any existing routes first
    clearAllRoutes();
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            
            // Add user marker
            userMarker = L.marker([userLat, userLng], {
                icon: L.divIcon({
                    className: 'user-marker',
                    html: `<div style="background-color: #4285f4; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px #4285f4, 0 2px 6px rgba(0,0,0,0.3);"></div>`,
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                })
            }).addTo(map);
            
            userMarker.bindPopup('<strong>Your Location</strong>').openPopup();
            
            map.setView([userLat, userLng], 15);
            
            // Calculate distances and update place list
            const nearbyPlaces = PLACES.map(place => {
                if (!place.latitude || !place.longitude) return null;
                const distance = calculateDistance(userLat, userLng, place.latitude, place.longitude);
                return { ...place, distance: distance.toFixed(2) + ' km' };
            }).filter(Boolean).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
            
            // Update the place list with distances
            renderPlaces(nearbyPlaces);
        },
        (error) => {
            alert('Unable to get your location. Please enable location services.');
            console.error('Geolocation error:', error);
        }
    );
}

// Calculate distance between two points (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Escape HTML
function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Render places in sidebar list
function renderPlaces(places = PLACES) {
    const placeList = document.getElementById('placeList');
    if (!placeList) return;
    
    if (!places || places.length === 0) {
        placeList.innerHTML = '<div class="empty-msg"><i class="fas fa-map-marker-alt"></i><p>No places found</p></div>';
        return;
    }
    
    const placesToShow = places.filter(place => {
        if (!place.latitude || !place.longitude) return false;
        
        const type = (place.type || place.category || '').toLowerCase();
        if (activeCategory !== 'all' && activeCategory !== '' && type.indexOf(activeCategory) === -1) return false;
        
        return true;
    });
    
    if (placesToShow.length === 0) {
        placeList.innerHTML = '<div class="empty-msg"><i class="fas fa-filter"></i><p>No places match your filters</p></div>';
        return;
    }
    
    placeList.innerHTML = placesToShow.map(place => {
        const config = CATEGORY_CONFIG[place.type] || CATEGORY_CONFIG[place.category] || CATEGORY_CONFIG.service;
        const hasImage = place.image_url && place.image_url !== 'null';
        
        return `
            <div class="place-card" onclick="focusPlace(${place.id})">
                <div class="place-card-inner">
                    <div class="place-thumb">
                        ${hasImage ? 
                            `<img src="${place.image_url}" alt="${escapeHtml(place.name)}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                             <i class="fas ${config.icon}" style="display:none;"></i>` :
                            `<i class="fas ${config.icon}"></i>`
                        }
                    </div>
                    <div class="place-info">
                        <div class="place-name">${escapeHtml(place.name)}</div>
                        <div class="place-type">${config.label}</div>
                        <div class="place-meta">
                            ${place.rating ? `<span class="place-rating"><i class="fas fa-star"></i> ${place.rating}</span>` : ''}
                            ${place.distance ? `<span class="place-distance"><i class="fas fa-map-marker-alt"></i> ${place.distance}</span>` : ''}
                            ${place.entrance_fee && place.entrance_fee > 0 ? `<span><i class="fas fa-ticket-alt"></i> ₱${place.entrance_fee}</span>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Filter places by category
function filterByCategory(category) {
    activeCategory = category;
    
    // Update active pill
    document.querySelectorAll('.cat-pill').forEach(pill => {
        pill.classList.remove('active');
        if (pill.dataset.cat === category) {
            pill.classList.add('active');
        }
    });
    
    // Re-render places and markers
    renderPlaces();
    addMarkers(PLACES);
}

// Search places
function searchPlaces(query) {
    if (!query.trim()) {
        renderPlaces();
        return;
    }
    
    const filteredPlaces = PLACES.filter(place => {
        const searchText = `${place.name} ${place.description} ${place.address} ${place.type}`.toLowerCase();
        return searchText.includes(query.toLowerCase());
    });
    
    renderPlaces(filteredPlaces);
    addMarkers(filteredPlaces);
}

// Setup event listeners
function setupEventListeners() {
    // Category pills
    document.querySelectorAll('.cat-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            filterByCategory(pill.dataset.cat || '');
        });
    });
    
    // Search input
    const searchInput = document.getElementById('searchPlace');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchPlaces(e.target.value);
        });
    }
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            
            // Update active tab button
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update active tab panel
            document.querySelectorAll('.tab-panel').forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === tabId + 'Tab') {
                    panel.classList.add('active');
                }
            });
        });
    });
    
    // Close directions panel
    const closeDirections = document.getElementById('closeDirections');
    if (closeDirections) {
        closeDirections.addEventListener('click', () => {
            clearAllRoutes();
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    renderPlaces();
    setupEventListeners();
});
