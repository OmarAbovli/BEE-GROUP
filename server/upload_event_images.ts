import { put } from '@vercel/blob';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../.env' });

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

if (!BLOB_TOKEN) {
    console.error('❌ BLOB_READ_WRITE_TOKEN not found in .env file');
    process.exit(1);
}

async function uploadImageToBlob(imagePath: string, filename: string): Promise<string> {
    try {
        const imageBuffer = readFileSync(imagePath);

        const blob = await put(`events/${filename}`, imageBuffer, {
            access: 'public',
            token: BLOB_TOKEN,
        });

        console.log(`✅ Uploaded: ${filename} -> ${blob.url}`);
        return blob.url;
    } catch (error) {
        console.error(`❌ Failed to upload ${filename}:`, error);
        throw error;
    }
}

async function uploadEventImages() {
    const uploadsDir = join(__dirname, '../server/uploads');

    try {
        const files = readdirSync(uploadsDir);
        const imageFiles = files.filter(file =>
            file.match(/\.(jpg|jpeg|png|gif|webp)$/i)
        );

        console.log(`📦 Found ${imageFiles.length} event images to upload\n`);

        const uploadedUrls: Record<string, string> = {};

        for (const file of imageFiles) {
            const imagePath = join(uploadsDir, file);
            const url = await uploadImageToBlob(imagePath, file);
            uploadedUrls[file] = url;
        }

        console.log('\n✅ All event images uploaded successfully!');
        console.log('\n📋 Image URLs:');
        console.log(JSON.stringify(uploadedUrls, null, 2));

        return uploadedUrls;
    } catch (error) {
        console.error('❌ Error uploading images:', error);
        process.exit(1);
    }
}

// Run the upload
uploadEventImages();
