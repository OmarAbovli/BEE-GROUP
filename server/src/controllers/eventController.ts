import { Request, Response } from "express";
import { db } from "../db";
import { events } from "../db/schema";
import { eq, desc } from "drizzle-orm";

export const getEvents = async (req: Request, res: Response) => {
    try {
        const allEvents = await db.select().from(events).orderBy(desc(events.date));
        res.json(allEvents);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch events" });
    }
};

export const createEvent = async (req: Request, res: Response) => {
    try {
        const { title, description, date, cover_image, gallery_images, type } = req.body;
        const newEvent = await db.insert(events).values({
            title,
            description,
            date: date ? new Date(date) : new Date(),
            cover_image,
            gallery_images,
            type
        }).returning();
        res.json(newEvent[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create event" });
    }
};

export const deleteEvent = async (req: Request, res: Response) => {
    try {
        await db.delete(events).where(eq(events.id, Number(req.params.id)));
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete event" });
    }
};
