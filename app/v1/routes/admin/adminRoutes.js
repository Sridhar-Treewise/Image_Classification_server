import express from "express";
import { dashboardList, dashboardReportImageCount, getSubscriptionCount, getTransactionCount, addPrice } from "../../controllers/admin/adminController.js";
import { orgList, getOrgById, updateOrg } from "../../controllers/admin/orgManagementController.js";
import { usersList, getUserById, restrictUser, userDetails, updateUser, updatePassword } from "../../controllers/admin/userManagementController.js";
import { vesselList, getVesselById } from "../../controllers/admin/vesselManagementController.js";
import { passwordValidation, dashboardUserValidation, dashboardVesselValidation, dashboardOrgValidation, userDetailsValidation } from "../../validation/AdminValidator.js";

const router = express.Router();

router.get("/users/:id", getUserById);
router.get("/users-all", dashboardUserValidation, usersList);
router.get("/dashboard", dashboardList);
router.get("/dashboard-count", dashboardReportImageCount);
router.post("/restrict-user", restrictUser);
router.get("/user-details", userDetails);
router.put("/update-user", userDetailsValidation, updateUser);
router.put("/update-password", passwordValidation, updatePassword);
router.get("/vessel-all", dashboardVesselValidation, vesselList);
router.get("/vessel/:id", getVesselById);
router.get("/organizations", dashboardOrgValidation, orgList);
router.get("/organizations/:id", getOrgById);
router.put("/organizations", updateOrg);
router.get("/subscription-count", getSubscriptionCount);
router.get("/transaction-count", getTransactionCount);
router.post("/price", addPrice);


export default router;
