import express from "express";
import { createOrder } from "../controllers/orders/users/orderController.js";
import { authenticateUser, checkRole } from "../middlewares/authmiddleware.js";
import { getMyOrders } from "../controllers/orders/users/getMyOrders.js";
import { getAllOrders } from "../controllers/orders/admin/getAllOrder.js";

const router = express.Router();

router.post("/", authenticateUser, checkRole("customer"), createOrder);
router.get("/my-orders", authenticateUser, checkRole("customer", "admin"), getMyOrders);
router.get("/", authenticateUser, checkRole("admin"), getAllOrders);
// router.get("/", authenticateUser, checkRole("admin"), getMyOrders);
// router.get("/", authenticateUser, checkRole("adminOnly"), getAllOrders);
// router.put("/.id/status", protect , adminonly, updateOrderStatus);

export default router;
