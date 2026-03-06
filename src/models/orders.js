import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  furniture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Furniture",
    required: true,
  },
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  Phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
});

const paymentResultSchema = new mongoose.Schema(
  {
    provider: { type: String }, // "paystack"
    reference: { type: String, index: true },
    transactionId: { type: String },
    status: { type: String }, // "success", "failed", ...
    channel: { type: String }, // "card", "bank", ...
    currency: { type: String }, // "NGN"
    paidAmount: { type: Number }, // in base unit (NGN), not kobo
    customerEmail: { type: String },
    raw: { type: Object }, // store Paystack response (optional)
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [orderItemSchema],

    shippingAddressSchema: shippingAddressSchema,

    paymentMethod: {
      type: String,
      required: true,
      enum: ["card", "bank_transfer, cash_on_delivery"],
    },
    itemsPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true },

    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },

       // store gateway proof
   paymentResult: paymentResultSchema,


    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
