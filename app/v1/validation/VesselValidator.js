import { validator } from "../../utils/validators.js";
import { inspectionDetailsSchema, inspectionImageSchema } from "./schema/VesselDetailSchema.js";


export const inspectionDetailValidate = (req, res, next) => {
    validator(inspectionDetailsSchema, req.body, next);
};

export const predictionImageValidation = (req, res, next) => {
    validator(inspectionImageSchema, req.body, next);
};

