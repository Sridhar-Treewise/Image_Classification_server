import express from "express";
import { getInspectionDetails, getReports, savePredictionData, updateProfile, updateInspectionDetails, generatePredictedImage, getVesselInfo, updateVesselInfo } from "../controllers/vessel/service.js";
import { verifyToken } from "../../utils/middleware.js";
import adminRoutes from "./admin/adminRoutes.js";
import orgRoutes from "./organization/orgRoutes.js";
import commonRoutes from "./common/commRoutes.js";
import { inspectionDetailValidate, predictionImageValidation, vesselDetailsValidation } from "../validation/VesselValidator.js";

const router = express.Router();

//  Vessel services
router.post("/updateData", updateProfile);
router.post("/savePredictionData", savePredictionData);
router.get("/get-reports", getReports);
router.get("/inspection-details", getInspectionDetails); // Retrieves the inspection details
router.put("/inspection-details", inspectionDetailValidate, updateInspectionDetails); // Updates the inspection details
router.put("/show-prediction", predictionImageValidation, generatePredictedImage);
router.get("/vessel-info", getVesselInfo);
router.put("/vessel-info", vesselDetailsValidation, updateVesselInfo);
//  admin services
router.use("/admin", adminRoutes);

//  org services
router.use("/organization", orgRoutes);
// common routes for all userType
router.use("/common", verifyToken, commonRoutes);

export default router;
