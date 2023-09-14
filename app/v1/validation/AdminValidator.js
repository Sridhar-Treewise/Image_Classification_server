import { validator } from "../../utils/validators.js";
import { passwordSchema, dashboardUserSchema, dashboardVesselSchema, dashboardOrgSchema, userDetailsSchema } from "./schema/AdminValidatorSchema.js";
import { queryValidator } from "../validation/validator.js";

export const passwordValidation = (req, res, next) => {
    validator(passwordSchema, req.body, next);
};
export const dashboardUserValidation = (req, res, next) => {
    queryValidator(dashboardUserSchema, req.query, next);
};
export const dashboardVesselValidation = (req, res, next) => {
    queryValidator(dashboardVesselSchema, req.query, next);
};
export const dashboardOrgValidation = (req, res, next) => {
    queryValidator(dashboardOrgSchema, req.query, next);
};
export const userDetailsValidation = (req, res, next) => {
    validator(userDetailsSchema, req.body, next);
};
