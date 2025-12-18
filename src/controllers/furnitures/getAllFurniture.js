// import { data } from "react-router-dom";
import Furniture from "../../models/furniture.js";
import httpStatus from "http-status"

//get all furniture controller
export const fetchAllFurniture = async (req, res) =>{
   try {
    //Fetch all Furniture item 
     const furniture = await Furniture.find({});
     if (!furniture || furniture.length === 0){
        return res.status(httpStatus.NOT_FOUND).json({
            status: httpStatus.NOT_FOUND,
            message: "No Furniture Found",
        });
     } else {
        return res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "Furniture Fetched successfully.",
            data: furniture
        });
     }
   }  catch (error) {
    console.error("error fetching furniture:", error);
   }
}