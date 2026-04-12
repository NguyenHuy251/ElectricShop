import { Router } from 'express';
import {
  deleteCustomerController,
  getCustomerByIdController,
  getCustomersController,
  updateCustomerController,
} from '../controllers/customerController.js';
import { authenticateToken, requireRoles } from '../middlewares/authMiddleware.js';

const customerRouter = Router();

customerRouter.get('/', authenticateToken, requireRoles('Admin', 'Employee'), getCustomersController);
customerRouter.get('/:id', authenticateToken, requireRoles('Admin', 'Employee'), getCustomerByIdController);
customerRouter.put('/:id', authenticateToken, requireRoles('Admin'), updateCustomerController);
customerRouter.delete('/:id', authenticateToken, requireRoles('Admin'), deleteCustomerController);

export default customerRouter;
