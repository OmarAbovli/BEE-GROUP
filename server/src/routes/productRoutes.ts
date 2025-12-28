import { Router } from "express";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", authenticateToken, createProduct);
router.put("/", authenticateToken, updateProduct);
router.put("/:id", authenticateToken, updateProduct);
router.delete("/", authenticateToken, deleteProduct);
router.delete("/:id", authenticateToken, deleteProduct);

export default router;
