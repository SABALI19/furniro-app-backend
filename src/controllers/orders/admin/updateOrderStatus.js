import Order from "../../../models/Order.js";
import httpStatus from "http-status";

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;    } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};