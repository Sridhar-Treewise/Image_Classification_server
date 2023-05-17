import express from "express";
import { signIn, signUp } from "../../controllers/auth/authController.js";
import { loginValidator, registerValidator } from "../../validation/index.js";

const router = express.Router();

router.post("/signUp", registerValidator, signUp);
router.post("/signIn", loginValidator, signIn);

export default router;
