

import express from "express";
import { getProfileDetails, updateProfile, getDownloadCount, choosePlan } from "../../controllers/common/commonRoutes.js";
import { orgProfileValidate } from "../../validation/organizationValidator.js";

const router = express.Router();


router.get("/profile", getProfileDetails);
router.put("/download-count", getDownloadCount);
router.put("/profile", orgProfileValidate, updateProfile);
router.post("/choosePlan", choosePlan);


export default router;
