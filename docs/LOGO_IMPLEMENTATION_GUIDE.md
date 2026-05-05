# Logo Implementation Guide

## Logo Location
**File Path**: `public/uploads/logo.jpg`  
**URL Path**: `/uploads/logo.jpg`

## Implementation Summary

### ✅ Complete - All Pages Updated (20+ pages)

## Page Categories

### 1. Admin Dashboard (7 pages)
All admin pages now display the logo in the sidebar header:
- Admin Dashboard
- Analytics
- Destinations Management
- Events Management
- Users Management
- Settings
- Content Moderation

**Logo Specs**:
- Size: 40px × 40px
- Position: Sidebar header, left of "HeritageLink" text
- Badge: "Admin" (yellow gradient)

### 2. Artisan Dashboard (8 pages)
All artisan pages now display the logo in the sidebar header:
- Artisan Dashboard
- My Products
- Product Form (Add/Edit)
- Orders
- Messages
- Workshops
- Portfolio
- Profile

**Logo Specs**:
- Size: 40px × 40px
- Position: Sidebar header, left of "HeritageLink" text
- Badge: "Artisan" (yellow gradient)

### 3. User Dashboard (1 page)
User dashboard displays the logo in the sidebar header:
- User Dashboard

**Logo Specs**:
- Size: 40px × 40px
- Position: Sidebar header, left of "HeritageLink" text
- Badge: "Explorer" (yellow gradient)

### 4. Public Pages (4 pages)
All public pages display the logo in navbar and footer:
- Home Page
- Login Page
- Register Page
- Error Page

**Navbar Logo Specs**:
- Size: 40px × 40px
- Position: Top left in navigation bar
- Alignment: Vertically centered with text

**Footer Logo Specs**:
- Size: 30px × 30px
- Position: Footer header
- Alignment: Vertically centered with text

## Technical Implementation

### HTML Structure (Sidebar)
```html
<div class="sidebar-logo">
    <h2>
        <img src="/uploads/logo.jpg" alt="HeritageLink" 
             style="width: 40px; height: 40px; object-fit: contain;">
        HeritageLink
        <span class="badge">Admin/Artisan/Explorer</span>
    </h2>
</div>
```

### HTML Structure (Navbar)
```html
<a href="/" class="logo">
    <img src="/uploads/logo.jpg" alt="HeritageLink" 
         style="width: 40px; height: 40px; object-fit: contain; vertical-align: middle;">
    HeritageLink
</a>
```

### HTML Structure (Footer)
```html
<h3>
    <img src="/uploads/logo.jpg" alt="HeritageLink" 
         style="width: 30px; height: 30px; object-fit: contain; vertical-align: middle;">
    HeritageLink
</h3>
```

## CSS Styling

### Key Properties
- `object-fit: contain` - Maintains aspect ratio
- `vertical-align: middle` - Aligns with text (navbar/footer)
- Fixed dimensions prevent layout shifts
- Inline styles ensure consistency across all pages

## Design Consistency

### Color Scheme
- Primary: Mint Green (#10b981)
- Accent: Light Yellow (#fbbf24)
- Sidebar: Dark Green (#064e3b)

### Typography
- Font: Inter (Google Fonts)
- Logo text: 1.5rem, weight 700
- Badges: 0.75rem, weight 600

## Browser Compatibility
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## Performance
- Logo file size: Optimized JPEG
- Cached by browser after first load
- No impact on page load times

## Maintenance

### Updating the Logo
1. Replace `public/uploads/logo.jpg` with new logo file
2. Keep the same filename to avoid updating all pages
3. Clear browser cache to see changes
4. Recommended dimensions: Square (1:1 aspect ratio)
5. Recommended format: JPG or PNG
6. Recommended size: 200px × 200px minimum

### Adding Logo to New Pages
Use one of the HTML structures above depending on page type:
- Dashboard pages: Use sidebar structure
- Public pages: Use navbar + footer structure

## Testing Checklist
- [x] Logo displays on all admin pages
- [x] Logo displays on all artisan pages
- [x] Logo displays on user dashboard
- [x] Logo displays on public pages (navbar)
- [x] Logo displays on public pages (footer)
- [x] Logo maintains aspect ratio
- [x] Logo aligns properly with text
- [x] Logo loads without errors
- [x] Logo is accessible (alt text present)

## Accessibility
- All logo images include `alt="HeritageLink"` attribute
- Logo is part of clickable navigation elements
- Proper semantic HTML structure maintained

## Future Enhancements
- [ ] Add logo favicon
- [ ] Create logo variants (light/dark mode)
- [ ] Add logo animation on hover
- [ ] Implement lazy loading for performance
- [ ] Add WebP format with fallback
