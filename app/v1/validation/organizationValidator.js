import { validator } from "../../utils/validators.js";
import { createVesselSchema } from "./schema/organizationValidatorSchema.js";


export const createVesselValidate = (req, res, next) => {
    validator(createVesselSchema, req.body, next);
};
