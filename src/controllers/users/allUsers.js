import { json } from "express";
import User from "../../models/users.js";
import httpStatus, { status } from "http-status";

export const getAllUsers = async (req, res) => {
    try{
        //Fetch all users from the database
        const users = await User.find ({}, "name email role");
        if (users.lenght === 0) {
            return res.status(httpStatus.NOT_FOUND).JSON({
                status: "NOT FOUND",
                statusCode: httpStatus.NOT_FOUND,
                message: "No users found",
            });
        }

        //return the list of users
        return res.status(httpStatus.OK).json ({
            status: "Success",
            statusCode: "httpStatus.OK",
            message: "Users retrieved successfully",
            data: users,
        });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "An error occured while retrieving users",
            error: error.message,
        });
    }
};