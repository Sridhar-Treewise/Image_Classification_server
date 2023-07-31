import express from "express";
import { inspectionDetailValidate, predictedDataValidate, predictionImageValidation, vesselDetailsValidation, reportValidation } from "../../validation/VesselValidator.js";
import { getInspectionDetails, getReports, savePredictionData, updateProfile, updateInspectionDetails, generatePredictedImage, getVesselInfo, updateVesselInfo } from "../../controllers/vessel/service.js";

const router = express.Router();

router.post("/updateData", updateProfile);
router.post("/predicted/save", predictedDataValidate, savePredictionData);
router.get("/reports", reportValidation, getReports);
// TODO
// Get Report by id
router.get("/reports/:id", getReports);
router.get("/inspection-details", getInspectionDetails); // Retrieves the inspection details
router.put("/inspection-details", inspectionDetailValidate, updateInspectionDetails); // Updates the inspection details
router.put("/show-prediction", predictionImageValidation, generatePredictedImage);
router.get("/info", getVesselInfo);
router.put("/info", vesselDetailsValidation, updateVesselInfo);

export default router;


