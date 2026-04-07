import { Router } from 'express';
import {
  changePasswordController,
  deleteAccountController,
  getAccountsController,
  loginController,
  registerController,
  updateAccountController,
  getCurrentUserController,
} from '../controllers/authController.js';
import { authenticateToken, requireRoles } from '../middlewares/authMiddleware.js';

const authRouter = Router();

authRouter.post('/login', loginController);
authRouter.post('/register', registerController);
authRouter.get('/me', authenticateToken, getCurrentUserController);
authRouter.get('/accounts', authenticateToken, requireRoles('Admin', 'Employee'), getAccountsController);
authRouter.put('/change-password', authenticateToken, changePasswordController);
authRouter.patch('/:id', authenticateToken, updateAccountController);
authRouter.delete('/:id', authenticateToken, requireRoles('Admin'), deleteAccountController);

export default authRouter;
