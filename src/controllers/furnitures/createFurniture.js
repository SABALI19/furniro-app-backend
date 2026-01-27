import Furniture from "../../models/furniture.js";
import httpStatus from "http-status";

// function to create a new furniture item
export const createFurniture = async (req, res) => {
  try {
    const {
      name,
      price,
      tags,
      category,
      description,
      size,
      color,
      inStock,
      quantity,
      discount,
    } = req.body || {};

    if (!name || !price) {
      return res.status(400).json({
        status: "Error",
        message: "Name and price are required",
      });
    }

    const images = req.files ? req.files.map((file) => file.filename) : [];

    const existingFurniture = await Furniture.findOne({ name });
    if (existingFurniture) {
      return res.status(409).json({
        status: "Error",
        message: "Furniture with the same name already exists",
      });
    }

    const newFurniture = await Furniture.create({
      name,
      images,
      price,
      tags,
      category,
      description,
      size,
      color,
      inStock,
      quantity,
      discount,
    });

    return res.status(httpStatus.CREATED).json({
      status: "Success",
      message: "Furniture created successfully",
      data: newFurniture,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "Error",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

