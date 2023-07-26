import express from "express";
import { verifyToken, verifyUserType } from "../../utils/middleware.js";
import adminRoutes from "./admin/adminRoutes.js";
import orgRoutes from "./organization/orgRoutes.js";
import commonRoutes from "./common/commRoutes.js";
import vesselRoutes from "./vessel/vesselRoutes.js";

const router = express.Router();

//  Vessel services
router.use("/", verifyUserType("Vessel"), vesselRoutes);
//  admin services
router.use("/admin", verifyUserType("Admin"), adminRoutes);
//  org services
router.use("/organization", verifyUserType("Organization"), orgRoutes);
// common routes for all userType
router.use("/common", verifyToken, commonRoutes);


export default router;
