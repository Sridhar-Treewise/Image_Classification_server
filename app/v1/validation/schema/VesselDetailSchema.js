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
    cyl_oil_consump_Ltr_24hr: Joi.string().min(2).required(),
    normal_service_load_in_percent_MCR: Joi.string().min(2).required(),
    cylinder_numbers: Joi.number().required()
});
