import { Router } from 'express';
import {
  createReviewController,
  deleteReviewController,
  getReviewsByProductController,
  getReviewsController,
  updateReviewController,
} from '../controllers/reviewController.js';
import { authenticateToken, requireRoles } from '../middlewares/authMiddleware.js';

const reviewRouter = Router();

reviewRouter.get('/', getReviewsController);
reviewRouter.get('/product/:id', getReviewsByProductController);
reviewRouter.post('/', authenticateToken, createReviewController);
reviewRouter.patch('/:id', authenticateToken, updateReviewController);
reviewRouter.delete('/:id', authenticateToken, deleteReviewController);

export default reviewRouter;
