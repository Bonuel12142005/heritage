// Google Maps Configuration
export const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';

export function getGoogleMapsScriptUrl(libraries = ['places']) {
    const libParam = libraries.length > 0 ? `&libraries=${libraries.join(',')}` : '';
    return `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}${libParam}`;
}

export function validateApiKey() {
    if (!GOOGLE_MAPS_API_KEY) {
        console.warn('⚠️ GOOGLE_MAPS_API_KEY is not set in environment variables');
        return false;
    }
    return true;
}
