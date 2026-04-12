import { Router } from 'express';
import {
  createNewsController,
  deleteNewsController,
  getNewsBySlugController,
  getNewsController,
  updateNewsController,
} from '../controllers/newsController.js';
import { authenticateToken, requireRoles } from '../middlewares/authMiddleware.js';

const newsRouter = Router();

newsRouter.get('/', getNewsController);
newsRouter.get('/slug/:slug', getNewsBySlugController);
newsRouter.post('/', authenticateToken, requireRoles('Admin', 'Employee'), createNewsController);
newsRouter.put('/:id', authenticateToken, requireRoles('Admin', 'Employee'), updateNewsController);
newsRouter.delete('/:id', authenticateToken, requireRoles('Admin'), deleteNewsController);

export default newsRouter;
