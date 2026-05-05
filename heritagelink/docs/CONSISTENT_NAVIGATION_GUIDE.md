# Consistent Navigation System Guide

This guide explains how to implement the unified navigation system across all HeritageLink pages to ensure consistency and better user experience.

## Overview

The navigation system consists of three main components:

1. **Public Navigation Bar** (`partials/navbar.xian`) - For public pages
2. **Dashboard Sidebar** (`partials/dashboard-sidebar.xian`) - For authenticated dashboard pages
3. **Dashboard Topbar** (`partials/dashboard-topbar.xian`) - For dashboard page headers

## Components

### 1. Public Navigation Bar (`partials/navbar.xian`)

Use this for all public-facing pages (home, destinations, events, etc.).

**Features:**
- Responsive design with mobile menu
- Role-based navigation items
- User dropdown menu when authenticated
- Consistent branding and styling

**Usage:**
```html
<%- include('partials/navbar.xian') %>
```

**Automatic Features:**
- Shows different navigation based on user authentication status
- Displays role-specific dashboard links
- Handles mobile responsiveness automatically

### 2. Dashboard Sidebar (`partials/dashboard-sidebar.xian`)

Use this for all dashboard pages (admin, artisan, user dashboards).

**Features:**
- Role-based navigation menus
- Active page highlighting
- Mobile-responsive with overlay
- Consistent branding across roles

**Usage:**
```html
<%- include('partials/dashboard-sidebar.xian', { 
    currentPage: 'admin-dashboard' // or 'artisan-products', 'user-reviews', etc.
}) %>
```

**Parameters:**
- `currentPage` (optional): Highlights the active navigation item

**Role-specific Navigation:**
- **Admin**: Dashboard, Destinations, Events, Heritage Gallery, Map Places, Users, Moderation, Feedback, Analytics, Settings
- **Artisan**: Dashboard, Products, Orders, Messages, Portfolio, Workshops, Profile
- **User**: Dashboard, Destinations, Events, Artisans, Workshops, Reviews, Favorites, My Workshops, Gallery, Messages, Profile

### 3. Dashboard Topbar (`partials/dashboard-topbar.xian`)

Use this for dashboard page headers with search, notifications, and user menu.

**Features:**
- Page title and subtitle
- Search functionality
- Notifications bell
- User dropdown menu
- Mobile responsive

**Usage:**
```html
<%- include('partials/dashboard-topbar.xian', { 
    pageTitle: 'Dashboard',
    pageSubtitle: 'Welcome back! Here\'s your overview.',
    searchPlaceholder: 'Search destinations...',
    showSearch: true
}) %>
```

**Parameters:**
- `pageTitle` (required): Main page heading
- `pageSubtitle` (optional): Subtitle text
- `searchPlaceholder` (optional): Search input placeholder
- `showSearch` (optional): Show/hide search box (default: true)

## Implementation Examples

### Public Page (e.g., Home, Destinations)

```html
<%- include('partials/head.xian', { 
    title: 'Destinations - HeritageLink',
    description: 'Explore cultural sites in Gloria, Oriental Mindoro'
}) %>

<body>
    <!-- Public Navigation -->
    <%- include('partials/navbar.xian') %>
    
    <!-- Page Content -->
    <main>
        <h1>Destinations</h1>
        <!-- Your page content here -->
    </main>
    
    <!-- Footer if needed -->
</body>
</html>
```

### Dashboard Page

```html
<%- include('partials/head.xian', { 
    title: 'Admin Dashboard - HeritageLink'
}) %>

<body>
    <!-- Dashboard Sidebar -->
    <%- include('partials/dashboard-sidebar.xian', { 
        currentPage: 'admin-dashboard'
    }) %>

    <!-- Main Content Area -->
    <main class="dashboard-main">
        <!-- Dashboard Topbar -->
        <%- include('partials/dashboard-topbar.xian', { 
            pageTitle: 'Admin Dashboard',
            pageSubtitle: 'Manage your platform and monitor activity',
            searchPlaceholder: 'Search users, content...'
        }) %>

        <!-- Dashboard Content -->
        <div class="dashboard-content">
            <!-- Your dashboard content here -->
        </div>
    </main>
</body>
</html>
```

## CSS Classes and Styling

### Required CSS Classes

When using the dashboard components, ensure your main content uses these classes:

```css
.dashboard-main {
    margin-left: 260px; /* Sidebar width */
    min-height: 100vh;
    transition: all 0.2s ease;
}

.dashboard-content {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
}

/* Mobile responsive */
@media (max-width: 768px) {
    .dashboard-main {
        margin-left: 0;
    }
    
    .dashboard-content {
        padding: 1rem;
    }
}
```

### Color Variables

The components use CSS custom properties for consistent theming:

```css
:root {
    --primary: #1a5f3f;
    --primary-light: #2d8659;
    --accent: #ff6b35;
    --white: #ffffff;
    --gray-50: #f8faf9;
    --gray-100: #f1f5f4;
    --gray-600: #6b7280;
    --gray-900: #111827;
}
```

## Mobile Responsiveness

All components are fully responsive and include:

- Mobile menu toggles
- Touch-friendly navigation
- Responsive layouts
- Proper viewport handling

## JavaScript Functionality

The components include built-in JavaScript for:

- Mobile menu toggles
- User dropdown menus
- Search functionality
- Keyboard shortcuts (Ctrl+K for search)
- Click outside to close dropdowns

## Migration Guide

### From Existing Templates

1. **Replace existing navigation** with the appropriate partial include
2. **Update CSS classes** to use the new dashboard layout classes
3. **Add required parameters** for page identification and customization
4. **Test mobile responsiveness** to ensure proper functionality

### Example Migration

**Before:**
```html
<nav class="old-navbar">
    <!-- Old navigation code -->
</nav>
```

**After:**
```html
<%- include('partials/navbar.xian') %>
```

## Best Practices

1. **Always use the appropriate component** for the page type (public vs dashboard)
2. **Set the currentPage parameter** for dashboard pages to highlight active navigation
3. **Provide meaningful page titles and subtitles** for better user experience
4. **Test on mobile devices** to ensure responsive behavior works correctly
5. **Use consistent CSS classes** for layout and styling
6. **Include proper meta tags** in the head partial for SEO

## Troubleshooting

### Common Issues

1. **Sidebar not showing**: Ensure you're using `dashboard-sidebar.xian` for dashboard pages
2. **Mobile menu not working**: Check that JavaScript is loaded and no conflicts exist
3. **Active page not highlighted**: Verify the `currentPage` parameter matches the expected value
4. **Layout issues**: Ensure you're using the correct CSS classes (`dashboard-main`, `dashboard-content`)

### Debug Steps

1. Check browser console for JavaScript errors
2. Verify all partial files exist in the correct location
3. Ensure CSS variables are defined
4. Test with different screen sizes
5. Validate HTML structure

## Future Enhancements

- Add breadcrumb navigation for deep pages
- Implement search autocomplete functionality
- Add keyboard navigation support
- Include accessibility improvements (ARIA labels, focus management)
- Add theme switching capability

## Support

For questions or issues with the navigation system, refer to:
- This documentation
- Component source files in `views/partials/`
- Example implementation in `views/example-consistent-dashboard.xian`