const { drizzle } = require('drizzle-orm/node-postgres');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Map of Image Name -> Blob URL (Source: update_seed_urls.js)
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

async function fixImages() {
    try {
        console.log("🚀 Starting database image update...");

        for (const [filename, url] of Object.entries(blobUrls)) {
            // Remove extension to get product name (e.g., "Alovenol" from "Alovenol.jpg")
            const productName = filename.replace(/\.(jpg|jpeg|png)$/i, '');

            console.log(`Processing ${productName}...`);

            // Update exactly where title matches
            const res = await pool.query(
                `UPDATE products SET image_url = $1 WHERE title ILIKE $2`,
                [url, productName]
            );

            if (res.rowCount > 0) {
                console.log(`✅ Updated ${productName}: ${res.rowCount} row(s)`);
            } else {
                console.log(`⚠️ Product not found: ${productName}`);
            }
        }

        console.log("🏁 Database update complete!");

    } catch (err) {
        console.error("❌ DB Error:", err);
    } finally {
        await pool.end();
    }
}

fixImages();
