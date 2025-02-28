import Buyer from "../models/buyerModel.js";
import Item from "../models/itemModel.js";
import Order from "../models/orderModel.js";
import transporter from '../config/nodemailer.js';

export const getOrdersForSeller = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await Buyer.findById(userId);
        if (!user || !user.isSeller) return res.json({ success: false, message: 'Not an authorized seller' });

        const orders = await Order.find({ sellerId: userId })
            .populate('productId', 'name price imageUrl category')

        const response = orders.map(order => ({
            orderId: order._id,
            product: {
                productId: order.productId._id,
                name: order.productId.name,
                price: order.price,
                imageUrl: order.productId.imageUrl
            },
            quantity: order.quantity,
            total: order.totalAmount,
            status: order.status,
            createdAt: order.createdAt
        }));

        res.status(200).json({ success: true, message: "Orders retrieved", response });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getOrdersForBuyer = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await Buyer.findById(userId);
        if (!user || user.isSeller) return res.json({ success: false, message: 'Not an authorized Buyer' });

        const orders = await Order.find({ buyerId: userId })
            .populate('productId', 'name price imageUrl category')
            .populate('sellerId', 'name email');

        const response = orders.map(order => ({
            orderId: order._id,
            product: {
                productId: order.productId._id,
                name: order.productId.name,
                price: order.price,
                imageUrl: order.productId.imageUrl
            },
            seller: {
                id: order.sellerId._id,
                name: order.sellerId.name,
                email: order.sellerId.email
            },
            quantity: order.quantity,
            total: order.totalAmount,
            status: order.status,
            createdAt: order.createdAt
        }));

        res.status(200).json({ success: true, message: "Orders retrieved", response });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getAllOrders = async (req, res) => {
    const { userId } = req.body;

    const user = await Buyer.findById(userId);

    if (!user || user.name !== 'Admin') res.json({ success: false, message: "You do not have Admin privilleges" });

    try {
        const orders = await Order.find()
            .populate('buyerId', 'name email address')
            .populate('sellerId', 'name email')
            .populate('productId', 'name price imageUrl');

        const response = orders.map(order => ({
            orderId: order._id,
            buyer: {
                id: order.buyerId._id,
                name: order.buyerId.name,
                email: order.buyerId.email,
                address: order.buyerId.address
            },
            seller: {
                id: order.sellerId._id,
                name: order.sellerId.name,
                email: order.sellerId.email
            },
            product: {
                productId: order.productId._id,
                name: order.productId.name,
                price: order.price,
                imageUrl: order.productId.imageUrl
            },
            quantity: order.quantity,
            totalAmount: order.totalAmount,
            status: order.status,
            createdAt: order.createdAt
        }));
        res.json({ success: true, message: 'All orders retrieved', response });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }

}

export const placeOrder = async (req, res) => {
    try {

        const { userId } = req.body;
        const user = await Buyer.findById(userId)
            .populate({
                path: 'cart',
                populate: { path: 'productId', select: 'price stock sellerId' }
            });

        if (!user || user.cart.length === 0) {
            return res.json({ success: false, message: 'No items in cart' });
        }

        const orders = [];
        // console.log(user.cart);

        for (const cartItem of user.cart) {
            const product = cartItem.productId;
            // console.log(cartItem);
            if (!product || product.stock < cartItem.quantity) {
                return res.json({ success: false, message: "Product not in stock" });
            }

            const totalAmount = product.price * cartItem.quantity;

            const order = new Order({
                buyerId: userId,
                productId: product._id,
                sellerId: product.sellerId,
                quantity: cartItem.quantity,
                price: product.price,
                totalAmount,
                status: "Pending"
            });

            await order.save();
            orders.push(order);

            await Item.findByIdAndUpdate(product._id, {
                $inc: { stock: -cartItem.quantity }
            });

            const seller = await Buyer.findById(product.sellerId);

            if (user.email) {
                const mailOptions = {
                    from: process.env.SENDER_EMAIL,
                    to: user.email,
                    subject: 'Order Placed Successfully',
                    text: `Your order for ${cartItem.quantity} of ${product.name} has been placed successfully.`
                }
                console.log(mailOptions);
                await transporter.sendMail(mailOptions);
            }

            if (seller.email) {
                const mailOptions = {
                    from: process.env.SENDER_EMAIL,
                    to: seller.email,
                    subject: 'Someone just ordered your product',
                    text: `Someone has just ordered ${cartItem.quantity} of your product ${product.name}. Please check your dashboard for more details`
                }
                console.log(mailOptions);
                await transporter.sendMail(mailOptions);
            }

        }

        return res.json({ success: true, message: 'Order placed successfully' });

    } catch (error) {
        return res.json({ succes: false, message: error.message });
    }
};


export const orderStatusChange = async (req, res) => {
    try {
        const { userId, orderId, status } = req.body;

        const user = await Buyer.findById(userId);

        if (!user || user.name !== 'Admin') return res.json({ success: false, message: 'User does not have admin privilleges' });

        if (status === 'Delivered') {
            const order = await Order.findByIdAndDelete(orderId);
            if (order) return res.json({ success: true, message: 'Order Removed' });
            if (!order) return res.json({ success: false, message: 'Invalid order ID' });
        }

        const order = await Order.findByIdAndUpdate(orderId,
            { status: status }
        );

        if (!order) return res.json({ success: false, message: 'Order ID is invalid' });

        return res.json({ success: true, message: 'Order status has been updated', order });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}