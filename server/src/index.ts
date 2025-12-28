import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import multer from "multer";

// Routes
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import eventRoutes from "./routes/eventRoutes";
import jobRoutes from "./routes/jobRoutes";
import messageRoutes from "./routes/messageRoutes";
import categoryRoutes from "./routes/categoryRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Configure Multer for file uploads
const storage = process.env.NODE_ENV === 'production'
    ? multer.memoryStorage()
    : multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadDir = path.join(__dirname, "../uploads");
            if (!fs.existsSync(uploadDir)) {
                try {
                    fs.mkdirSync(uploadDir, { recursive: true });
                } catch (e) {
                    console.error("Failed to create upload dir:", e);
                }
            }
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    });

const upload = multer({ storage: storage });

// Only serve static uploads locally
if (process.env.NODE_ENV !== "production") {
    app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
}

// Health Check
app.get("/api/check", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
    res.json({ message: "Bee Group API is running!" });
});

// --- Upload APIs ---

// Vercel Blob Upload
app.post("/api/upload", async (req, res) => {
    try {
        const { file, filename } = req.body;
        const { put } = await import('@vercel/blob');
        const buffer = Buffer.from(file.split(',')[1] || file, 'base64');
        const blob = await put(filename, buffer, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN
        });
        return res.status(200).json({ url: blob.url });
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Local File Upload (Development)
app.post("/api/upload-local", upload.single('file'), (req, res) => {
    if (!(req as any).file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${(req as any).file.filename}`;
    res.json({ url: fileUrl });
});

// --- Modular Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/categories", categoryRoutes);

// Compatibility aliases for old endpoints if needed
app.post("/api/login", (req, res) => res.redirect(307, "/api/auth/login"));
app.post("/api/contact", (req, res) => res.redirect(307, "/api/messages"));
app.post("/api/apply", (req, res) => res.redirect(307, "/api/jobs/apply"));

// Export for Vercel
export default app;

// Only listen if not running on Vercel
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
