import express from "express";
import { verifyToken, verifyUserType } from "../../utils/middleware.js";
import adminRoutes from "./admin/adminRoutes.js";
import orgRoutes from "./organization/orgRoutes.js";
import commonRoutes from "./common/commRoutes.js";
import vesselRoutes from "./vessel/vesselRoutes.js";
import { KEY_USER_TYPE } from "../../common/constants.js";

const router = express.Router();

//  Vessel services
router.use("/vessel", verifyUserType(KEY_USER_TYPE.VESSEL), vesselRoutes);

//  org services
router.use("/organization", verifyUserType(KEY_USER_TYPE.ORG), orgRoutes);

//  admin services
router.use("/admin", verifyUserType(KEY_USER_TYPE.ADMIN), adminRoutes);

// common routes for all userType
router.use("/common", verifyToken, commonRoutes);


export default router;
