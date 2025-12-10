require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

// Blob URLs from upload
const blobUrls = {
    "1765192851063-963132956.jpg": "https://adrwoenh3jz4orsx.public.blob.vercel-storage.com/events/1765192851063-963132956.jpg",
    "1765193788772-421616940.jpg": "https://adrwoenh3jz4orsx.public.blob.vercel-storage.com/events/1765193788772-421616940.jpg",
    "1765193788775-842336667.png": "https://adrwoenh3jz4orsx.public.blob.vercel-storage.com/events/1765193788775-842336667.png"
};

async function updateEventImages() {
    try {
        await client.connect();
        console.log('✅ Connected to database\n');

        // Get all events
        const result = await client.query('SELECT id, title, cover_image, gallery_images FROM events');
        console.log(`📦 Found ${result.rows.length} events\n`);

        for (const event of result.rows) {
            let updated = false;
            let newCoverImage = event.cover_image;
            let newGalleryImages = event.gallery_images;

            // Update cover_image if it contains localhost
            if (event.cover_image && event.cover_image.includes('localhost')) {
                // Extract filename from localhost URL
                const filename = event.cover_image.split('/').pop();
                if (blobUrls[filename]) {
                    newCoverImage = blobUrls[filename];
                    updated = true;
                    console.log(`🔄 Updating cover image for: ${event.title}`);
                }
            }

            // Update gallery_images if they contain localhost
            if (event.gallery_images && event.gallery_images.length > 0) {
                newGalleryImages = event.gallery_images.map(url => {
                    if (url.includes('localhost')) {
                        const filename = url.split('/').pop();
                        if (blobUrls[filename]) {
                            console.log(`🔄 Updating gallery image: ${filename}`);
                            return blobUrls[filename];
                        }
                    }
                    return url;
                });
                if (JSON.stringify(newGalleryImages) !== JSON.stringify(event.gallery_images)) {
                    updated = true;
                }
            }

            // Update the event if needed
            if (updated) {
                await client.query(
                    'UPDATE events SET cover_image = $1, gallery_images = $2 WHERE id = $3',
                    [newCoverImage, newGalleryImages, event.id]
                );
                console.log(`✅ Updated event: ${event.title}\n`);
            }
        }

        console.log('\n✅ All events updated successfully!');
        await client.end();
    } catch (error) {
        console.error('❌ Error:', error);
        await client.end();
        process.exit(1);
    }
}

updateEventImages();
