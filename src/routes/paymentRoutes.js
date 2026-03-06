import express from "express";
import {
  paystackInitialize,
  paystackVerify,
  paystackWebhook,
} from "../controllers/payments/paymentController.js";
import { authenticateUser, checkRole } from "../middlewares/authmiddleware.js";


const router = express.Router();

router.post("/paystack/initialize", authenticateUser, checkRole("customer", "admin"), paystackInitialize);
router.get("/paystack/verify/:reference", authenticateUser, checkRole("customer", "admin"), paystackVerify);

// Webhook: no auth, Paystack calls it
router.post("/paystack/webhook", paystackWebhook);

export default router;

