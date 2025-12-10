const fs = require('fs');
const path = require('path');

// Blob URLs from upload
const blobUrls = {
    "Alovenol.jpg": "https://adrwoenh3jz4orsx.public.blob.vercel-storage.com/Alovenol.jpg",
    "Arthojo.jpg": "https://adrwoenh3jz4orsx.public.blob.vercel-storage.com/Arthojo.jpg",
    "Be-Potassium.jpg": "https://adrwoenh3jz4orsx.public.blob.vercel-storage.com/Be-Potassium.jpg",
    "Emax cream.jpg": "https://adrwoenh3jz4orsx.public.blob.vercel-storage.com/Emax%20cream.jpg",
    "Emax gel.jpg": "https://adrwoenh3jz4orsx.public.blob.vercel-storage.com/Emax%20gel.jpg",
    "Emax Spray.jpg": "https://adrwoenh3jz4orsx.public.blob.vercel-storage.com/Emax%20Spray.jpg",
    "FerroFlav.jpg": "https://adrwoenh3jz4orsx.public.blob.vercel-storage.com/FerroFlav.jpg",
    "Flamogest.jpg": "https://adrwoenh3jz4orsx.public.blob.vercel-storage.com/Flamogest.jpg",
    "Flexolyte.jpg": "https://adrwoenh3jz4orsx.public.blob.vercel-storage.com/Flexolyte.jpg",
    "k Val.jpg": "https://adrwoenh3jz4orsx.public.blob.vercel-storage.com/k%20Val.jpg",
    "Kedonosh.jpg": "https://adrwoenh3jz4orsx.public.blob.vercel-storage.com/Kedonosh.jpg",
    "Palmetol.jpg": "https://adrwoenh3jz4orsx.public.blob.vercel-storage.com/Palmetol.jpg",
    "Reboton Gel.jpg": "https://adrwoenh3jz4orsx.public.blob.vercel-storage.com/Reboton%20Gel.jpg",
    "Vita-DE-Val.jpg": "https://adrwoenh3jz4orsx.public.blob.vercel-storage.com/Vita-DE-Val.jpg"
};

// Product name to image mapping
const productImageMap = {
    "FerroFlav": "FerroFlav.jpg",
    "Flexolyte": "Flexolyte.jpg",
    "Arthojo": "Arthojo.jpg",
    "Palmetol": "Palmetol.jpg",
    "Kedonosh": "Kedonosh.jpg",
    "Flamogest": "Flamogest.jpg",
    "Alovenol": "Alovenol.jpg",
    "Be-Potassium": "Be-Potassium.jpg",
    "Vita-DE-Val": "Vita-DE-Val.jpg",
    "k Val": "k Val.jpg",
    "Emax gel": "Emax gel.jpg",
    "Emax cream": "Emax cream.jpg",
    "Emax Spray": "Emax Spray.jpg",
    "Reboton Gel": "Reboton Gel.jpg"
};

// Read seed file
const seedFilePath = path.join(__dirname, 'seed_products.js');
let content = fs.readFileSync(seedFilePath, 'utf8');

// Replace old URLs with Blob URLs
Object.entries(productImageMap).forEach(([productName, imageName]) => {
    const blobUrl = blobUrls[imageName];
    if (blobUrl) {
        // Replace any old image_url for this product
        const regex = new RegExp(`(title: "${productName}"[\\s\\S]*?image_url: )"[^"]*"`, 'g');
        content = content.replace(regex, `$1"${blobUrl}"`);

        const regexEn = new RegExp(`(title_en: "${productName}"[\\s\\S]*?image_url: )"[^"]*"`, 'g');
        content = content.replace(regexEn, `$1"${blobUrl}"`);
    }
});

// Write updated content
fs.writeFileSync(seedFilePath, content, 'utf8');

console.log('✅ Updated seed_products.js with Blob URLs!');
console.log('📦 Updated', Object.keys(productImageMap).length, 'products');
