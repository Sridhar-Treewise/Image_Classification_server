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