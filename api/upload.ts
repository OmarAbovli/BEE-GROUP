import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Get file from request body (base64 or buffer)
        const { file, filename } = req.body;

        if (!file || !filename) {
            return res.status(400).json({ message: 'File and filename are required' });
        }

        // Convert base64 to buffer if needed
        const buffer = Buffer.from(file.split(',')[1] || file, 'base64');

        // Upload to Vercel Blob
        const blob = await put(filename, buffer, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        return res.status(200).json({ url: blob.url });
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};
