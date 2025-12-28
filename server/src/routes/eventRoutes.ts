import { Router } from "express";
import { getEvents, createEvent, deleteEvent } from "../controllers/eventController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.get("/", getEvents);
router.post("/", authenticateToken, createEvent);
router.delete("/:id", authenticateToken, deleteEvent);

export default router;
