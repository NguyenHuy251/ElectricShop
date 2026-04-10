import { Router } from 'express';
import {
  createEmployeeController,
  deleteEmployeeController,
  getEmployeeByIdController,
  getEmployeesController,
  updateEmployeeController,
} from '../controllers/employeeController.js';
import { authenticateToken, requireRoles } from '../middlewares/authMiddleware.js';

const employeeRouter = Router();

employeeRouter.get('/', authenticateToken, requireRoles('Admin', 'Employee'), getEmployeesController);
employeeRouter.get('/:id', authenticateToken, requireRoles('Admin', 'Employee'), getEmployeeByIdController);

employeeRouter.post('/', authenticateToken, requireRoles('Admin'), createEmployeeController);
employeeRouter.put('/:id', authenticateToken, requireRoles('Admin'), updateEmployeeController);
employeeRouter.delete('/:id', authenticateToken, requireRoles('Admin'), deleteEmployeeController);

export default employeeRouter;
