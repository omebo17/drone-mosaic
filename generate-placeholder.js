/**
 * Script to generate a low-quality placeholder image from the original hero image
 * This creates a small, blurred version that loads quickly for better UX
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (error) {
  console.error('Sharp is not installed. Installing it now...');
  console.error('Please run: npm install --save-dev sharp');
  console.error('Then run this script again: node generate-placeholder.js');
  process.exit(1);
}

const inputPath = path.join(__dirname, 'src', 'assets', 'images', 'drones.png');
const outputPath = path.join(__dirname, 'src', 'assets', 'images', 'drones-placeholder.png');

// Check if input file exists
if (!fs.existsSync(inputPath)) {
  console.error(`Error: Input file not found at ${inputPath}`);
  process.exit(1);
}

console.log('Generating low-quality placeholder image...');
console.log(`Input: ${inputPath}`);
console.log(`Output: ${outputPath}`);

sharp(inputPath)
  .resize(100) // Resize to 100px width (maintains aspect ratio)
  .blur(2) // Add slight blur
  .png({ quality: 30, compressionLevel: 9 }) // Low quality PNG for small file size
  .toFile(outputPath)
  .then(() => {
    const stats = fs.statSync(outputPath);
    const originalStats = fs.statSync(inputPath);
    
    console.log('\n✅ Success!');
    console.log(`Original size: ${(originalStats.size / 1024).toFixed(2)} KB`);
    console.log(`Placeholder size: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`Reduction: ${(((originalStats.size - stats.size) / originalStats.size) * 100).toFixed(1)}%`);
    console.log('\nPlaceholder image generated successfully!');
  })
  .catch((err) => {
    console.error('Error generating placeholder:', err);
    process.exit(1);
  });

