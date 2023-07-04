import { validator } from "../../utils/validators.js";
import { auth, domainSchema, signUpSchema } from "./schema/AuthValidatorSchema.js";


export const signInValidate = (req, res, next) => {
    validator(auth.loginSchema, req.body, next);
};

export const signUpValidate = (req, res, next) => {
    validator(signUpSchema, req.body, next);
};

export const validateDomain = (req, res, next) => {
    validator(domainSchema, req.body, next);
};

