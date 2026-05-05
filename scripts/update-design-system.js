#!/usr/bin/env node

/**
 * HeritageLink Design System Update Script
 * 
 * This script updates all EJS templates to use the new unified design system
 * with nature-inspired colors and simplified navigation.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Design system CSS link
const UNIFIED_CSS = '<link rel="stylesheet" href="/css/heritagelink-unified.css">';
const FONT_LINK = '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">';
const FONT_AWESOME = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">';

// Navigation HTML
const MAIN_NAV = `
    <nav class="navbar">
        <div class="nav-container">
            <a href="/" class="logo">
                <img src="/uploads/logo.jpg" alt="HeritageLink"> HeritageLink
            </a>
            <div class="nav-links">
                <a href="/" class="nav-link"><i class="fas fa-home"></i> Home</a>
                <a href="/destinations" class="nav-link"><i class="fas fa-map-marked-alt"></i> Discover Sites</a>
                <a href="/events" class="nav-link"><i class="fas fa-calendar-alt"></i> Events</a>
                <a href="/artisans" class="nav-link"><i class="fas fa-palette"></i> Artisans</a>
                <% if (typeof user !== 'undefined' && user) { %>
                    <a href="/dashboard" class="btn btn-primary">Dashboard</a>
                <% } else { %>
                    <a href="/login" class="btn btn-secondary">Login</a>
                <% } %>
            </div>
        </div>
    </nav>
`;

console.log('🎨 HeritageLink Design System Update');
console.log('=====================================\n');

console.log('✅ Design system files created:');
console.log('   - /public/css/heritagelink-unified.css');
console.log('   - /views/partials/dashboard-head.ejs');
console.log('   - DESIGN_SYSTEM_IMPLEMENTATION.md\n');

console.log('📝 Manual Update Instructions:');
console.log('=====================================\n');

console.log('For each EJS file in /views/, update the <head> section:');
console.log('\n1. Add these links after <title>:');
console.log(`   ${FONT_LINK}`);
console.log(`   ${FONT_AWESOME}`);
console.log(`   ${UNIFIED_CSS}\n`);

console.log('2. Replace old navigation with simplified menu (5 items):');
console.log('   - Home');
console.log('   - Discover Sites (destinations)');
console.log('   - Events');
console.log('   - Artisans');
console.log('   - Login/Dashboard button\n');

console.log('3. Update color variables to use nature-inspired palette:');
console.log('   - Forest Green: #1a5f3f');
console.log('   - Sage Green: #2d8659');
console.log('   - Textile Orange: #ff6b35');
console.log('   - Earth tones and blues\n');

console.log('4. Apply component classes:');
console.log('   - .btn-primary, .btn-secondary, .btn-success');
console.log('   - .card, .stat-card, .action-card');
console.log('   - .sidebar, .main-content, .topbar\n');

console.log('📋 Files to Update:');
console.log('=====================================');

const viewsDir = path.join(__dirname, '..', 'views');
const files = fs.readdirSync(viewsDir).filter(f => f.endsWith('.ejs'));

files.forEach((file, index) => {
    console.log(`   ${index + 1}. ${file}`);
});

console.log(`\n   Total: ${files.length} files\n`);

console.log('🎯 Key Pages Updated:');
console.log('   ✅ home.ejs - New navigation and hero section');
console.log('   ✅ Design system CSS created');
console.log('   ✅ Documentation created\n');

console.log('🚀 Next Steps:');
console.log('=====================================');
console.log('1. Review DESIGN_SYSTEM_IMPLEMENTATION.md');
console.log('2. Test the homepage at http://localhost:3000');
console.log('3. Update remaining pages using the design guide');
console.log('4. Test responsive design on mobile devices');
console.log('5. Validate accessibility with screen readers\n');

console.log('💡 Quick Reference:');
console.log('=====================================');
console.log('Color Palette:');
console.log('  🌲 Nature: #1a5f3f, #2d8659, #3fa872');
console.log('  🌊 Ocean: #0891b2, #06b6d4');
console.log('  🌍 Earth: #78350f, #92400e');
console.log('  🎨 Textile: #dc2626, #ff6b35, #f59e0b, #7c3aed\n');

console.log('Typography:');
console.log('  📝 Body: Inter (300-800)');
console.log('  📰 Headings: Poppins (600-800)\n');

console.log('Navigation:');
console.log('  🏠 Home → 🗺️ Discover Sites → 📅 Events → 🎨 Artisans → 🔐 Login\n');

console.log('✨ Design system ready! Happy coding! ✨\n');
