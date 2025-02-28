import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinaryConfig.js";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "chat_uploads",
        allowed_formats: ["jpg", "png", "gif", "pdf", "mp4", "mp3"],
    },
});

const upload = multer({ storage });

export default upload;