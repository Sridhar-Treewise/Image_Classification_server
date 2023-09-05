import express from "express";
import { dashboardList, dashboardReportImageCount, getSubscriptionCount } from "../../controllers/admin/adminController.js";
import { createOrg, orgList, getOrgById, updateOrg } from "../../controllers/admin/orgManagementController.js";
import { usersList, getUserById, restrictUser, userDetails, updateUser, updatePassword } from "../../controllers/admin/userManagementController.js";
import { vesselList, getVesselById } from "../../controllers/admin/vesselManagementController.js";
import { passwordValidation, dashboardUserValidation, dashboardVesselValidation, dashboardOrgValidation } from "../../validation/AdminValidator.js";

const router = express.Router();

router.post("/create-org", createOrg);
router.get("/users/:id", getUserById);
router.get("/users-all", dashboardUserValidation, usersList);
router.get("/dashboard", dashboardList);
router.get("/dashboard-count", dashboardReportImageCount);
router.post("/restrict-user", restrictUser);
router.get("/user-details", userDetails);
router.put("/update-user", updateUser);
router.put("/update-password", passwordValidation, updatePassword);
router.get("/vessel-all", dashboardVesselValidation, vesselList);
router.get("/vessel/:id", getVesselById);
router.get("/organizations", dashboardOrgValidation, orgList);
router.get("/organizations/:id", getOrgById);
router.put("/organizations", updateOrg);
router.get("/subscription-count", getSubscriptionCount);

export default router;
