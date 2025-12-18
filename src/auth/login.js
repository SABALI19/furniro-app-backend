import User from "../models/users.js";
import bcrypt from "bcrypt"
import httpStatus from "http-status"

export const loginUser = async(req, res) => {
    try {
        //destructure data from the request body
        const { email, password } = req.body;
        //check if user with email exists
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: "NOT FOUND",
            statusCode: httpStatus.NOT_FOUND,
            message: "User not found.",
            })
            
        }
        //confirm existing by comparing passwords 
        const confirmedUser = await bcrypt.compare(password, existingUser.password)
        if (confirmedUser){
            return res.status(httpStatus.OK).json ({
                status: "Success",
                statusCode: httpStatus.OK,
                message: "Login successful",
                data: existingUser,
            })
        }
        return res.status (httpStatus.NOT_FOUND).json({
            status: "Error",
            statusCode: httpStatus.NOT_FOUND,
            message: "Ivalid credentials",
        });

    } catch (error) {
        return res.status (httpStatus.INTERNAL_SERVER_ERROR).json({
            status: "Server Error",
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            message: "An error occured while logging in.",
            error: error.message,
        });
    }
}