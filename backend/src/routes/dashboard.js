import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { getDashboard, saveDashboard } from "../controllers/dashboardController.js";

const router = express.Router();

// All dashboard routes require authentication
router.use(authenticateToken);

// GET /dashboard - Fetch user's dashboard
router.get("/", getDashboard);

// POST /dashboard - Save user's dashboard
router.post("/", saveDashboard);

export default router;
