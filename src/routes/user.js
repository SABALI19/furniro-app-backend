import express from "express"
import { registerUser } from "../auth/register.js"
import { getAllUsers } from "../controllers/users/allUsers.js";
import { getUserById } from "../controllers/users/getUserById.js";
import { deletUser } from "../controllers/users/deleteUser.js";
import { loginUser} from "../auth/login.js";

// create an instance of express router
const router = express.Router();

//define user routes/endpoints
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", getAllUsers);
router.get("/user-details/:id", getUserById);
router.delete("/delete-user/:id", deletUser);
 
//export the router
export default router