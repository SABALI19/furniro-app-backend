import User from "../models/users.js";
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import { createAndSaveOtp } from "../utils/otp.js";
import { sendOtpEmail } from "../utils/email.js";
import { loginValidation } from "../validators/loginValidator.js";
import jwt from "jsonwebtoken";

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

    if (!confirmedUser) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        status: "Error",
        statusCode: httpStatus.UNAUTHORIZED,
        message: "Invalid credentials",
      });
    }
    //generate OTP and save to database
    const { otp } = await createAndSaveOtp(
      existingUser._id,
      Number(process.env.OTP_EXPIRY_MINUTES || 10),
    );

    //send OTP to user's email
    try {
      await sendOtpEmail(existingUser.email, otp);
    } catch (mailError) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "Server Error",
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        message: "An error occurred while sending the OTP.",
        error: mailError.message,
      });
    }

    //create a short-lived JWT token for OTP verification (optional, can be used to track OTP sessions)
    const tempToken = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    return res.status(httpStatus.OK).json({
      status: "Success",
      statusCode: httpStatus.OK,
      message: "OTP sent to email. Please verify to complete login.",
      tempToken: tempToken,
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
