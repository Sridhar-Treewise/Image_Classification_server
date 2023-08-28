import express from "express";
import { createOrg, dashboardList, usersList } from "../../controllers/admin/adminController.js";


const router = express.Router();

router.post("/create-org", createOrg);
router.get("/users-all", usersList);
router.get("/dashboard", dashboardList);
export default router;
