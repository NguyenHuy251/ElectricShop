import { Router } from 'express';
import {
  changePasswordController,
  deleteAccountController,
  getAccountsController,
  loginController,
  registerController,
} from '../controllers/authController.js';
import { authenticateToken, requireRoles } from '../middlewares/authMiddleware.js';

const authRouter = Router();

authRouter.get('/accounts', authenticateToken, requireRoles('Admin'), getAccountsController);
authRouter.post('/login', loginController);
authRouter.post('/register', registerController);
authRouter.put('/change-password', authenticateToken, changePasswordController);
authRouter.delete('/:id', authenticateToken, requireRoles('Admin'), deleteAccountController);

export default authRouter;
