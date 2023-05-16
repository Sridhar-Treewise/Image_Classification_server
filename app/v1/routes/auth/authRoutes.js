import express from "express";
import JoiValidator from "express-joi-validation";
import { signIn, signUp } from "../../controllers/auth/authController.js";
import { loginSchema } from "../../../utils/validators.js";

const validator = JoiValidator.createValidator({});
const router = express.Router();

router.post("/signUp", signUp);
router.post("/signIn", validator.body(loginSchema), signIn);

export default router;
