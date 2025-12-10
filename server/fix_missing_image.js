require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

const newImageUrl = "https://adrwoenh3jz4orsx.public.blob.vercel-storage.com/events/1765193788770-652241212.jfif";

async function addMissingImage() {
    try {
        await client.connect();
        console.log('✅ Connected to database\n');

        // Get the event
        const result = await client.query('SELECT id, title, gallery_images FROM events WHERE id = 1');

        if (result.rows.length === 0) {
            console.log('❌ Event not found');
            return;
        }

        const event = result.rows[0];
        console.log(`📦 Event: ${event.title}`);
        console.log(`Current gallery images: ${event.gallery_images?.length || 0}\n`);

        // Add the new image to gallery
        let updatedGallery = event.gallery_images || [];

        // Replace localhost URL with Blob URL for the missing image
        updatedGallery = updatedGallery.map(url => {
            if (url.includes('1765193788770-652241212.jfif')) {
                console.log(`🔄 Replacing: ${url}`);
                console.log(`   With: ${newImageUrl}\n`);
                return newImageUrl;
            }
            return url;
        });

        // Update the event
        await client.query(
            'UPDATE events SET gallery_images = $1 WHERE id = $2',
            [updatedGallery, event.id]
        );

        console.log('✅ Event updated successfully!');
        console.log(`New gallery images count: ${updatedGallery.length}`);

        await client.end();
    } catch (error) {
        console.error('❌ Error:', error);
        await client.end();
        process.exit(1);
    }
}

addMissingImage();
