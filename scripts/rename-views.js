// Script to rename .ejs files to .xian
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const viewsDir = path.join(__dirname, '..', 'views');

function renameFiles(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            renameFiles(fullPath);
        } else if (file.endsWith('.ejs')) {
            const newPath = fullPath.replace('.ejs', '.xian');
            fs.renameSync(fullPath, newPath);
            console.log(`✅ Renamed: ${file} -> ${file.replace('.ejs', '.xian')}`);
        }
    });
}

console.log('🔄 Renaming .ejs files to .xian...\n');
renameFiles(viewsDir);
console.log('\n🎉 Done! All .ejs files renamed to .xian');
