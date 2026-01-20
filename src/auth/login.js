import User from "../models/users.js";
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import jwtToken from "../utils/generateToken.js";
import { loginValidation } from "../validators/loginValidator.js";

export const loginUser = async (req, res) => {
  try {
    // Validate the request body
    const { error, value } = loginValidation(req.body);

    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "Validation Error",
        statusCode: httpStatus.BAD_REQUEST,
        message: "Validation failed",
        errors: error.details.map((detail) => detail.message),
      });
    }

    //destructure data from the validated request body
    const { email, password } = value;

    //check if user with email exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "NOT FOUND",
        statusCode: httpStatus.NOT_FOUND,
        message: "User not found.",
      });
    }

    //confirm existing user by comparing passwords
    const confirmedUser = await bcrypt.compare(password, existingUser.password);
    let token = await jwtToken(
      existingUser._id,
      existingUser.email,
      existingUser.role
    );

    if (confirmedUser) {
      return res.status(httpStatus.OK).json({
        status: "Success",
        statusCode: httpStatus.OK,
        message: "Login successful",
        data: existingUser,
        token: token,
      });
    }

    return res.status(httpStatus.UNAUTHORIZED).json({
      status: "Error",
      statusCode: httpStatus.UNAUTHORIZED,
      message: "Invalid credentials",
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "Server Error",
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "An error occurred while logging in.",
      error: error.message,
    });
  }

  
};


