import User from "../../models/users.js";
import httpStatus, { status } from  "http-status";

//controller to delete a user by ID 
export const deleteUser = async  (req, res) => {
    try {
        //Extract user ID from request parameters
        const { id } = req.params; 
        //check if user exists
        const user = await User.findById(id);

        if (!User) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: "Not Found",
                statusCode: httpStatus.NOT_FOUND,
                message: "User not found",
            });
        }
         
        //Delete the User
        await User.findByIdAndDelete(id);
        return res.status(httpStatus.OK).json({
            status: "Success",
            statusCode: httpStatus.OK,
            message: "User deleted succefully",

        });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "An error occured while deleting the user",
            error: error.message,
        });
    }
};