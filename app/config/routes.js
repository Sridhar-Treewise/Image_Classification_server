import express from "express";
import authRoutes from "../v1/routes/auth/authRoutes.js";
import serviceRoutes from "../v1/routes/service.js";
import { verifyToken } from "../utils/middleware.js";

const router = express.Router();

// API routes
router.use("/no-auth", authRoutes);
router.use("/auth", verifyToken, serviceRoutes);

// Health check
router.get("/ping", (req, res) => res.status(200).json({ pong: true }));


export default router;
