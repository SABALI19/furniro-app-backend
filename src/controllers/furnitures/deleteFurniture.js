import Furniture from "../../models/furniture.js";
import httpStatus from "http-status";


//function to delete furniture by id
export const deleteFurniture = async (req, res) => {
  try {
    const { id } = req.params;
    //Validate id presence- ID irequired to delete furniture
    if (!id) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        message: "Furniture ID is required to delete furniture.",
      });
    }
    //check if furniture with the provided ID exists
    const existingFurniture = await Furniture.findById(id);
    if (!existingFurniture) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: httpStatus.NOT_FOUND,
        message: `Furniture with id: ${id} not found`,
      });
    }
    //step 3: delete the furniture from database
    await Furniture.findByIdAndDelete(id);
    res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "Furniture deleted successfully",
    });
  } catch (error) {
    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "Furniture deleted successfully.",
      error: error.message,
    });
  }
};
