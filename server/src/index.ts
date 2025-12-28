import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./db";
import { users, products, categories, events, jobs, applications, messages } from "./db/schema";
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
    // ... existing blob logic ...
    try {
        const { file, filename } = req.body;
        // ...
        const { put } = await import('@vercel/blob');
        const buffer = Buffer.from(file.split(',')[1] || file, 'base64');
        const blob = await put(filename, buffer, { access: 'public', token: process.env.BLOB_READ_WRITE_TOKEN });
        return res.status(200).json({ url: blob.url });
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// --- Local Upload API (Multer) ---
app.post("/api/upload-local", upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
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

// --- Jobs API ---

app.get("/api/jobs", async (req, res) => {
    try {
        const allJobs = await db.select().from(jobs).where(eq(jobs.isActive, "true")).orderBy(desc(jobs.createdAt));
        res.json(allJobs);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
});

app.post("/api/jobs", async (req, res) => {
    try {
        const {
            title, title_en, location, location_en, type, type_en,
            description, description_en, requirements, requirements_en,
            salary_range, salary_range_en, experience_level, experience_level_en,
            work_mode, work_mode_en, benefits, benefits_en
        } = req.body;
        const newJob = await db.insert(jobs).values({
            title, title_en, location, location_en, type, type_en,
            description, description_en, requirements, requirements_en,
            salary_range, salary_range_en, experience_level, experience_level_en,
            work_mode, work_mode_en, benefits, benefits_en
        }).returning();
        res.json(newJob[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create job" });
    }
});

app.delete("/api/jobs/:id", async (req, res) => {
    try {
        await db.delete(jobs).where(eq(jobs.id, Number(req.params.id)));
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete job" });
    }
});

// --- Applications API ---

app.post("/api/apply", async (req, res) => {
    try {
        const { job_id, name, email, phone, cv_url, message, linkedin_url, portfolio_url, experience_years, expected_salary, graduation_year } = req.body;
        const newApp = await db.insert(applications).values({
            job_id: job_id ? Number(job_id) : null,
            name, email, phone, cv_url, message,
            linkedin_url, portfolio_url, experience_years, expected_salary, graduation_year
        }).returning();
        res.json(newApp[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to submit application" });
    }
});

app.get("/api/applications", async (req, res) => {
    try {
        const allApps = await db.select({
            id: applications.id,
            name: applications.name,
            email: applications.email,
            phone: applications.phone,
            cv_url: applications.cv_url,
            message: applications.message,
            linkedin_url: applications.linkedin_url,
            portfolio_url: applications.portfolio_url,
            experience_years: applications.experience_years,
            expected_salary: applications.expected_salary,
            graduation_year: applications.graduation_year,
            status: applications.status,
            createdAt: applications.createdAt,
            jobTitle: jobs.title
        })
            .from(applications)
            .leftJoin(jobs, eq(applications.job_id, jobs.id))
            .orderBy(desc(applications.createdAt));

        res.json(allApps);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch applications" });
    }
});

app.put("/api/applications/:id/status", async (req, res) => {
    try {
        const { status } = req.body;
        await db.update(applications).set({ status }).where(eq(applications.id, Number(req.params.id)));
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to update application status" });
    }
});

// --- Messages API ---

// Health Check
app.get("/api/check", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/api/contact", async (req, res) => {
    console.log("Contact form submission:", req.body);
    try {
        const { name, email, phone, subject, message } = req.body;
        const newMsg = await db.insert(messages).values({
            name, email, phone, subject, message
        }).returning();
        console.log("Message saved:", newMsg[0]);
        res.json(newMsg[0]);
    } catch (err) {
        console.error("Contact error:", err);
        res.status(500).json({ error: "Failed to send message", details: String(err) });
    }
});

app.get("/api/messages", async (req, res) => {
    try {
        const allMsgs = await db.select().from(messages).orderBy(desc(messages.createdAt));
        res.json(allMsgs);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});

app.put("/api/messages/:id/read", async (req, res) => {
    try {
        await db.update(messages).set({ status: 'read' }).where(eq(messages.id, Number(req.params.id)));
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to update message" });
    }
});

// Export for Vercel
export default app;

// Only listen if not running on Vercel (local development)
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
