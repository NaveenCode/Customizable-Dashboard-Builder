import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  getDashboard,
  saveDashboard,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", getDashboard);

router.post("/", saveDashboard);

export default router;
