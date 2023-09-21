import express from "express";
import { getAdmins, getOrgs, signIn, signUp, getAdminByOrg, orgRegistration, vesselRegistration, getPrice } from "../../controllers/auth/authController.js";
import { signInValidate, signUpValidate, validateDomain, vesselRegistrationValidate, orgRegistrationValidate } from "../../validation/AuthValidator.js";

const router = express.Router();

router.post("/sign-in", signInValidate, signIn);
router.post("/sign-up", signUpValidate, signUp);
router.post("/org-registration", orgRegistrationValidate, orgRegistration);
router.post("/vessel-registration", vesselRegistrationValidate, vesselRegistration);
router.post("/org-admins", validateDomain, getAdmins);
router.get("/org", getOrgs);
router.post("/admins-by-org", getAdminByOrg);
router.get("/price", getPrice);


export default router;
