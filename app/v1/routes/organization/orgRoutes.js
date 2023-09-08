import express from "express";
import { vesselList, pendingVesselList, approveRequest, createVessel, orgVesselList, getVesselById, deleteVessel } from "../../controllers/organization/organizationController.js";
import { createVesselValidate, vesselListValidation } from "../../validation/organizationValidator.js";
const router = express.Router();


// router.post("/create-vessel", (req, res) => {
//     res.status(201).json({ test: "Test" });
// });
router.get("/vessel-list-card", vesselList);
router.get("/vessel-list", vesselListValidation, orgVesselList);
router.get("/vessel/:id", getVesselById);
router.delete("/vessel/:id", deleteVessel);
router.get("/pending-vessel-list", pendingVesselList);
router.post("/approve-request/:id", approveRequest);
router.post("/create-vessel", createVesselValidate, createVessel);

export default router;
