import express from "express";
import { getMetrics } from "../controllers/metricsController.js";

const router = express.Router();

// GET /api/aquarium/:id/metrics
router.get("/:id/metrics", getMetrics);

export default router;
