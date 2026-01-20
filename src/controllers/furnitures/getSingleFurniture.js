import Furniture from "../../models/furniture.js";
import httpStatus from "http-status"

//function to get a single furniture by id
export const getSingleFurniture = async (req, res) => {
    try{  
        //step 1: get furniture id from req.params
        const { id } = req.params; 
        //step 2: validte furniture id presence- ID is required to fetch furniture
        if (!id) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: httpStatus.BAD_REQUEST,
                message: "Furniture ID is required"
            });
        }
        //step 3: fetch furniture from database using the id
        const furniture = await Furniture.findById(id);
        if (!furniture) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: httpStatus.NOT_FOUND,
                message: "Furniture not found"
            });
        }
        //step 4: return the furniture details in the response
        return res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "Furniture fetched successfully",
            data: furniture
        });
    }catch (error) {
        //step 5: handle errors
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Internal Server Error",
            error: error.message
            
        })
    }
};
