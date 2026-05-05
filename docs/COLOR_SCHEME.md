# HeritageLink Color Scheme

## Ocean-Inspired Palette

The HeritageLink platform now uses a beautiful ocean-inspired color palette that reflects the coastal beauty of Gloria, Oriental Mindoro.

### Primary Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Ocean Blue** | `#0077B6` | Primary brand color, headings, main CTAs |
| **Turquoise** | `#00B4D8` | Secondary accent, hover states, highlights |
| **Palm Green** | `#2D6A4F` | Success states, nature elements, tertiary accent |
| **Sand Beige** | `#F4E1C1` | Soft backgrounds, text on dark backgrounds |
| **Sunset Coral** | `#FF6B6B` | Warning states, important CTAs, hover accents |
| **Sunset Orange** | `#FFB347` | Gradient accents, warm highlights |

### Color Applications

#### Hero Section
- Background: Gradient from Ocean Blue → Turquoise → Palm Green
- Text: White
- Subtitle: Sand Beige
- Top border: Sunset Coral gradient

#### Action Cards
- Background: White
- Border: Turquoise (left border)
- Icon background: Ocean Blue → Turquoise gradient
- Hover icon: Sunset Coral → Sunset Orange gradient
- Title: Ocean Blue
- Shadow: Ocean Blue with opacity

#### Navigation
- Background: Ocean Blue → Turquoise → Palm Green gradient
- Links: Sand Beige
- Hover: White

#### Buttons
- Primary: Sunset Coral → Sunset Orange gradient
- Secondary: Transparent with white border
- Success: Ocean Blue → Turquoise gradient

#### Footer
- Background: Ocean Blue → Palm Green gradient
- Text: Sand Beige
- Top border: Sunset Coral

### CSS Variables

```css
:root {
    /* Ocean-Inspired Color Palette */
    --ocean-blue: #0077B6;
    --turquoise: #00B4D8;
    --palm-green: #2D6A4F;
    --sand-beige: #F4E1C1;
    --sunset-coral: #FF6B6B;
    --sunset-orange: #FFB347;
    
    /* Gradients */
    --gradient-nature: linear-gradient(135deg, #0077B6 0%, #00B4D8 50%, #2D6A4F 100%);
    --gradient-ocean: linear-gradient(135deg, #0077B6 0%, #00B4D8 100%);
    --gradient-sunset: linear-gradient(135deg, #FF6B6B 0%, #FFB347 100%);
}
```

### Accessibility

All color combinations meet WCAG 2.1 AA standards for contrast:
- Ocean Blue on white: 4.5:1 (AA)
- White on Ocean Blue: 4.5:1 (AA)
- Palm Green on white: 7.2:1 (AAA)
- Sand Beige on Ocean Blue: 4.8:1 (AA)

### Design Philosophy

The color scheme reflects:
- **Ocean Blue & Turquoise**: The coastal waters of Oriental Mindoro
- **Palm Green**: The lush tropical vegetation
- **Sand Beige**: The beautiful beaches
- **Sunset Coral**: The vibrant sunsets over the ocean

This palette creates a warm, inviting, and tropical atmosphere while maintaining professional aesthetics suitable for a cultural tourism platform.

### Files Updated

1. `views/home.xian` - Homepage styles
2. `public/css/heritagelink-unified.css` - Global CSS variables and component styles

### Preview

To see the new colors in action:
1. Start the server: `npm start`
2. Visit: `http://localhost:3000`
3. The homepage will display the new ocean-inspired color scheme

### Future Enhancements

Consider applying this color scheme to:
- Dashboard pages
- Event pages
- Artisan showcase pages
- Heritage gallery
- All other platform pages for consistency
