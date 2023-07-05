import express from "express";
import { getInspectionDetails, getReports, savePredictionData, updateProfile } from "../controllers/vessel/service.js";
import { verifyToken } from "../../utils/middleware.js";
import adminRoutes from "./admin/adminRoutes.js";
import orgRoutes from "./organization/orgRoutes.js";
import commonRoutes from "./common/commRoutes.js";

const router = express.Router();

//  Vessel services
router.post("/updateData", updateProfile);
router.post("/savePredictionData", savePredictionData);
router.get("/get-reports", getReports);
router.get("/inspection-details", getInspectionDetails);

//  admin services
router.use("/admin", adminRoutes);

//  org services
router.use("/organization", orgRoutes);
router.use("/common", verifyToken, commonRoutes);

export default router;
