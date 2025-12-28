import { Request, Response } from "express";
import { db } from "../db";
import { products, categories } from "../db/schema";
import { eq } from "drizzle-orm";

export const getProducts = async (req: Request, res: Response) => {
    try {
        const result = await db.select({
            id: products.id,
            title: products.title,
            description: products.description,
            image_url: products.image_url,
            categoryName: categories.name
        })
            .from(products)
            .leftJoin(categories, eq(products.category_id, categories.id));

        const grouped = result.reduce((acc: any, item) => {
            const cat = item.categoryName || 'Other';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(item);
            return acc;
        }, {});

        res.json(grouped);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Error fetching products" });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [product] = await db.select({
            id: products.id,
            title: products.title,
            description: products.description,
            image_url: products.image_url,
            categoryName: categories.name,
            ingredients: products.ingredients,
            usage_instructions: products.usage_instructions,
            indications: products.indications,
            side_effects: products.side_effects,
            age_range: products.age_range,
            is_prescription: products.is_prescription,
            warning: products.warning,
            model_path: products.model_path
        })
            .from(products)
            .leftJoin(categories, eq(products.category_id, categories.id))
            .where(eq(products.id, parseInt(id)))
            .limit(1);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        console.error("Error fetching product details:", error);
        res.status(500).json({ message: "Error fetching product details" });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const productData = req.body;
        const [newProduct] = await db.insert(products).values(productData).returning();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Error creating product" });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const id = req.params.id ? parseInt(req.params.id) : parseInt(req.query.id as string);
        const productData = req.body;
        const [updatedProduct] = await db
            .update(products)
            .set(productData)
            .where(eq(products.id, id))
            .returning();

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Error updating product" });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const id = req.params.id ? parseInt(req.params.id) : parseInt(req.query.id as string);
        await db.delete(products).where(eq(products.id, id));
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Error deleting product" });
    }
};
