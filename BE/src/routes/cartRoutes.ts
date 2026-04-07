import { Router } from 'express';
import {
  addCartItemController,
  clearCartController,
  getCartController,
  removeCartItemController,
  updateCartItemController,
} from '../controllers/cartController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const cartRouter = Router();

cartRouter.get('/', authenticateToken, getCartController);
cartRouter.post('/items', authenticateToken, addCartItemController);
cartRouter.patch('/items/:productId', authenticateToken, updateCartItemController);
cartRouter.delete('/items/:productId', authenticateToken, removeCartItemController);
cartRouter.delete('/clear', authenticateToken, clearCartController);

export default cartRouter;
