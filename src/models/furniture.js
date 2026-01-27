import mongoose from "mongoose";

const furnitureSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    images: { type: [String], required: true },  // Fixed  
    price: { type: Number, required: true },
    tags: { type: [String], default: [] },  // Fixed
    category: { type: String, required: true },
    description: { type: String, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    inStock: { type: Boolean, default: true },
    quantity: { type: Number, default: 0 },
    discount: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);

// Create and export model
const Furniture = mongoose.model("Furniture", furnitureSchema);
export default Furniture;