import { validator } from "../../utils/validators.js";
import { auth } from "./schema/AuthValidatorSchema.js";


export const loginValidator = (req, res, next) => {
    validator(auth.loginSchema, req.body, next);
};

export const registerValidator = (req, res, next) => {
    validator(auth.registerSchema, req.body, next);
};

