import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Buyer', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Buyer', required: true }, // The seller of this product
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }, // Price at the time of order
    totalAmount: { type: Number, required: true }, // quantity * price
    status: { type: String, enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;