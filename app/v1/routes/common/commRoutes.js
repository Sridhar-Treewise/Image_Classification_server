

import express from "express";
import { getProfileDetails, updateProfile } from "../../controllers/common/commonRoutes.js";

const router = express.Router();


router.get("/profile", getProfileDetails);
router.put("/profile", updateProfile);

export default router;
