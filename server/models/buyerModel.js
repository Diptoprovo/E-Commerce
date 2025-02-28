import mongoose from 'mongoose';

const buyerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    verifyOtp: { type: String, default: '' },
    verifyOtpExpireAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: '' },
    resetOtpExpire: { type: Number, default: 0 },
    cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CartItem',
        }],
    isSeller: { type: Boolean, default: false },
});

const Buyer = mongoose.models.buyer || mongoose.model('Buyer', buyerSchema);

export default Buyer;