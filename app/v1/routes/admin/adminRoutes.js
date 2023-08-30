import express from "express";
import {
    createOrg, dashboardList, usersList, getUserById, restrictUser, userDetails,
    updateUser, updatePassword, vesselList, getVesselById, orgList, getOrgById
} from "../../controllers/admin/adminController.js";
import { passwordValidation } from "../../validation/AdminValidator.js";


const router = express.Router();

router.post("/create-org", createOrg);
router.get("/users/:id", getUserById);
router.get("/users-all", usersList);
router.get("/dashboard", dashboardList);
router.post("/restrict-user", restrictUser);
router.get("/user-details", userDetails);
router.put("/update-user", updateUser);
router.put("/update-password", passwordValidation, updatePassword);
router.get("/vessel-all", vesselList);
router.get("/vessel/:id", getVesselById);
router.get("/organizations", orgList);
router.get("/organizations/:id", getOrgById);

export default router;
