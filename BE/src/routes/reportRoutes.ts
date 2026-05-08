import { Router } from 'express';
import {
  getReportSummaryController,
  getRevenueByDateController,
  getTopProductsController,
  createBaoCaoDoanhThuController,
  getBaoCaoDoanhThuListController,
} from '../controllers/reportController.js';
import { authenticateToken, requireRoles } from '../middlewares/authMiddleware.js';

const reportRouter = Router();

reportRouter.get('/summary', authenticateToken, requireRoles('Admin', 'Employee'), getReportSummaryController);
reportRouter.get('/revenue-by-date', authenticateToken, requireRoles('Admin', 'Employee'), getRevenueByDateController);
reportRouter.get('/top-products', authenticateToken, requireRoles('Admin', 'Employee'), getTopProductsController);
reportRouter.post('/snapshots', authenticateToken, requireRoles('Admin', 'Employee'), createBaoCaoDoanhThuController);
reportRouter.get('/snapshots', authenticateToken, requireRoles('Admin', 'Employee'), getBaoCaoDoanhThuListController);

export default reportRouter;
