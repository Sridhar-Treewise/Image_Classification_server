
import Joi from "joi";
import { schemaMessages } from "../../../config/messages.js";

export const auth = {
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
const customDomainValidator = (value, helpers) => {
    // eslint-disable-next-line quotes
    const disallowedDomains = ["gmail", 'yahoo', 'outlook'];
    const emailParts = value.split("@");
    const domain = emailParts[emailParts.length - 1].toLowerCase();

    if (disallowedDomains.includes(domain)) {
        return helpers.error("any.invalid");
    }

    return value;
};

export const signUpSchema = Joi.object({
    company_name: Joi.string().optional(),
    email: Joi.string().email().required(),
    fullName: Joi.string().required(),
    vessel_name: Joi.string().required(),
    password: Joi.string().min(2).required(),
    confirmPassword: Joi.string().min(2).required(),
    userType: Joi.string().min(2).required(),
    imo_number: Joi.string().min(2).required(),
    newOrg: Joi.boolean().optional(),
    organizationAdmin: Joi.string().allow("").when("userType", {
        is: "Organization",
        then: Joi.string().required(),
        otherwise: Joi.string().optional()
    })
});

export const domainSchema = Joi.object({
    email: Joi.string()
        .required()
        .custom(customDomainValidator, "custom domain validation")
        .message("Invalid email domain")
});
