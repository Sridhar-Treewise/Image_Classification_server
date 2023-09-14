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

const MIN_IMAGE_LENGTH = 13653; // at least 10 kb
const MAX_IMAGE_LENGTH = 6980736;


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
    cylinder: Joi.string().max(100).optional(),
    image: Joi.string().custom((value, helpers) => {
        if (!value.startsWith("data:image")) {
            return helpers.error("any.invalid");
        }
        if (value.length < MIN_IMAGE_LENGTH) {
            return helpers.error("any.invalid");
        }
        if (value.length > MAX_IMAGE_LENGTH) {
            return helpers.error("any.invalid");
        }
        return value;
    }, "base64 image")
});

export const vesselDetailsSchema = Joi.object({
    vessel_name: Joi.string().optional(),
    imo_number: Joi.number().optional(),
    manufacturer: Joi.string().optional(),
    type_of_engine: Joi.string().min(2).optional(),
    vessel_type: Joi.string().optional(),
    cylinder_numbers: Joi.number().max(100).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.number().optional()
});

export const predictedDataSchema = Joi.object({
    organization: Joi.string().required(),
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
    cylindersReport: Joi.object().pattern(
        /cylinder\d+/, // Regex pattern to match "cylinderN" keys
        Joi.object({
            predictionInfo: Joi.array().items(
                Joi.object({
                    lubricationCondition: Joi.optional(),
                    surfaceCondition: Joi.optional(),
                    depositsCondition: Joi.optional(),
                    breakageCondition: Joi.optional()
                })
            ).required(),
            image: Joi.string().base64().required()
        })
    ).required()
});
