import { Request, Response } from "express";
import { db } from "../db";
import { messages } from "../db/schema";
import { desc, eq } from "drizzle-orm";
import { sendAdminNotification } from "../utils/email";


export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        const newMsg = await db.insert(messages).values({
            name, email, phone, subject, message
        }).returning();

        // Notify Admin
        await sendAdminNotification(
            `New Message: ${subject || "No Subject"}`,
            `<h3>Message from ${name}</h3>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Phone:</strong> ${phone || "N/A"}</p>
             <p><strong>Subject:</strong> ${subject || "N/A"}</p>
             <p><strong>Message:</strong><br/>${message}</p>`
        );

        res.json(newMsg[0]);
    } catch (err) {
        console.error("Contact error:", err);
        res.status(500).json({ error: "Failed to send message", details: String(err) });
    }
};

export const getMessages = async (req: Request, res: Response) => {
    try {
        const allMsgs = await db.select().from(messages).orderBy(desc(messages.createdAt));
        res.json(allMsgs);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch messages" });
    }
};

export const markMessageRead = async (req: Request, res: Response) => {
    try {
        await db.update(messages).set({ status: 'read' }).where(eq(messages.id, Number(req.params.id)));
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to update message" });
    }
};
