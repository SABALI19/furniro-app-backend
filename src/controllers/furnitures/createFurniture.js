import Furniture from "../../models/furniture.js";
import httpStatus, { status } from "http-status";
import { createFurnitureSchema } from "../../validators/createFurniture.js";

export const createFurniture = async (req, res) => {
  try {

    //Validate the request body(create furniture)
        const { error } = createFurnitureSchema.validate(req.body);
        if (error) {
          return res.status(httpStatus.BAD_REQUEST).json({
            status: "validation Error", 
            message: error.details[0].message,
          })
        }
    // destructure furniture details from request body
    const {
      name,
      price,
      tags,
      category,
      description,
      size,
      color,
      instock,
      quantity,
      discount,
      image // Added image field
    } = req.body;

    // check if furniture with the same name exists - FIXED: findOne
    const existingFurniture = await Furniture.findOne({ name });

    if (existingFurniture) {
      return res.status(httpStatus.CONFLICT).json({
        status: "Error",
        message: "Furniture with the same name already exists"
      });
    }

    // Create a new furniture item
    const newFurniture = await Furniture.create({
      name,
      price,
      tags,
      category,
      description,
      size,
      color,
      instock,
      quantity,
      discount,
      image // Added image field
    });

    // send response back to client
    return res.status(httpStatus.CREATED).json({
      status: "success",
      message: "Furniture created successfully",
      data: newFurniture,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "Error",
      message: "Internal server Error",
      error: error.message,
    });
  }
};