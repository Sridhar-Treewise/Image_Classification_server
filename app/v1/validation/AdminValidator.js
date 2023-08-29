import { validator } from "../../utils/validators.js";
import { passwordSchema } from "./schema/AdminValidatorSchema.js";

export const passwordValidation = (req, res, next) => {
    validator(passwordSchema, req.body, next);
};
