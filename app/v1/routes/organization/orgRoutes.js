import express from "express";
import JoiValidator from "express-joi-validation"

const validator = JoiValidator.createValidator({})
const router = express.Router();


// router.post("/create-vessel", createVessel);

export default router;