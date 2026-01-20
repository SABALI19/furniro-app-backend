import Joi, { string } from "joi";
import { Tags } from "lucide-react";

export const updateFurnitureSchema = Joi.object({
    name: Joi.string()
    .min(3)
    .max(30)
    .message({
        'string.min': 'furniture must be at least 3 characters',
        'string.max': 'furniture name cannot exceed 30 character',
        'string.empty': 'furniture name cannot be empty'
    }),

    price: Joi.number()
    .positive()
    .message({
        'number.base': 'price must be a number',
        'number.positive': 'price must be a positive number' 
    }),

    tags: Joi.array()
    .items(Joi.string())
    .min(1)
    .messages({
        'array.base': 'Tags must be an array',
        'array.min': 'At least 1 tag is required'
    }),

    category: Joi.string()
    .valid('sofa', 'chair', 'table', 'bed', 'desk', 'shelf', 'other')
    .messages({ 
        'string.empty': 'category must not be empty',
        'any.only': 'invalid category. choose from: sofa, chair, table, desk, bed, cabinet, shelf or other'

    }),

    description: Joi.string()

})