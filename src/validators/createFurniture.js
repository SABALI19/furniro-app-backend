import Joi from "joi";

export const createFurnitureSchema = Joi.object({
    name: Joi.string().min(7).max(17).required (),
    // image: Joi.string().required(),
    price: Joi.number().required(),
    tags: Joi.string().required(),
    category: Joi.string().required(),
    description: Joi.string().required(),
    size: Joi.string().required(),
    color: Joi.string().required(),
    instock: Joi.boolean(),
    quantity: Joi.number().min(1).default(0),
    discount: Joi.number(),

})