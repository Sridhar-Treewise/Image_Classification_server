import { validator } from "../../utils/validators.js";
import { inspectionDetailsSchema, inspectionImageSchema, vesselDetailsSchema } from "./schema/VesselDetailSchema.js";


export const inspectionDetailValidate = (req, res, next) => {
    validator(inspectionDetailsSchema, req.body, next);
};

export const predictionImageValidation = (req, res, next) => {
    validator(inspectionImageSchema, req.body, next);
};

export const vesselDetailsValidation = (req, res, next) => {
    validator(vesselDetailsSchema, req.body, next);
};
