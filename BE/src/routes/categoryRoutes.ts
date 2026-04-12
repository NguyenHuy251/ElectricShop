import { Router } from 'express';
import {
  createCategoryController,
  deleteCategoryController,
  getCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
} from '../controllers/categoryController.js';
import { authenticateToken, requireRoles } from '../middlewares/authMiddleware.js';

const categoryRouter = Router();

categoryRouter.get('/', getCategoriesController);
categoryRouter.get('/:id', getCategoryByIdController);

categoryRouter.post('/', authenticateToken, requireRoles('Admin'), createCategoryController);
categoryRouter.put('/:id', authenticateToken, requireRoles('Admin'), updateCategoryController);
categoryRouter.delete('/:id', authenticateToken, requireRoles('Admin'), deleteCategoryController);

export default categoryRouter;
