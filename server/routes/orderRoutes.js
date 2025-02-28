import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getAllOrders, getOrdersForBuyer, getOrdersForSeller, placeOrder } from '../controllers/orderController.js';


const orderRouter = express.Router();


orderRouter.get('/get-seller', userAuth, getOrdersForSeller);
orderRouter.get('/get-buyer', userAuth, getOrdersForBuyer);
orderRouter.post('/place-order', userAuth, placeOrder);

export default orderRouter;
