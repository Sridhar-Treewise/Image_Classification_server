import express from "express";
import JoiValidator from 'express-joi-validation'
// import { createOrg } from "../controllers/organisation";

const validator = JoiValidator.createValidator({})
const router = express.Router();


// router.post("/createOrg", createOrg);
export default router;