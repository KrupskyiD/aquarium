import express from "express";
import {
  register,
  login,
  verifyEmail,
  refresh,
  logout,
} from "../controllers/authController.js";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// GET /api/auth/verify
router.get("/verify", verifyEmail);

// POST /api/auth/refresh
router.post("/refresh", refresh);

// POST /api/auth/logout
router.post("/logout", authenticate, logout);

export default router;
