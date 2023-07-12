import Joi from "joi";
import { schemaMessages } from "../../../config/messages.js";

export const inspectionDetailsSchema = Joi.object({
    inspection_date: Joi.number().required().messages({
        "number.base": schemaMessages.dateNumber,
        "any.required": schemaMessages.dateRequired("inspection_date")
    }),
    normal_service_load_in_percent_MCRMCR: Joi.string().required(),
    total_running_hours: Joi.string().required(),
    running_hrs_since_last: Joi.string().required(),
    cyl_oil_Type: Joi.string().min(2).required(),
    cyl_oil_consump_Ltr_24hr: Joi.string().required(),
    normal_service_load_in_percent_MCR: Joi.string().required(),
    cylinder_numbers: Joi.number().required()
});


export const inspectionImageSchema = Joi.object({
    inspection_date: Joi.number().required().messages({
        "number.base": schemaMessages.dateNumber,
        "any.required": schemaMessages.dateRequired("inspection_date")
    }),
    normal_service_load_in_percent_MCRMCR: Joi.string().required(),
    total_running_hours: Joi.string().required(),
    running_hrs_since_last: Joi.string().required(),
    cyl_oil_Type: Joi.string().min(2).required(),
    cyl_oil_consump_Ltr_24hr: Joi.string().required(),
    normal_service_load_in_percent_MCR: Joi.string().required(),
    cylinder_numbers: Joi.number().required(),
    cylinder: Joi.number().max(100).optional(),
    image: Joi.string().optional()
});
