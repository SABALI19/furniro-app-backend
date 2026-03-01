import Furniture from "../../../models/furniture.js";
import Order from "../../../models/orders.js";

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    // get the logged in user from JWT payload
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    let itemsPrice = 0;
    const processedItems = [];

    for (const item of orderItems) {
      const furniture = await Furniture.findById(item.furnitureId);
      if (!furniture) {
        return res.status(404).json({ message: "Furniture not found" });
      }
      if (furniture.quantity < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${furniture.name}`,
        });
      }

      const priceAfterDiscount =
        furniture.price - (furniture.price * furniture.discount) / 100;

      itemsPrice += priceAfterDiscount * item.quantity;

      processedItems.push({
        furniture: furniture._id,
        name: furniture.name,
        image: furniture.images[0],
        price: priceAfterDiscount,
        quantity: item.quantity,
      });

      // deduct stock
    }

    const taxPrice = itemsPrice * 0.075; // Example tax calculation
    const shippingPrice = itemsPrice > 500000 ? 0 : 10000;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    const order = await Order.create({
      user: userId,
      orderItems: processedItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
};
