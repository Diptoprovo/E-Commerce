import express from 'express'
import { addComment, getCommentsByProduct } from '../controllers/commentController.js';
import userAuth from '../middleware/userAuth.js';


const commentRouter = express.Router();

commentRouter.get('/get', userAuth, getCommentsByProduct);
commentRouter.post('/add', userAuth, addComment);

export default commentRouter;