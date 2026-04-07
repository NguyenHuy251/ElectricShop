import { Router } from 'express';
import {
  getReportSummaryController,
  getRevenueByDateController,
  getTopProductsController,
} from '../controllers/reportController.js';
import { authenticateToken, requireRoles } from '../middlewares/authMiddleware.js';

const reportRouter = Router();

reportRouter.get('/summary', authenticateToken, requireRoles('Admin', 'Employee'), getReportSummaryController);
reportRouter.get('/revenue-by-date', authenticateToken, requireRoles('Admin', 'Employee'), getRevenueByDateController);
reportRouter.get('/top-products', authenticateToken, requireRoles('Admin', 'Employee'), getTopProductsController);

export default reportRouter;
