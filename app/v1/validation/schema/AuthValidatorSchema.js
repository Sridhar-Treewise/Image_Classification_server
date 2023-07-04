
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
        }),
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
    // email: Joi.string()
    //     .email({ tlds: { allow: false } })
    //     .required().message("Invalid email domain"),
    // .custom(customDomainValidator, "The email domain Not allowed")
    email: Joi.string().email().min(1).required(),
    fullName: Joi.string().min(1).required(),
    vesselName: Joi.string().min(1).required(),
    password: Joi.string().min(2).required(),
    confirmPassword: Joi.string().min(2).required(),
    userType: Joi.string().min(2).required(),
    imoNumber: Joi.string().min(2).required(),
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
