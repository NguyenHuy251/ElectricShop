import { Router } from 'express';
import {
  createVoucherController,
  deleteVoucherController,
  getVoucherByIdController,
  getVouchersController,
  updateVoucherController,
} from '../controllers/voucherController.js';
import { authenticateToken, requireRoles } from '../middlewares/authMiddleware.js';

const voucherRouter = Router();

voucherRouter.get('/', authenticateToken, getVouchersController);
voucherRouter.get('/:id', authenticateToken, getVoucherByIdController);

voucherRouter.post('/', authenticateToken, requireRoles('Admin'), createVoucherController);
voucherRouter.put('/:id', authenticateToken, requireRoles('Admin'), updateVoucherController);
voucherRouter.delete('/:id', authenticateToken, requireRoles('Admin'), deleteVoucherController);

export default voucherRouter;
