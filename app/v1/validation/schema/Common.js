import Joi from "joi";
import { schemaMessages } from "../../../config/messages.js";


export const getByIdParamsSchema = Joi.object({
    id: Joi.number().integer().positive().required(),
});

export const paginationSchema = Joi.object({
    pageIndex: Joi.number().integer().min(0).required().messages({
        "string.min": schemaMessages.passwordAtLeast3,
        "string.max": schemaMessages.passwordNotGT30,
        "any.required": schemaMessages.passwordRequired
    }),
    pageSize: Joi.number().integer().min(1).required(),
    totalCount: Joi.number().integer().min(0).required()
});

export const reportsSchema = Joi.object({
    pageSize: Joi.number().integer().min(1).required(),
    totalCount: Joi.number().integer().optional(),
    pageIndex: Joi.number().integer().min(0).required(),
    startDate: Joi.number().integer().min(1).optional(),
    endDate: Joi.number().integer().min(1).optional()
        .when("startDate", {
            is: Joi.exist(),
            then: Joi.number().greater(Joi.ref("startDate")).optional(),
            otherwise: Joi.number().optional()
        })
});
