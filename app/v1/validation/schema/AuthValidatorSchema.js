
import Joi from "joi";
import { schemaMessages } from "../../../config/messages.js";

export const auth = {
    registerSchema: Joi.object({
        password: Joi.string().min(3).max(30).required().messages({
            "string.min": schemaMessages.passwordAtLeast3,
            "string.max": schemaMessages.passwordNotGT30,
            "any.required": schemaMessages.passwordRequired
        }),
        email: Joi.string().email().required().messages({
            "string.base": schemaMessages.emailString,
            "string.email": schemaMessages.invalidEmail,
            "any.required": schemaMessages.emailRequired
        })
    }),
    loginSchema: Joi.object({
        password: Joi.string().min(3).max(30).required().messages({
            "string.min": schemaMessages.passwordAtLeast3,
            "string.max": schemaMessages.passwordNotGT30,
            "any.required": schemaMessages.passwordRequired
        }),
        email: Joi.string().email().required().messages({
            "string.base": schemaMessages.emailString,
            "string.email": schemaMessages.invalidEmail,
            "any.required": schemaMessages.emailRequired
        })
    })
};

