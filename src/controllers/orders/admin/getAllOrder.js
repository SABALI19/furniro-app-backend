import Order from "../../../models/orders.js";
import httpStatus from "http-status"; 
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 });

        res.status(httpStatus.OK).json({
            status: "Success",
            message: "Orders retrieved successfully",  
            data: orders,
        })
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
};
