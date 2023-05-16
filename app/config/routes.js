import express from "express";
import authRoutes from "../v1/routes/auth/authRoutes.js";
import serviceRoutes from "../v1/routes/service.js";

const router = express.Router();

// API routes
router.use("/auth", authRoutes);
router.use("/v1", serviceRoutes);

export default router;
