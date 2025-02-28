import Buyer from "../models/buyerModel.js";



export const getUserData = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await Buyer.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            userData: user
        })
    } catch (error) {
        res.json({ success: false, message: error.message });

    }
}