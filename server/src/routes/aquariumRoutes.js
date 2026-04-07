import express from "express";
import { getMetrics } from "../controllers/metricsController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/aquarium/:id/metrics
router.get("/:id/metrics", authenticate, getMetrics);

export default router;
