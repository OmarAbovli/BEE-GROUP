import { Router } from "express";
import { getJobs, createJob, deleteJob, applyToJob, getApplications, updateApplicationStatus } from "../controllers/jobController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

// Public
router.get("/", getJobs);
router.post("/apply", applyToJob);

// Admin protected
router.post("/", authenticateToken, createJob);
router.delete("/:id", authenticateToken, deleteJob);
router.get("/applications", authenticateToken, getApplications);
router.put("/applications/:id/status", authenticateToken, updateApplicationStatus);

export default router;
