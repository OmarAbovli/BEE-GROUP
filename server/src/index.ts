import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./db";
import { users, products, categories, events } from "./db/schema";
import { eq, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

// Middleware - INCREASED LIMIT FOR IMAGE UPLOADS
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "../uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
    res.json({ message: "Bee Group API is running!" });
});

// --- Upload API (Vercel Blob) ---
app.post("/api/upload", async (req, res) => {
    try {
        const { file, filename } = req.body;

        if (!file || !filename) {
            return res.status(400).json({ message: 'File and filename are required' });
        }

        // For local development, use Vercel Blob
        const { put } = await import('@vercel/blob');

        // Convert base64 to buffer
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
});

// --- Products API ---

app.get("/api/products", async (req, res) => {
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

        // Group by category for the frontend
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
});

app.get("/api/products/:id", async (req, res) => {
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
});

app.post("/api/products", async (req, res) => {
    try {
        const productData = req.body;
        const [newProduct] = await db.insert(products).values(productData).returning();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Error creating product" });
    }
});

// PUT with query parameter (?id=1)
app.put("/api/products", async (req, res) => {
    try {
        const id = parseInt(req.query.id as string);
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
});

// PUT with route parameter (/products/1)
app.put("/api/products/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
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
});

app.delete("/api/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await db.delete(products).where(eq(products.id, parseInt(id)));
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Error deleting product" });
    }
});

// DELETE product
app.delete("/api/products", async (req, res) => {
    try {
        const id = parseInt(req.query.id as string);
        await db.delete(products).where(eq(products.id, id));
        return res.status(204).end();
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Error deleting product" });
    }
});

// --- Events API ---

app.get("/api/events", async (req, res) => {
    try {
        const allEvents = await db.select().from(events).orderBy(desc(events.date));
        res.json(allEvents);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch events" });
    }
});

app.post("/api/events", async (req, res) => {
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
});

app.delete("/api/events/:id", async (req, res) => {
    try {
        await db.delete(events).where(eq(events.id, Number(req.params.id)));
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete event" });
    }
});

// --- Auth API ---

app.post("/api/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.username, username))
            .limit(1);

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.json({ token, user: { username: user.username, role: user.role } });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
