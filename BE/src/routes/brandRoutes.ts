import { Router } from 'express';
import {
  createBrandController,
  deleteBrandController,
  getBrandByIdController,
  getBrandsController,
  updateBrandController,
} from '../controllers/brandController.js';
import { authenticateToken, requireRoles } from '../middlewares/authMiddleware.js';

const brandRouter = Router();

// Brand listing is open so the storefront can display brand info too.
brandRouter.get('/', getBrandsController);
brandRouter.get('/:id', getBrandByIdController);

brandRouter.post('/', authenticateToken, requireRoles('Admin'), createBrandController);
brandRouter.put('/:id', authenticateToken, requireRoles('Admin'), updateBrandController);
brandRouter.delete('/:id', authenticateToken, requireRoles('Admin'), deleteBrandController);

export default brandRouter;
