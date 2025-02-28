import Comment from "../models/commentModel.js";
import Item from "../models/itemModel.js";
import Buyer from "../models/buyerModel.js";

// Add a comment
export const addComment = async (req, res) => {
    try {
        const { productId, userId, stars, text } = req.body;

        // Validate required fields
        if (!productId || !userId || !stars || !text) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        // Check if product exists
        const productExists = await Item.findById(productId);
        if (!productExists) {
            return res.status(404).json({ success: false, message: "Item not found." });
        }

        // Check if user exists
        const userExists = await Buyer.findById(userId);
        if (!userExists) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Create new comment
        const newComment = new Comment({ productId, userId, stars, text });
        await newComment.save();

        res.status(201).json({ success: true, message: "Comment added successfully!", comment: newComment });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// Retrieve comments for a specific product
export const getCommentsByProduct = async (req, res) => {
    try {
        const { userId } = req.body;
        const { productId } = req.query;

        console.log(productId, userId);

        if (!userId) return res.json({ success: false, message: "Not Authorized. Login again" });

        // Validate product ID
        if (!productId) {
            return res.json({ success: false, message: "Product ID is required." });
        }

        // Fetch comments with user details
        const comments = await Comment.find({ productId })
            .populate("userId", "name email") // Include user name and email
            .sort({ createdAt: -1 }); // Sort by latest comments first

        res.status(200).json({ success: true, comments });
    } catch (error) {
        res.json({ success: false, message: "Internal Server Error", error: error.message });
    }
};
