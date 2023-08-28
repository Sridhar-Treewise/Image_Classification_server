import express from "express";

import { createOrg, dashboardList } from "../../controllers/admin/adminController.js";


const router = express.Router();


router.post("/create-org", createOrg);
router.get("/dashboard", dashboardList);
export default router;
