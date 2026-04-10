import { Router } from 'express';
import {
  createOrderController,
  getMyOrdersController,
  getOrdersController,
  updateOrderStatusController,
} from '../controllers/orderController.js';
import { authenticateToken, requireRoles } from '../middlewares/authMiddleware.js';

const orderRouter = Router();

orderRouter.get('/', authenticateToken, getOrdersController);
orderRouter.get('/my', authenticateToken, getMyOrdersController);
orderRouter.post('/', authenticateToken, createOrderController);
orderRouter.patch('/:id/status', authenticateToken, requireRoles('Admin', 'Employee'), updateOrderStatusController);

export default orderRouter;
