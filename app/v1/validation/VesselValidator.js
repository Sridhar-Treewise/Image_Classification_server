import { validator } from "../../utils/validators.js";
import { inspectionDetailsSchema, inspectionImageSchema, predictedDataSchema, vesselDetailsSchema, passwordSchema } from "./schema/VesselDetailSchema.js";
import { paginationSchema, reportsSchema } from "../validation/schema/Common.js";
import { queryValidator } from "../validation/validator.js";


export const inspectionDetailValidate = (req, res, next) => {
    validator(inspectionDetailsSchema, req.body, next);
};

export const predictionImageValidation = (req, res, next) => {
    validator(inspectionImageSchema, req.body, next);
};

export const vesselDetailsValidation = (req, res, next) => {
    validator(vesselDetailsSchema, req.body, next);
};

export const predictedDataValidate = (req, res, next) => {
    validator(predictedDataSchema, req.body, next);
};

export const PaginationValidate = (req, res, next) => {
    queryValidator(paginationSchema, req.query, next);
};

export const reportValidation = (req, res, next) => {
    queryValidator(reportsSchema, req.query, next);
};
export const passwordValidation = (req, res, next) => {
    validator(passwordSchema, req.query, next);
};
