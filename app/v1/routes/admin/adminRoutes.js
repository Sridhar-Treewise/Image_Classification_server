import express from "express";

import { createOrg, usersList } from "../../controllers/admin/adminController.js";


const router = express.Router();


router.post("/create-org", createOrg);
router.get("/users-all", usersList);
export default router;
