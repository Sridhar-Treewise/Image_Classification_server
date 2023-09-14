

import express from "express";
import { getProfileDetails, updateProfile } from "../../controllers/common/commonRoutes.js";
import { orgProfileValidate } from "../../validation/organizationValidator.js";

const router = express.Router();


router.get("/profile", getProfileDetails);
router.put("/profile", orgProfileValidate, updateProfile);

export default router;
