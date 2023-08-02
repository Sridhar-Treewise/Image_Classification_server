import express from "express";
import { inspectionDetailValidate, predictedDataValidate, predictionImageValidation, vesselDetailsValidation, reportValidation } from "../../validation/VesselValidator.js";
import { getInspectionDetails, getReports, getReportById, savePredictionData, updateProfile, updateInspectionDetails, generatePredictedImage, getVesselInfo, updateVesselInfo, exportDocuments } from "../../controllers/vessel/service.js";

const router = express.Router();

router.post("/updateData", updateProfile);
router.post("/predicted/save", predictedDataValidate, savePredictionData);
router.post("/predicted/export", exportDocuments);
router.get("/reports", reportValidation, getReports);
// TODO
// Get Report by id
router.get("/reports/:id", getReportById);
router.get("/inspection-details", getInspectionDetails); // Retrieves the inspection details
router.put("/inspection-details", inspectionDetailValidate, updateInspectionDetails); // Updates the inspection details
router.put("/show-prediction", predictionImageValidation, generatePredictedImage);
router.get("/info", getVesselInfo);
router.put("/info", vesselDetailsValidation, updateVesselInfo);

export default router;


