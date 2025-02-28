import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { addItem, addToStock, getAllItems, getItem, getItemsForSeller, latest, modifyItem, removeItem } from '../controllers/itemController.js';
import upload from '../config/upload.js';

const itemRouter = express.Router();

itemRouter.get('/get', userAuth, getItem);
itemRouter.get('/all', userAuth, getAllItems);
itemRouter.get('/', userAuth, getItemsForSeller);
itemRouter.get('/latest', userAuth, latest);
itemRouter.post('/add-item', userAuth, addItem);
itemRouter.put('/add-to-stock', userAuth, addToStock);
itemRouter.put('/modify', userAuth, modifyItem);
itemRouter.post('/remove', userAuth, removeItem);
itemRouter.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.json({ success: false, message: 'Image upload failed' });
    }
    res.json({ success: true, imageUrl: req.file.path });
});

export default itemRouter;