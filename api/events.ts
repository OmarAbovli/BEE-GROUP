import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from './_db.js';
import { events } from './schema.js';
import { eq, desc } from 'drizzle-orm';

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

    try {
        if (req.method === 'GET') {
            const allEvents = await db.select().from(events).orderBy(desc(events.date));
            return res.status(200).json(allEvents);
        } else if (req.method === 'POST') {
            const { title, title_en, description, description_en, date, cover_image, gallery_images, type } = req.body;
            const [newEvent] = await db.insert(events).values({
                title,
                title_en,
                description,
                description_en,
                date: date ? new Date(date) : new Date(),
                cover_image,
                gallery_images,
                type
            }).returning();
            return res.status(201).json(newEvent);
        } else if (req.method === 'DELETE') {
            const id = parseInt(req.query.id as string);
            await db.delete(events).where(eq(events.id, id));
            return res.status(200).json({ success: true });
        } else {
            return res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Events API error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
