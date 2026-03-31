import express from "express";
import { getMetrics, createMetric } from "../controllers/metricsController.js";

const router = express.Router();

// GET /api/aquarium/:id/metrics
router.get("/:id/metrics", getMetrics);

// POST /api/aquarium/:id/metrics
router.post("/:id/metrics", createMetric);

export default router;
