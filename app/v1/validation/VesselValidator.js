import { validator } from "../../utils/validators.js";
import { inspectionDetailsSchema } from "./schema/VesselDetailSchema.js";


export const inspectionDetailValidate = (req, res, next) => {
    validator(inspectionDetailsSchema, req.body, next);
};

