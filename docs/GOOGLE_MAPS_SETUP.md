# Google Maps Integration Setup Guide

## Overview
This guide explains how to set up and use the Google Maps Platform API integration for the HeritageLink destination management system.

## Features Implemented

### 1. Interactive Map in Destination Form
- **Location Search**: Autocomplete search box for finding locations
- **Click to Place Marker**: Click anywhere on the map to set destination coordinates
- **Draggable Marker**: Drag the marker to fine-tune the exact location
- **Reverse Geocoding**: Automatically fills the address when clicking on the map
- **Coordinate Display**: Shows latitude and longitude values

### 2. Interactive Map in Destinations List
- **All Destinations View**: Displays all destinations with custom markers
- **Category Filtering**: Filter destinations by category (Parks, Museums, Mountains, etc.)
- **Custom Markers**: Different emoji icons for each category
- **Info Windows**: Click markers to see destination details
- **Route Planning**: Direct link to Google Maps directions
- **Auto-fit Bounds**: Automatically zooms to show all visible markers

### 3. GIS Features
- **Precise Coordinates**: Stores latitude/longitude with 8 decimal precision
- **Thematic Layers**: Filter by destination categories
- **Route Planning**: Integration with Google Maps for directions
- **Geo-fencing Ready**: Database structure supports future geo-fencing features

## Setup Instructions

### Step 1: Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create credentials (API Key)
5. Restrict your API key (recommended):
   - Application restrictions: HTTP referrers
   - API restrictions: Select the APIs listed above

### Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Add your Google Maps API key to `.env`:
   ```
   GOOGLE_MAPS_API_KEY=your-actual-api-key-here
   ```

### Step 3: Database Migration

The latitude and longitude columns are automatically added to the destinations table when the application starts. No manual migration needed.

## Usage Guide

### Adding a New Destination with Map

1. Navigate to **Admin Dashboard** → **Destinations** → **Add Destination**
2. Fill in the basic information (name, description, category)
3. Use the location field to search for a place, OR
4. Click directly on the map to set the location
5. Fine-tune by dragging the marker
6. The coordinates are automatically saved with the form

### Viewing Destinations on Map

1. Navigate to **Admin Dashboard** → **Destinations**
2. The interactive map shows all destinations with coordinates
3. Use category filters to view specific types of destinations
4. Click on markers to see destination details
5. Click "Directions" to open Google Maps for route planning

### Map Controls

- **Zoom**: Use mouse wheel or +/- buttons
- **Pan**: Click and drag the map
- **Street View**: Drag the yellow person icon
- **Map Type**: Switch between Map, Satellite, and Terrain views

## API Endpoints

The following endpoints support the map integration:

- `GET /admin/destinations` - List all destinations with coordinates
- `GET /admin/destinations/add` - Form to add destination with map picker
- `GET /admin/destinations/edit/:id` - Edit destination with map picker
- `POST /admin/destinations/save` - Save destination with lat/lng

## Database Schema

```sql
ALTER TABLE destinations ADD COLUMN latitude DECIMAL(10,8);
ALTER TABLE destinations ADD COLUMN longitude DECIMAL(11,8);
```

## Future Enhancements

### Planned Features
1. **Geo-fencing**: Push notifications when users enter destination areas
2. **Thematic Layers**: 
   - Food spots overlay
   - Accommodation overlay
   - Transportation overlay
3. **Route Optimization**: Multi-destination route planning
4. **Heatmaps**: Popular destination visualization
5. **User Location**: Show visitor's current location
6. **Distance Calculator**: Calculate distance from user to destinations

### Advanced Features
- Clustering for many markers
- Custom map styles
- Drawing tools for area boundaries
- Export destinations to KML/GeoJSON
- Integration with local guides

## Troubleshooting

### Map Not Loading
- Check if GOOGLE_MAPS_API_KEY is set in .env
- Verify API key is valid in Google Cloud Console
- Check browser console for API errors
- Ensure Maps JavaScript API is enabled

### Markers Not Appearing
- Verify destinations have latitude/longitude values
- Check browser console for JavaScript errors
- Ensure coordinates are valid numbers

### Search Not Working
- Verify Places API is enabled
- Check API key restrictions
- Ensure internet connection is stable

## Cost Considerations

Google Maps Platform offers:
- $200 free credit per month
- Pay-as-you-go pricing after free tier
- Maps JavaScript API: $7 per 1,000 loads
- Places API: $17 per 1,000 requests

For a small to medium tourism site, the free tier should be sufficient.

## Security Best Practices

1. **Restrict API Key**: Always restrict by HTTP referrer and API
2. **Environment Variables**: Never commit .env file to version control
3. **Rate Limiting**: Implement server-side rate limiting
4. **Monitoring**: Set up billing alerts in Google Cloud Console

## Support

For issues or questions:
- Check Google Maps Platform [documentation](https://developers.google.com/maps/documentation)
- Review HeritageLink project documentation
- Contact the development team

---

**Last Updated**: November 2025
**Version**: 1.0.0
