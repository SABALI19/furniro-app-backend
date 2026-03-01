import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import dotenv from "dotenv";
import User from "../models/users.js";
dotenv.config();


export const authenticateUser = async (req, res, next) => {
    //get authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(httpStatus.UNAUTHORIZED).json({
            status: "unauthorized",
            message: "Token NOT provided!",
        });
    }


    //store token IN a variableif it exists
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        req.user = user;
        next();
    }catch (error) {
        console.error("JWT Error:", error.message);
        return res.status(httpStatus.UNAUTHORIZED).json({
            status: "unauthorized",
            message: "Unauthorized: Token failed or expired!",
        });
    }

    //
};


//function to check user roles
const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        if(!allowedRoles.includes(req.user.role)) {
            return res.status(httpStatus.FORBIDDEN).json({
                status: "forbidden",
                message: "Forbidden: Access denied!",
            });
        }
        next();
    };
};
export { checkRole };
