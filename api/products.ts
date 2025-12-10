import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from './_db.js';
import { products, categories } from './schema.js';
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
            // Get all products or single product
            if (req.query.id) {
                const id = parseInt(req.query.id as string);
                const [product] = await db.select({
                    id: products.id,
                    title: products.title,
                    title_en: products.title_en,
                    description: products.description,
                    description_en: products.description_en,
                    image_url: products.image_url,
                    categoryName: categories.name,
                    ingredients: products.ingredients,
                    ingredients_en: products.ingredients_en,
                    usage_instructions: products.usage_instructions,
                    usage_instructions_en: products.usage_instructions_en,
                    indications: products.indications,
                    indications_en: products.indications_en,
                    side_effects: products.side_effects,
                    side_effects_en: products.side_effects_en,
                    age_range: products.age_range,
                    age_range_en: products.age_range_en,
                    is_prescription: products.is_prescription,
                    warning: products.warning,
                    warning_en: products.warning_en,
                    model_path: products.model_path
                })
                    .from(products)
                    .leftJoin(categories, eq(products.category_id, categories.id))
                    .where(eq(products.id, id))
                    .limit(1);

                if (!product) {
                    return res.status(404).json({ message: 'Product not found' });
                }

                return res.status(200).json(product);
            } else {
                // Get all products grouped by category
                const result = await db.select({
                    id: products.id,
                    title: products.title,
                    title_en: products.title_en,
                    description: products.description,
                    description_en: products.description_en,
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

                return res.status(200).json(grouped);
            }
        } else if (req.method === 'POST') {
            const productData = req.body;
            const [newProduct] = await db.insert(products).values(productData).returning();
            return res.status(201).json(newProduct);
        } else if (req.method === 'PUT') {
            const id = parseInt(req.query.id as string);
            const productData = req.body;
            const [updatedProduct] = await db
                .update(products)
                .set(productData)
                .where(eq(products.id, id))
                .returning();

            if (!updatedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }
            return res.status(200).json(updatedProduct);
        } else if (req.method === 'DELETE') {
            const id = parseInt(req.query.id as string);
            await db.delete(products).where(eq(products.id, id));
            return res.status(204).end();
        } else {
            return res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Products API error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
