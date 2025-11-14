import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { register, login, logout, verify } from "../controllers/authController.js";

const router = express.Router();

// Register new user
router.post("/register", register);

// Login user
router.post("/login", login);

// Logout (client-side will remove token, this is just for consistency)
router.post("/logout", authenticateToken, logout);

// Verify token (optional - useful for checking if token is still valid)
router.get("/verify", authenticateToken, verify);

export default router;
