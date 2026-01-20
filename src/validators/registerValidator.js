import joi from "joi";

export const registerSchema = joi.object({
    name: joi.string().min(6).max(15).required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    role: joi.string() 
           .valid("admin", "customer")
           .messages({
            "any.only": "Role must be either admin or customer",
            "any.required": "Role is required",
            "string.base": "Role must be a string",
           }) 
           .required(),
});