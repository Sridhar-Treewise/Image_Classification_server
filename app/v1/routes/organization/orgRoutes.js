import express from "express";
import { vesselList, pendingVesselList, approveRequest, createVessel } from "../../controllers/organization/organizationController.js";
import { createVesselValidate } from "../../validation/organizationValidator.js"
const router = express.Router();


// router.post("/create-vessel", (req, res) => {
//     res.status(201).json({ test: "Test" });
// });
router.get("/vessel-list", vesselList);
router.get("/pending-vessel-list", pendingVesselList);
router.post("/approve-request/:id", approveRequest);
router.post("/create-vessel", createVesselValidate, createVessel);

export default router;
