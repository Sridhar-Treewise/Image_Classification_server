import Joi from "joi";

export const createVesselSchema = Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(2).required(),
    vessel_name: Joi.string().required(),
    imo_number: Joi.number().required(),
    manufacturer: Joi.string().required(),
    type_of_engine: Joi.string().min(2).required(),
    vessel_type: Joi.string().required(),
    cylinder_numbers: Joi.number().max(100).required()
});
export const vesselSchema = Joi.object({
    pageSize: Joi.number().integer().min(1).required(),
    totalCount: Joi.number().integer().optional(),
    pageIndex: Joi.number().integer().min(0).required(),
    vessel_name: Joi.string().min(0).optional(),
    imo_number: Joi.number().allow("").optional()
});
export const orgProfileSchema = Joi.object({
    fullName: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    phone: Joi.number().required()
});
