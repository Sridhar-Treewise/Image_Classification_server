import express from "express";
import { getAdmins, getOrgs, signIn, signUp, getAdminByOrg } from "../../controllers/auth/authController.js";
import { signInValidate, signUpValidate, validateDomain } from "../../validation/AuthValidator.js";

const router = express.Router();

router.post("/sign-in", signInValidate, signIn);
router.post("/sign-up", signUpValidate, signUp);
router.post("/org-admins", validateDomain, getAdmins);
router.get("/org", getOrgs);
router.post("/admins-by-org", getAdminByOrg);

export default router;
