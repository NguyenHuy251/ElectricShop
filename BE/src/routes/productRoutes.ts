import { Router } from 'express';
import {
  createProductController,
  deleteProductImageController,
  deleteProductController,
  getProductByIdController,
  getProductImagesController,
  getProductBySlugController,
  getProductsController,
  updateProductController,
  updateProductStatusController,
} from '../controllers/productController.js';
import { authenticateToken, requireRoles } from '../middlewares/authMiddleware.js';

const productRouter = Router();

productRouter.get('/', getProductsController);
productRouter.get('/slug/:slug', getProductBySlugController);
productRouter.get('/:id/images', getProductImagesController);
productRouter.get('/:id', getProductByIdController);

productRouter.post('/', authenticateToken, requireRoles('Admin'), createProductController);
productRouter.put('/:id', authenticateToken, requireRoles('Admin'), updateProductController);
productRouter.delete('/:id/images/:imageId', authenticateToken, requireRoles('Admin'), deleteProductImageController);
productRouter.delete('/:id', authenticateToken, requireRoles('Admin'), deleteProductController);
productRouter.patch('/:id/status', authenticateToken, requireRoles('Admin'), updateProductStatusController);

export default productRouter;
