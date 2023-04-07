import express from "express";
import { getProfileDetails, getReports, savePredictionData, updateProfile } from "../controllers/vessel/service.js";
import { verifyToken } from "../utils/middleware.js";
import adminRoutes from "./admin/adminRoutes.js";
import orgRoutes from "./organization/orgRoutes.js";

const router = express.Router();

//  Vessel services
router.post("/updateData", updateProfile);
router.post("/savePredictionData", savePredictionData);
router.get("/profileDetails", verifyToken, getProfileDetails);
router.get("/getReports", getReports);

//  admin services
router.use("/admin", adminRoutes);

//  org services
router.use("organization", orgRoutes);

export default router;
