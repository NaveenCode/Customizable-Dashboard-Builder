import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  register,
  login,
  logout,
  verify,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", authenticateToken, logout);

router.get("/verify", authenticateToken, verify);

export default router;
