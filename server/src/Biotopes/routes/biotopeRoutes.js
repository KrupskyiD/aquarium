import express from "express";
import * as BiotopeController from "../controllers/biotopeController.js";

const router = express.Router();

// GET /api/biotopes
router.get("/", BiotopeController.getBiotopes);

export default router;