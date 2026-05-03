import express from "express";
import {
  register,
  login,
  verifyEmail,
  resendVerificationEmail,
  refresh,
  logout,
  getMe,
  updateProfile,
} from "../controllers/authController.js";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// GET /api/auth/verify
router.get("/verify", verifyEmail);

// POST /api/auth/resend-verification
router.post("/resend-verification", resendVerificationEmail);

// POST /api/auth/refresh
router.post("/refresh", refresh);

// POST /api/auth/logout
router.post("/logout", authenticate, logout);

// GET /api/auth/me
router.get("/me", authenticate, getMe);

// PATCH /api/auth/profile
router.patch("/profile", authenticate, updateProfile);

export default router;
