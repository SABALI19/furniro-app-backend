import crypto from "crypto";
import Order from "../../models/orders.js";
import { initializeTransaction, verifyTransaction } from "../../services/paystackService.js";

/**
* POST /api/payments/paystack/initialize
* Body: { orderId }
* Auth: protect
*/
export const paystackInitialize = async (req, res) => {
 try {
   const { orderId } = req.body;

   const order = await Order.findById(orderId).populate("user", "email name");
   if (!order) return res.status(404).json({ message: "Order not found" });

   // Optional: ensure only owner can pay (unless admin)
   if (order.user._id.toString() !== req.user._id.toString()) {
     return res.status(403).json({ message: "Not allowed" });
   }

   if (order.isPaid) {
     return res.status(400).json({ message: "Order already paid" });
   }

   // Critical: amount must come from YOUR DB, not from frontend
   const amountKobo = Math.round(order.totalPrice * 100); // Paystack expects subunit (kobo) :contentReference[oaicite:7]{index=7}

   // Create a unique reference (can be anything unique)
   // Keep it deterministic-ish for debugging, but unique enough.
   const reference = `ORD_${order._id}_${Date.now()}`;

   const metadata = {
     orderId: order._id.toString(),
     userId: req.user._id.toString(),
     custom_fields: [
       { display_name: "Order ID", variable_name: "order_id", value: order._id.toString() },
     ],
   };

   const init = await initializeTransaction({
     email: order.user.email,
     amountKobo,
     reference,
     callback_url: process.env.PAYSTACK_CALLBACK_URL,
     metadata,
   });

   if (!init.status) {
     return res.status(400).json({ message: init.message || "Failed to initialize Paystack" });
   }

   // Save reference on order (so you can match later)
   order.paymentResult = {
     provider: "paystack",
     reference: init.data.reference,
   };
   await order.save();

   return res.json({
     authorizationUrl: init.data.authorization_url,
     accessCode: init.data.access_code,
     reference: init.data.reference,
   });
 } catch (error) {
   return res.status(500).json({ message: "Paystack init failed", error: error.message });
 }
};

/**
* GET /api/payments/paystack/verify/:reference
* Auth: protect
*/
export const paystackVerify = async (req, res) => {
 try {
   const { reference } = req.params;

   const verification = await verifyTransaction(reference);

   if (!verification.status) {
     return res.status(400).json({ message: verification.message || "Verification failed" });
   }

   const trx = verification.data;

   // trx.status is Paystack transaction status (e.g. "success") :contentReference[oaicite:8]{index=8}
   if (trx.status !== "success") {
     return res.status(400).json({ message: `Transaction not successful: ${trx.status}`, trx });
   }

   // Find the order by reference you saved earlier
   const order = await Order.findOne({ "paymentResult.reference": reference }).populate("user", "email");
   if (!order) {
     return res.status(404).json({ message: "Order for this reference not found" });
   }

   // Optional: owner check
   if (order.user._id.toString() !== req.user._id.toString()) {
     return res.status(403).json({ message: "Not allowed" });
   }

   // SECURITY CHECKS:
   // 1) Verify amount matches your order total (Paystack returns amount in kobo)
   const expectedAmountKobo = Math.round(order.totalPrice * 100);
   if (trx.amount !== expectedAmountKobo) {
     return res.status(400).json({
       message: "Amount mismatch. Possible tampering.",
       expectedAmountKobo,
       paidAmountKobo: trx.amount,
     });
   }

   // 2) Verify currency if you want strict checks
   if (trx.currency !== "NGN") {
     return res.status(400).json({ message: "Currency mismatch", currency: trx.currency });
   }

   // If already paid, just return (idempotent)
   if (order.isPaid) {
     return res.json({ message: "Order already marked as paid", order });
   }

   // Mark paid (only after verification!)
   order.isPaid = true;
   order.paidAt = new Date();
   order.orderStatus = "processing"; // or keep pending if you prefer

   order.paymentResult = {
     provider: "paystack",
     reference,
     transactionId: trx.id?.toString(),
     status: trx.status,
     channel: trx.channel,
     currency: trx.currency,
     paidAmount: trx.amount / 100, // convert back to NGN
     customerEmail: trx.customer?.email,
     raw: trx, // optional: keep raw for audit
   };

   await order.save();

   return res.json({ message: "Payment verified and order marked as paid", order });
 } catch (error) {
   return res.status(500).json({ message: "Paystack verify failed", error: error.message });
 }
};

/**
* POST /api/payments/paystack/webhook
* Auth: none (Paystack calls this)
*
* Webhooks carry x-paystack-signature which is HMAC SHA512 of the raw payload signed with your secret key. :contentReference[oaicite:9]{index=9}
*/
export const paystackWebhook = async (req, res) => {
 try {
   const signature = req.headers["x-paystack-signature"];

   // IMPORTANT: req.body must be raw string/buffer for signature verification
   const rawBody = req.rawBody;

   const expected = crypto
     .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
     .update(rawBody)
     .digest("hex");

   if (!signature || signature !== expected) {
     return res.status(400).send("Invalid signature");
   }

   const event = JSON.parse(rawBody.toString("utf-8"));

   // Example event: charge.success (Paystack sends successful payments) :contentReference[oaicite:10]{index=10}
   if (event.event === "charge.success") {
     const data = event.data;
     const reference = data.reference;

     const order = await Order.findOne({ "paymentResult.reference": reference });
     if (order && !order.isPaid) {
       const expectedAmountKobo = Math.round(order.totalPrice * 100);

       // Verify amount
       if (data.amount === expectedAmountKobo && data.status === "success") {
         order.isPaid = true;
         order.paidAt = new Date();
         order.orderStatus = "processing";

         order.paymentResult = {
           provider: "paystack",
           reference,
           transactionId: data.id?.toString(),
           status: data.status,
           channel: data.channel,
           currency: data.currency,
           paidAmount: data.amount / 100,
           customerEmail: data.customer?.email,
           raw: data,
         };

         await order.save();
       }
     }
   }

   // Paystack expects 200 quickly
   return res.sendStatus(200);
 } catch (error) {
   return res.status(500).send("Webhook error");
 }
};
