import axios from "axios";

const PAYSTACK_BASE_URL = process.env.PAYSTACK_BASE_URL || "https://api.paystack.co";

const paystack = axios.create({
 baseURL: PAYSTACK_BASE_URL,
 headers: {
   Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
   "Content-Type": "application/json",
 },
});

export const initializeTransaction = async ({ email, amountKobo, reference, callback_url, metadata }) => {
 // Paystack initialize endpoint: POST /transaction/initialize :contentReference[oaicite:5]{index=5}
 const { data } = await paystack.post("/transaction/initialize", {
   email,
   amount: amountKobo,
   reference,
   callback_url,
   metadata,
 });

 return data; // { status, message, data: { authorization_url, access_code, reference } }
};

export const verifyTransaction = async (reference) => {
 // Verify endpoint: GET /transaction/verify/{reference} :contentReference[oaicite:6]{index=6}
 const { data } = await paystack.get(`/transaction/verify/${reference}`);
 return data; // { status, message, data: {...} }
};
