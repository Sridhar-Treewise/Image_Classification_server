import Joi from "joi";

export const passwordSchema = Joi.object({
    id: Joi.string().min(1).optional(),
    password: Joi.string().min(8).max(150).required(),
    confirmPassword: Joi.string().min(8).max(150).required()
});
