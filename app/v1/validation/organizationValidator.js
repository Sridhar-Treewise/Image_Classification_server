import { validator } from "../../utils/validators.js";
import { createVesselSchema, vesselSchema } from "./schema/organizationValidatorSchema.js";
import { queryValidator } from "../validation/validator.js";


export const createVesselValidate = (req, res, next) => {
    validator(createVesselSchema, req.body, next);
};
export const vesselListValidation = (req, res, next) => {
    queryValidator(vesselSchema, req.query, next);
};
