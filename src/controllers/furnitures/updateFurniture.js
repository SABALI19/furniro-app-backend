import Furniture from "../../models/furniture.js";
import httpsStatus from "http-status";

//update furniture controller
export const updateFurniture = async (req, res) => {
    try {
        //step 1: restucture furniture details from req.body
        const {
            name: name,
            price: price,
            category: category,
            tags: tags,
            description: description,
            size: size,
            color: color,
            inStock: inStock,
            quantity: quantity,
            discount: discount
        } = req.body;
        const { id } = req.params;
        //step 2: check if furniture with the given id exists
        if (!existingFurniture) {
            return res.status(httpsStatus.NOT_FOUND).json({
                status: "Error",
                message: "Furniture with the given ID does not exist",
            });
        } else {
            //step 3: update furniture details
            existingFurniture.name = name || existingFurniture.name;
            existingFurniture.price = price || existingFurniture.price;
            existingFurniture.category = category || existingFurniture.category;
            existingFurniture.tags = tags || existingFurniture.tags;
            existingFurniture.description = description || existingFurniture.description;
            existingFurniture.size = size || existingFurniture.size;
            existingFurniture.color = color || existingFurniture.color;
            existingFurniture.inStock = inStock || existingFurniture.inStock;
            existingFurniture.quantity = quantity || existingFurniture.quantity;
            existingFurniture.discount = discount || existingFurniture.discount;
            //step 4: save upload furniture to database
            await existingFurniture.save();

            //step 5: send response back to the client
            return res.status(httpsStatus.OK).json({
                status: "Success",
                message: "Furniture updated successfully",
                data: existingFurniture,
            });
        }
    } catch (error) {
        return res.status(httpsStatus.INTERNAL_SERVER_ERROR).json({
            status: "Error",
            message: "Internal Server Error",
            error: error.message,
        });
    }
};