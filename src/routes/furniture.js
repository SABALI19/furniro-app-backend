import express  from 'express'
import { createFurniture } from '../controllers/furnitures/createFurniture.js'
import { fetchAllFurniture } from '../controllers/furnitures/getAllFurniture.js';
import { deleteFurniture } from '../controllers/furnitures/deleteFurniture.js';
import { updateFurniture } from '../controllers/furnitures/updateFurniture.js';
import upload from '../middlewares/upload.js';
import { authenticateUser, checkRole } from '../middlewares/authmiddleware.js';
import { getSingleFurniture } from '../controllers/furnitures/getSingleFurniture.js';


// create an instance of router
const router = express.Router();

// Define routes with appropriate HTTP methods
router.post("/create", 
     authenticateUser,
     checkRole("admin"),
     upload.array("images", 5),
      createFurniture); // POST /api/furniture/create
router.get("/all-furniture", fetchAllFurniture);      // GET /api/furniture
router.get("/furniture-details/:id", getSingleFurniture); // GET /api/furniture/furniture-details/:id
router.put("/update-furniture/:id", authenticateUser, checkRole("admin"), updateFurniture);
router.delete("/delete-furniture/:id", authenticateUser, checkRole("admin"), deleteFurniture); // DELETE /api/furniture/delete-furniture/:id
router.get("/furniture-details/:id", getSingleFurniture); // GET /api/furniture/furniture-details/:id


//export the router
export default router;