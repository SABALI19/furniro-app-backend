import express  from 'express'
import { createFurniture } from '../controllers/furnitures/createFurniture.js'
import { fetchAllFurniture } from '../controllers/furnitures/getAllFurniture.js';

// create an instance of router
const router = express.Router();

// Define routes with appropriate HTTP methods
router.post("/create", createFurniture); // POST /api/furniture/create
router.get("/all-furniture", fetchAllFurniture);      // GET /api/furniture


//export the router
export default router