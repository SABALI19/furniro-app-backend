import express from "express"
import { registerUser } from "../auth/register.js"
import { getAllUsers } from "../controllers/users/allUsers.js";
import { getUserById } from "../controllers/users/getUserById.js";
import { deleteUser } from "../controllers/users/deleteUser.js";
import { loginUser} from "../auth/login.js";
import { authenticateUser, checkRole } from "../middlewares/authmiddleware.js";


// create an instance of express router
const router = express.Router();

//define user routes/endpoints
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", authenticateUser, checkRole("admin"), getAllUsers);
router.get("/user-details/:id", authenticateUser, checkRole("admin", "customer"), getUserById);
router.delete("/delete-user/:id", authenticateUser, checkRole("admin"), deleteUser);

 
//export the router
export default router;