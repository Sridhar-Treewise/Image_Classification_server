import Joi from "joi";

export const passwordSchema = Joi.object({
    oldPassword: Joi.string().min(2).required(),
    password: Joi.string().min(2).required(),
    confirmPassword: Joi.string().min(2).required()
});
