import { Request, Response } from "express";
import { db } from "../db";
import { categories } from "../db/schema";
import { eq } from "drizzle-orm";

export const getCategories = async (req: Request, res: Response) => {
    try {
        const result = await db.select().from(categories);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories" });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const [newCategory] = await db.insert(categories).values({ name }).returning();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: "Error creating category" });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const [updated] = await db.update(categories).set({ name }).where(eq(categories.id, parseInt(id))).returning();
        if (!updated) return res.status(404).json({ message: "Category not found" });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: "Error updating category" });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await db.delete(categories).where(eq(categories.id, parseInt(id)));
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: "Error deleting category" });
    }
};
