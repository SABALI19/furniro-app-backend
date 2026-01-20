import JWT from "jsonwebtoken";
 //load environment variables from .env file
 import dotenv from "dotenv";
dotenv.config();

const { JWT_SECRET, JWT_EXPIRY } = process.env;

 const jwtToken = async (id, email, role) => {
    return JWT.sign({ id, email, role}, JWT_SECRET, {
        expiresIn: JWT_EXPIRY,
    });
};

export default jwtToken;