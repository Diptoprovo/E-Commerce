

import Buyer from "../models/buyerModel.js";
import Item from "../models/itemModel.js";

export const getItem = async (req, res) => {
    const { userId } = req.body;
    const { productId } = req.query;
    try {
        console.log(productId);
        if (!userId) return res.json({ success: false, message: "Not Authorized. Login again" });

        const user = await Buyer.findById(userId);

        const product = await Item.findById(productId).populate("sellerId", "name email");
        // console.log(user.isSeller + " " + product.sellerId._id == userId);

        // if (user.isSeller && product.sellerId._id !== userId) return res.json({ success: false, message: 'Not authorized' });

        if (!product) {
            return res.json({ success: false, message: "Invalid product id" });
        }
        const productData = {
            id: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            stock: product.stock,
            imageUrl: product.imageUrl,
            seller: {
                id: product.sellerId._id,
                name: product.sellerId.name,
                email: product.sellerId.email
            },
            createdAt: product.createdAt
        };

        return res.json({ success: true, productData });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }


}


export const getItemsForSeller = async (req, res) => {
    const { userId } = req.body;

    if (!userId) return res.json({ success: false, message: "Not Authorized. Login again" });

    const user = await Buyer.findById(userId);
    if (!user.isSeller) return res.json({ success: false, message: "You are not an authorised seller" });

    try {
        const items = await Item.find({ sellerId: userId });
        res.json({ success: true, items });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getAllItems = async (req, res) => {
    const { userId } = req.body;

    //if (!userId) return res.json({ success: false, message: "Not Authorized. Login again" });


    try {
        const items = await Item.find();
        res.json({ success: true, items });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const addItem = async (req, res) => {
    const { userId, name, description, price, category, stock, imageUrl } = req.body;

    if (!userId) return res.json({ success: false, message: "Not Authorized. Login again" });

    if (!name || !description || !price || !category || !stock || !imageUrl) {
        return res.json({ success: false, message: 'All fields are required' });
    }

    const user = await Buyer.findById(userId);
    if (!user.isSeller) return res.json({ success: false, message: "You are not an authorised seller" });
    if (!user.isAccountVerified) return res.json({ success: false, message: "Verify your account before selling" });

    try {
        const existingItem = await Item.findOne({ name });
        if (existingItem) {
            return res.json({ success: false, message: 'Item with the same name already exists' });
        }

        const newItem = new Item({
            sellerId: userId,
            name,
            description,
            price,
            category,
            stock,
            imageUrl
        });

        await newItem.save();
        res.json({ success: true, message: 'Item added successfully', item: newItem });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const addToStock = async (req, res) => {
    const { userId, itemId, qty } = req.body;

    if (!userId) return res.json({ success: false, message: "Not Authorized. Login again" });

    if (!itemId || !qty) {
        return res.json({ success: false, message: 'Item ID and quantity are required' });
    }

    if (qty < 0) return res.json({ success: false, message: 'Cannot reduce stock' });

    try {
        const item = await Item.findById(itemId);
        if (!item) {
            return res.json({ success: false, message: 'Item not found' });
        }

        if (item.sellerId.toString() !== userId) {
            return res.json({ success: false, message: 'Not Authorized. You are not the seller of this item' });
        }
        item.stock += Number(qty);
        await item.save();

        res.json({ success: true, message: 'Stock updated successfully', item });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


export const modifyItem = async (req, res) => {
    const { userId, itemId, description, price, category, imageUrl } = req.body;

    if (!userId) return res.json({ success: false, message: "Not Authorized. Login again" });

    if (!itemId) {
        return res.json({ success: false, message: 'Item ID is required' });
    }

    try {
        const item = await Item.findById(itemId);
        if (!item) {
            return res.json({ success: false, message: 'Item not found' });
        }

        if (item.sellerId.toString() !== userId) {
            return res.json({ success: false, message: 'Not Authorized. You are not the seller of this item' });
        }

        if (description) item.description = description;
        if (price) item.price = price;
        if (category) item.category = category;
        if (imageUrl) item.imageUrl = imageUrl;

        await item.save();

        res.json({ success: true, message: 'Item updated successfully', item });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const removeItem = async (req, res) => {
    const { userId, itemId } = req.body;

    if (!userId) return res.json({ success: false, message: "Not Authorized. Login again" });

    if (!itemId) {
        return res.json({ success: false, message: 'Item ID is required' });
    }
    const item = await Item.findById(itemId);
    if (!item) {
        return res.json({ success: false, message: 'Item not found' });
    }

    if (item.sellerId.toString() !== userId) {
        return res.json({ success: false, message: 'Not Authorized. You are not the seller of this item' });
    }
    try {
        const item = await Item.findByIdAndDelete(itemId);
        if (!item) {
            return res.json({ success: false, message: 'Item not found' });
        }

        res.json({ success: true, message: 'Item removed successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const latest = async (req, res) => {

    try {
        const { userId } = req.body;

        //if (!userId) res.return({ succes: false, message: "Not authorized" })

        const latestItems = await Item.find().sort({ createdAt: -1 }).limit(5);  // Get last 5 added items
        return res.json({ success: true, latest: latestItems });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const items = async (req, res) => {

}