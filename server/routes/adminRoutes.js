import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getAllOrders, orderStatusChange } from '../controllers/orderController.js';


const adminRouter = express.Router();

adminRouter.get('/get-all-orders', userAuth, getAllOrders);
adminRouter.post('/change-status', userAuth, orderStatusChange);

export default adminRouter;