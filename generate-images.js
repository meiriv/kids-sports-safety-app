#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Checking if sharp is installed...');
try {
  require.resolve('sharp');
  console.log('sharp is already installed.');
} catch (e) {
  console.log('Installing sharp package...');
  execSync('npm install sharp --save-dev');
}

const sharp = require('sharp');

// Create the assets directory if it doesn't exist
const publicDir = path.resolve(__dirname, 'public');
const assetsDir = path.resolve(__dirname, 'src/assets');

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Convert SVG to PNG
async function convertSvgToPng(svgPath, pngPath, size) {
  const svgContent = fs.readFileSync(svgPath);
  await sharp(svgContent)
    .resize(size, size)
    .png()
    .toFile(pngPath);
  
  console.log(`Created ${pngPath}`);
}

// Convert favicon
async function generateFavicon() {
  const logoSvgPath = path.resolve(__dirname, 'public/logo.svg');
  const faviconPath = path.resolve(publicDir, 'favicon.ico');
  
  try {
    console.log('Generating favicon...');
    await sharp(fs.readFileSync(logoSvgPath))
      .resize(32, 32)
      .toFile(faviconPath);
    console.log('Favicon created successfully.');
  } catch (error) {
    console.error('Error creating favicon:', error);
  }
}

// Main function
async function main() {
  try {
    // Convert SVGs to PNGs
    await convertSvgToPng(
      path.resolve(assetsDir, 'logo192.svg'),
      path.resolve(publicDir, 'logo192.png'),
      192
    );
    
    await convertSvgToPng(
      path.resolve(assetsDir, 'logo512.svg'),
      path.resolve(publicDir, 'logo512.png'),
      512
    );
    
    await generateFavicon();
    
    console.log('All images have been generated successfully!');
  } catch (error) {
    console.error('Error generating images:', error);
    process.exit(1);
  }
}

main();
