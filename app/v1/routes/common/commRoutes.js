

import express from "express";
import { getProfileDetails, updateProfile, getDownloadCount } from "../../controllers/common/commonRoutes.js";

const router = express.Router();


router.get("/profile", getProfileDetails);
router.put("/profile", updateProfile);
router.get("/download-count", getDownloadCount);

export default router;
