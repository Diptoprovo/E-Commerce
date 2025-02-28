import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { addToCart, getCart, removeFromCart } from '../controllers/cartController.js';


const cartRouter = express.Router();

cartRouter.post('/add', userAuth, addToCart);
cartRouter.post('/remove', userAuth, removeFromCart);
cartRouter.get('/', userAuth, getCart);

export default cartRouter;