

import express from "express";
import { getProfileDetails } from "../../controllers/common/commonRoutes.js";

const router = express.Router();


router.get("/profile", getProfileDetails);

export default router;
