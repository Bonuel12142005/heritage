// Fix SQL file - replace empty category and JSON values
import fs from 'fs';

console.log('🔧 Fixing SQL file...\n');

try {
    // Read the SQL file
    let sql = fs.readFileSync('heritagelink-export.sql', 'utf8');
    
    console.log('📝 Original file size:', sql.length, 'bytes');
    
    // Fix 1: map_places empty category values
    sql = sql.replace(/(INSERT INTO `map_places`[^;]*), '', NULL,/g, "$1, 'attraction', NULL,");
    
    // Fix 2: map_places empty amenities (JSON column) - replace '' with NULL
    sql = sql.replace(/(INSERT INTO `map_places`[^;]*), '', 'deleted'/g, "$1, NULL, 'deleted'");
    sql = sql.replace(/(INSERT INTO `map_places`[^;]*), '', 'active'/g, "$1, NULL, 'active'");
    sql = sql.replace(/(INSERT INTO `map_places`[^;]*), '', 'inactive'/g, "$1, NULL, 'inactive'");
    
    // Fix 3: tourist_routes invalid waypoints (JSON column) - replace [object Object] with NULL
    sql = sql.replace(/(INSERT INTO `tourist_routes`[^;]*), '\[object Object\][^']*'/g, "$1, NULL");
    
    console.log('📝 Fixed file size:', sql.length, 'bytes');
    
    // Save the fixed file
    fs.writeFileSync('heritagelink-export-fixed.sql', sql);
    
    console.log('✅ Fixed SQL file saved as: heritagelink-export-fixed.sql');
    console.log('\n📝 Changes made:');
    console.log('   - Replaced empty category values with "attraction"');
    console.log('   - Replaced empty amenities (JSON) with NULL');
    console.log('   - Replaced invalid waypoints ([object Object]) with NULL');
    console.log('\n🚀 Now run: node import-to-aiven.js\n');
    
} catch (error) {
    console.error('❌ Fix failed:', error.message);
}
