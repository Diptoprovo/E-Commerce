
import CartItem from '../models/cartItemModel.js';
import Item from '../models/itemModel.js';
import Buyer from '../models/buyerModel.js';

export const addToCart = async (req, res) => {
    try {
        const { userId, productId, qty } = req.body;

        const user = await Buyer.findById(userId);
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        if (user.isSeller) return res.json({ success: false, message: "Please use a Buyer account" });

        const product = await Item.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const existingInCart = await CartItem.findOne({ productId, userId });
        if (existingInCart) {
            existingInCart.quantity += Number(qty);
            await existingInCart.save();
        } else {
            const newCartItem = new CartItem({ userId, productId, quantity: qty });
            await newCartItem.save();
            user.cart.push(newCartItem._id);
            await user.save();
        }

        res.status(200).json({ success: true, message: 'Item added to cart', cart: user.cart });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const removeFromCart = async (req, res) => {
    try {

        const { userId, cartItemId, quantity } = req.body;

        const user = await Buyer.findById(userId);
        if (!user) return res.json({ success: false, message: 'User is not authenticated' });

        if (user.isSeller) return res.json({ success: false, message: 'Please login with a Buyer account' });

        const cartItem = await CartItem.findById(cartItemId);


        if (!cartItem) {
            return res.json({ success: false, message: "Item not found in cart" });
        }

        if (quantity >= cartItem.quantity) {
            await CartItem.findByIdAndDelete(cartItem._id);
            user.cart = user.cart.filter(item => item.toString() !== cartItem._id.toString());
        } else {
            cartItem.quantity -= quantity;
            await cartItem.save();
        }

        await user.save();

        res.status(200).json({ success: true, message: "Cart updated" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getCart = async (req, res) => {
    try {

        const { userId } = req.body;

        const user = await Buyer.findById(userId).populate({
            path: 'cart',
            populate: {
                path: 'productId',
                model: 'Item'
            }
        })

        if (!user) return res.status(404).json({ success: false, message: "user not found" });

        if (user.isSeller) return res.json({ success: false, message: 'Seller does not have a cart' });

        const cartWithTotal = user.cart.map(item => ({
            _id: item._id,
            productId: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            imageUrl: item.productId.imageUrl,
            quantity: item.quantity,
            totalPrice: item.quantity * item.productId.price
        }));

        return res.status(200).json({
            success: true,
            message: "Cart details received",
            cart: cartWithTotal
        });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}