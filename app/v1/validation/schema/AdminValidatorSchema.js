import Joi from "joi";

export const passwordSchema = Joi.object({
    id: Joi.string().min(1).optional(),
    password: Joi.string().min(8).max(150).required(),
    confirmPassword: Joi.string().min(8).max(150).required()
});
export const dashboardUserSchema = Joi.object({
    pageSize: Joi.number().integer().min(1).required(),
    totalCount: Joi.number().integer().optional(),
    pageIndex: Joi.number().integer().min(0).required(),
    email: Joi.string().min(0).optional(),
    fullName: Joi.string().min(0).optional(),
    phone: Joi.string().min(0).optional()
});
export const dashboardVesselSchema = Joi.object({
    pageSize: Joi.number().integer().min(1).required(),
    totalCount: Joi.number().integer().optional(),
    pageIndex: Joi.number().integer().min(0).required(),
    vessel_name: Joi.string().min(0).optional(),
    imo_number: Joi.number().allow("").optional()
});
export const dashboardOrgSchema = Joi.object({
    pageSize: Joi.number().integer().min(1).required(),
    totalCount: Joi.number().integer().optional(),
    pageIndex: Joi.number().integer().min(0).required(),
    company_name: Joi.string().min(0).optional(),
    orgManager: Joi.string().min(0).optional()
});
export const userDetailsSchema = Joi.object({
    _id: Joi.string().min(1).optional(),
    fullName: Joi.string().min(3).required(),
    phone: Joi.number().required()
});
