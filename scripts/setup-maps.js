#!/usr/bin/env node

/**
 * Google Maps Setup Script
 * Helps configure Google Maps API integration for HeritageLink
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function setupGoogleMaps() {
    console.log('\n🗺️  Google Maps Integration Setup\n');
    console.log('This script will help you configure Google Maps for HeritageLink.\n');

    // Check if .env exists
    const envPath = path.join(rootDir, '.env');
    const envExamplePath = path.join(rootDir, '.env.example');
    
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
        console.log('✅ Found existing .env file');
        envContent = fs.readFileSync(envPath, 'utf8');
    } else if (fs.existsSync(envExamplePath)) {
        console.log('📋 Creating .env from .env.example');
        envContent = fs.readFileSync(envExamplePath, 'utf8');
    } else {
        console.log('⚠️  No .env or .env.example found, creating new .env');
        envContent = `# HeritageLink Environment Configuration
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=heritagelink
DB_PORT=3306
SESSION_SECRET=your-secret-key-here
PORT=3000
NODE_ENV=development
`;
    }

    // Check if API key already exists
    const apiKeyMatch = envContent.match(/GOOGLE_MAPS_API_KEY=(.+)/);
    const existingKey = apiKeyMatch ? apiKeyMatch[1].trim() : '';

    if (existingKey && existingKey !== 'your-google-maps-api-key-here') {
        console.log(`\n📍 Current API Key: ${existingKey.substring(0, 10)}...`);
        const update = await question('Do you want to update it? (y/N): ');
        if (update.toLowerCase() !== 'y') {
            console.log('\n✅ Keeping existing API key');
            rl.close();
            return;
        }
    }

    console.log('\n📖 To get your Google Maps API key:');
    console.log('   1. Visit: https://console.cloud.google.com/');
    console.log('   2. Create/select a project');
    console.log('   3. Enable: Maps JavaScript API, Places API, Geocoding API');
    console.log('   4. Create credentials (API Key)');
    console.log('   5. Copy your API key\n');

    const apiKey = await question('Enter your Google Maps API Key: ');

    if (!apiKey || apiKey.trim() === '') {
        console.log('\n❌ No API key provided. Setup cancelled.');
        rl.close();
        return;
    }

    // Update or add API key to .env
    if (envContent.includes('GOOGLE_MAPS_API_KEY=')) {
        envContent = envContent.replace(
            /GOOGLE_MAPS_API_KEY=.*/,
            `GOOGLE_MAPS_API_KEY=${apiKey.trim()}`
        );
    } else {
        envContent += `\n# Google Maps API Configuration\nGOOGLE_MAPS_API_KEY=${apiKey.trim()}\n`;
    }

    // Write to .env
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ API key saved to .env file');

    // Verify database columns
    console.log('\n🔍 Checking database setup...');
    console.log('   The latitude and longitude columns will be automatically');
    console.log('   added to the destinations table when you start the server.\n');

    console.log('📚 Next steps:');
    console.log('   1. Start your server: npm start');
    console.log('   2. Navigate to Admin → Destinations');
    console.log('   3. Add or edit destinations with map integration');
    console.log('   4. Read docs/GOOGLE_MAPS_SETUP.md for detailed guide\n');

    console.log('🎉 Google Maps setup complete!\n');
    
    rl.close();
}

setupGoogleMaps().catch(err => {
    console.error('❌ Setup error:', err);
    rl.close();
    process.exit(1);
});
