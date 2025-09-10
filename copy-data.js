import fs from 'fs';
import path from 'path';

// Ensure public/data directory exists
const publicDataDir = path.join('public', 'data');
if (!fs.existsSync(publicDataDir)) {
  fs.mkdirSync(publicDataDir, { recursive: true });
}

// Copy all JSON files from src/data to public/data
const srcDataDir = path.join('src', 'data');
const files = fs.readdirSync(srcDataDir).filter(file => file.endsWith('.json'));

console.log('Copying data files to public directory...');
files.forEach(file => {
  const srcPath = path.join(srcDataDir, file);
  const destPath = path.join(publicDataDir, file);
  fs.copyFileSync(srcPath, destPath);
  console.log(`Copied: ${file}`);
});

console.log(`Successfully copied ${files.length} data files.`);
