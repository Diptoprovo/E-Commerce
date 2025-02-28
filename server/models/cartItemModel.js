import mongoose from "mongoose";

const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Buyer',
        required: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },

}, {
    timestamps: true
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

export default CartItem;