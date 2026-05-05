// Script to fix EJS include paths to use .xian extension
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const viewsDir = path.join(__dirname, '..', 'views');

function fixIncludes(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            fixIncludes(fullPath);
        } else if (file.endsWith('.xian')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // Replace include('partials/xxx') with include('partials/xxx.xian')
            const updated = content.replace(
                /include\(['"]partials\/([^'"]+)['"]\)/g,
                (match, partial) => {
                    // Don't add .xian if it already has it
                    if (partial.endsWith('.xian')) return match;
                    return `include('partials/${partial}.xian')`;
                }
            );
            
            if (updated !== content) {
                fs.writeFileSync(fullPath, updated);
                console.log(`✅ Fixed includes in: ${file}`);
            }
        }
    });
}

console.log('🔄 Fixing include paths to use .xian extension...\n');
fixIncludes(viewsDir);
console.log('\n🎉 Done!');
