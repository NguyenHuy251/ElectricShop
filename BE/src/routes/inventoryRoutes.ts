import { Router } from 'express';
import {
  createImportReceiptController,
  deleteImportReceiptController,
  getImportReceiptByIdController,
  getImportReceiptsController,
  getInventoryStockController,
} from '../controllers/inventoryController.js';
import { authenticateToken, requireRoles } from '../middlewares/authMiddleware.js';

const inventoryRouter = Router();

inventoryRouter.get('/stock', authenticateToken, requireRoles('Admin', 'Employee'), getInventoryStockController);
inventoryRouter.get('/import-receipts', authenticateToken, requireRoles('Admin', 'Employee'), getImportReceiptsController);
inventoryRouter.get('/import-receipts/:id', authenticateToken, requireRoles('Admin', 'Employee'), getImportReceiptByIdController);
inventoryRouter.post('/import-receipts', authenticateToken, requireRoles('Admin', 'Employee'), createImportReceiptController);
inventoryRouter.delete('/import-receipts/:id', authenticateToken, requireRoles('Admin', 'Employee'), deleteImportReceiptController);

export default inventoryRouter;
