import { Router } from 'express';
import {
  getInvoiceByOrderIdController,
  getInvoicesController,
} from '../controllers/invoiceController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const invoiceRouter = Router();

invoiceRouter.get('/', authenticateToken, getInvoicesController);
invoiceRouter.get('/order/:orderId', authenticateToken, getInvoiceByOrderIdController);

export default invoiceRouter;
