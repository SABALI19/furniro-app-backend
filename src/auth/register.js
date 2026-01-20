
import User from "../models/users.js"
import httpstatus, { status } from "http-status"
import { registerSchema } from "../validators/registerValidator.js";
import bcrypt from "bcrypt"


// register new User

export const registerUser = async (req, res) => {
    try {
        //Validate the request body(user inputs)
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return res.status(httpstatus.BAD_REQUEST).json({
                status: "validation Error",
                message: error.details[0].message,
            });
        }
        //step1 extract user details from the request body
        const { name, email, password, role } = req.body;

        //step2 check if the user already exist
        const existingUser = await User.findOne({email})
        if (existingUser) {
            return res.status(httpstatus.CONFLICT).json({
                message: "user with this email already exist.",
            });
        }

        //step 3
        const hashedPassword = await bcrypt.hash(password, 10);


        //step create a new user instance
        const newUser = new User({name, email, password: hashedPassword, role});
        await newUser.save();

        //step4: send a success response
        return res.status(httpstatus.CREATED).json({
            message: "User registered sucessfully.",
            data: newUser,
        })

        //step5: handle errors
    } catch(error) {
        return res.status (httpstatus.INTERNAL_SERVER_ERROR).json ({
            message: "An error occured while registering the user.",
            error: error.message,
        });
    }
};