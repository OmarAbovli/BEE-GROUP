import { Router } from "express";
import { sendMessage, getMessages, markMessageRead } from "../controllers/messageController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post("/", sendMessage);
router.get("/", authenticateToken, getMessages);
router.put("/:id/read", authenticateToken, markMessageRead);

export default router;
