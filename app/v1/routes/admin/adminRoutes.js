import express from "express";
<<<<<<< HEAD
import { passwordValidation } from "../../validation/VesselValidator.js";

import { createOrg, dashboardList, usersList, restrictUser, userDetails, updateUser, updatePassword } from "../../controllers/admin/adminController.js";
=======
import { createOrg, dashboardList, usersList } from "../../controllers/admin/adminController.js";
>>>>>>> 0f1ad2c9b18c1b139f83c9185014c6695cd68761


const router = express.Router();

router.post("/create-org", createOrg);
router.get("/users-all", usersList);
router.get("/dashboard", dashboardList);
router.post("/restrict-user", restrictUser);
router.get("/user-details", userDetails);
router.put("/update-user", updateUser);
router.put("/update-password", updatePassword);

export default router;
