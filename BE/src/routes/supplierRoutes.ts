import { Router } from 'express';
import {
  createSupplierController,
  deleteSupplierController,
  getSupplierByIdController,
  getSuppliersController,
  updateSupplierController,
} from '../controllers/supplierController.js';
import { authenticateToken, requireRoles } from '../middlewares/authMiddleware.js';

const supplierRouter = Router();

supplierRouter.get('/', authenticateToken, requireRoles('Admin', 'Employee'), getSuppliersController);
supplierRouter.get('/:id', authenticateToken, requireRoles('Admin', 'Employee'), getSupplierByIdController);

supplierRouter.post('/', authenticateToken, requireRoles('Admin'), createSupplierController);
supplierRouter.put('/:id', authenticateToken, requireRoles('Admin'), updateSupplierController);
supplierRouter.delete('/:id', authenticateToken, requireRoles('Admin'), deleteSupplierController);

export default supplierRouter;
