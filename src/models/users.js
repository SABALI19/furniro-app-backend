
import mongoose from "mongoose";


// user modellss
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true},
        email: { type: String, required: true, unique: true},
        password: { type: String, required: true, min: 6, max: 16},
        role: { type: String, enum: ["admin", "customer"] , default: "customer" },
    },
    
    {timestamps: true}

);

const User = mongoose.model("User", userSchema);
export default User;