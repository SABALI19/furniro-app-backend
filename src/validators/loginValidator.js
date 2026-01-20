import Joi from "joi";

// Define the validation schema
export const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'please provide a valid email address',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .min(8)
        .max(16)
        .required()
        .messages({
            'string.min': 'password must be at least 8 characters',
            'string.max': 'password cannot exceed 16 characters',
            'string.empty': 'password is required',
            'any.required': 'password is required'
        })
});

// Validation function
export const loginValidation = (data) => {
    return loginSchema.validate(data, { abortEarly: false });
};