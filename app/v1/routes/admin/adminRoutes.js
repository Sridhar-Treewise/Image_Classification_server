import express from "express";
import { passwordValidation } from "../../validation/VesselValidator.js";
import { createOrg, dashboardList, usersList, restrictUser, userDetails, updateUser, updatePassword } from "../../controllers/admin/adminController.js";


const router = express.Router();

router.post("/create-org", createOrg);
router.get("/users-all", usersList);
router.get("/dashboard", dashboardList);
router.post("/restrict-user", restrictUser);
router.get("/user-details", userDetails);
router.put("/update-user", updateUser);
router.put("/update-password", updatePassword);

export default router;
